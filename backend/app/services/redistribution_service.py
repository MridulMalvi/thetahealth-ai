import uuid
from datetime import datetime, timezone
from typing import List, Optional
from app.schemas.supply_chain import (
    TransferRecommendation,
    TransferStatus,
    FacilityResourceBalance,
    ResourceBalanceStatus,
    Shipment,
    SupplyChainSummary,
)
from app.repositories.facility_repo import facility_repository
from app.repositories.firestore_repo import firestore_repository

class RedistributionService:
    def __init__(self, facility_repo=facility_repository, firestore_repo=firestore_repository):
        self.facility_repo = facility_repo
        self.firestore_repo = firestore_repo
        self._recommendations: List[TransferRecommendation] = [
            TransferRecommendation(
                recommendation_id="REC-TX-8831",
                source_facility_id="FAC-UP-MEE-001",
                source_facility_name="District Hospital Meerut",
                target_facility_id="FAC-UP-MEE-003",
                target_facility_name="PHC Rampur",
                medicine_id="MED-DOX-100",
                medicine_name="Doxycycline 100mg Capsules",
                batch_number="DOX-2026-A1",
                quantity=400,
                unit="strips",
                distance_km=18.4,
                estimated_transit_hours=0.75,
                match_confidence=0.98,
                urgency_level="CRITICAL",
                reasoning="PHC Rampur has 2.1 days of supply remaining under Dengue vector surge (+68% burn rate). District Hospital Meerut has 950 surplus units (28 days of supply). Redistribution resolves deficit with 0 impact on donor hospital safety buffer.",
                status=TransferStatus.PROPOSED,
                created_at=datetime.now(timezone.utc).isoformat(),
            ),
            TransferRecommendation(
                recommendation_id="REC-TX-8832",
                source_facility_id="FAC-UP-LKO-001",
                source_facility_name="Central Medical Warehouse Lucknow",
                target_facility_id="FAC-UP-MEE-003",
                target_facility_name="PHC Rampur",
                medicine_id="MED-ART-60",
                medicine_name="Artesunate 60mg Injection",
                batch_number="ART-662-X1",
                quantity=50,
                unit="vials",
                distance_km=430.0,
                estimated_transit_hours=6.5,
                match_confidence=0.94,
                urgency_level="HIGH",
                reasoning="Replenishes antimalarial injection buffer before seasonal peak.",
                status=TransferStatus.PROPOSED,
                created_at=datetime.now(timezone.utc).isoformat(),
            ),
        ]

        self._shipments: List[Shipment] = [
            Shipment(
                shipment_id="SHP-9901",
                origin_name="Central Medical Warehouse Lucknow",
                destination_name="District Hospital Meerut",
                medicine_name="Normal Saline 0.9% IV (500ml)",
                quantity=1200,
                unit="bottles",
                status="IN_TRANSIT",
                eta="Today, 18:30 IST",
                delay_days=0,
                corridor_status="CLEAR",
                carrier_name="UP Medical Logistics Express",
            ),
            Shipment(
                shipment_id="SHP-9902",
                origin_name="Cipla Pharma Plant Baddi",
                destination_name="Central Medical Warehouse Lucknow",
                medicine_name="Oral Rehydration Salts (WHO Formula)",
                quantity=15000,
                unit="sachets",
                status="DELAYED",
                eta="Oct 01, 2026",
                delay_days=4,
                corridor_status="WEATHER_DELAY",
                carrier_name="North Corridor Freightlines",
            ),
        ]

    def get_summary(self) -> SupplyChainSummary:
        balances = self.get_facility_balances()
        surplus_count = sum(1 for b in balances if b.balance_status == ResourceBalanceStatus.SURPLUS)
        deficit_count = sum(1 for b in balances if b.balance_status == ResourceBalanceStatus.NEEDS_RESOURCE)
        pending_recs = [r for r in self._recommendations if r.status == TransferStatus.PROPOSED]

        return SupplyChainSummary(
            total_shipments_in_transit=len([s for s in self._shipments if s.status == "IN_TRANSIT"]),
            surplus_nodes_count=surplus_count,
            deficit_nodes_count=deficit_count,
            pending_recommendations_count=len(pending_recs),
            recommendations=self._recommendations,
            shipments=self._shipments,
            facility_balances=balances,
        )

    def get_facility_balances(self) -> List[FacilityResourceBalance]:
        facilities = self.facility_repo.list_facilities()
        results: List[FacilityResourceBalance] = []

        for f in facilities:
            dt = f.digital_twin
            if dt.resilience_score >= 90:
                bal = ResourceBalanceStatus.SURPLUS
                surplus = ["Normal Saline IV", "Paracetamol 500mg", "Doxycycline 100mg"]
                deficit = []
            elif dt.resilience_score < 70:
                bal = ResourceBalanceStatus.NEEDS_RESOURCE
                surplus = []
                deficit = ["Doxycycline 100mg (2.1 days)", "Artesunate 60mg (4.5 days)"]
            else:
                bal = ResourceBalanceStatus.NEUTRAL
                surplus = []
                deficit = []

            results.append(
                FacilityResourceBalance(
                    facility_id=f.id,
                    facility_name=f.name,
                    state_name=f.state_name,
                    district_name=f.district_name,
                    facility_type=f.type.value,
                    balance_status=bal,
                    resilience_score=dt.resilience_score,
                    surplus_items=surplus,
                    deficit_items=deficit,
                )
            )
        return results

    def approve_recommendation(self, recommendation_id: str, decided_by: str) -> Optional[TransferRecommendation]:
        for rec in self._recommendations:
            if rec.recommendation_id == recommendation_id:
                rec.status = TransferStatus.APPROVED
                rec.decided_at = datetime.now(timezone.utc).isoformat()
                rec.decided_by = decided_by

                # Add a new active shipment
                new_shipment = Shipment(
                    shipment_id=f"SHP-{uuid.uuid4().hex[:4].upper()}",
                    origin_name=rec.source_facility_name,
                    destination_name=rec.target_facility_name,
                    medicine_name=rec.medicine_name,
                    quantity=rec.quantity,
                    unit=rec.unit,
                    status="IN_TRANSIT",
                    eta="In 45 minutes",
                    delay_days=0,
                    corridor_status="CLEAR",
                    carrier_name="Emergency Transit Unit #04",
                )
                self._shipments.insert(0, new_shipment)

                # Resolve critical alert for recipient facility
                self.firestore_repo.resolve_alert("ALT-001")

                # Update recipient facility resilience
                target_fac = self.facility_repo.get_by_id(rec.target_facility_id)
                if target_fac:
                    target_fac.digital_twin.resilience_score = 86.4
                    target_fac.digital_twin.risk_level = "LOW"
                    target_fac.digital_twin.inventory.critical_stockouts_count = 0
                    target_fac.digital_twin.inventory.days_of_supply_avg = 12.8

                return rec
        return None

    def reject_recommendation(self, recommendation_id: str, decided_by: str) -> Optional[TransferRecommendation]:
        for rec in self._recommendations:
            if rec.recommendation_id == recommendation_id:
                rec.status = TransferStatus.REJECTED
                rec.decided_at = datetime.now(timezone.utc).isoformat()
                rec.decided_by = decided_by
                return rec
        return None

redistribution_service = RedistributionService()
