import uuid
from datetime import datetime, timezone
from typing import List, Optional
from app.repositories.firestore_repo import firestore_repository
from app.repositories.facility_repo import facility_repository
from app.schemas.operational_state import (
    InventoryTransaction,
    InventoryTransactionCreate,
    TransactionType,
    BedUpdateEvent,
    StaffAttendanceEvent,
    OperationalAlert,
    AlertSeverity,
)

class OperationalStateService:
    def __init__(self, firestore_repo=firestore_repository, facility_repo=facility_repository):
        self.firestore_repo = firestore_repo
        self.facility_repo = facility_repo

    def record_inventory_transaction(
        self,
        payload: InventoryTransactionCreate,
        created_by: str
    ) -> InventoryTransaction:
        facility = self.facility_repo.get_by_id(payload.facility_id)
        current_balance = 500  # Baseline stock estimate

        if payload.type == TransactionType.RECEIVED or payload.type == TransactionType.TRANSFERRED_IN:
            current_balance += payload.quantity
        elif payload.type in [TransactionType.CONSUMED, TransactionType.TRANSFERRED_OUT, TransactionType.EXPIRED_DISCARDED]:
            current_balance = max(0, current_balance - payload.quantity)

        tx = InventoryTransaction(
            transaction_id=f"TX-{uuid.uuid4().hex[:8].upper()}",
            facility_id=payload.facility_id,
            medicine_id=payload.medicine_id,
            medicine_name=payload.medicine_name,
            batch_number=payload.batch_number,
            type=payload.type,
            quantity=payload.quantity,
            unit=payload.unit,
            source=payload.source,
            created_by=created_by,
            created_at=datetime.now(timezone.utc).isoformat(),
            notes=payload.notes,
            balance_after=current_balance,
        )

        # Mutate facility Digital Twin state in real time
        if facility:
            facility.digital_twin.last_sync_timestamp = tx.created_at
            if payload.type == TransactionType.CONSUMED:
                # Small increment in footfall upon dispensation
                facility.digital_twin.patient_footfall_today += 1

        return self.firestore_repo.record_transaction(tx)

    def update_bed_state(self, event: BedUpdateEvent) -> dict:
        facility = self.facility_repo.get_by_id(event.facility_id)
        if not facility:
            return {"status": "error", "message": "Facility not found"}

        facility.digital_twin.beds.general_occupied = event.general_occupied
        facility.digital_twin.beds.icu_occupied = event.icu_occupied
        facility.digital_twin.beds.emergency_occupied = event.emergency_occupied
        facility.digital_twin.last_sync_timestamp = datetime.now(timezone.utc).isoformat()

        tot = facility.digital_twin.beds.total_beds
        occ = facility.digital_twin.beds.total_occupied
        occ_rate = (occ / tot * 100) if tot > 0 else 0

        # Check if high occupancy requires an alert
        if occ_rate > 90:
            alert = OperationalAlert(
                alert_id=f"ALT-{uuid.uuid4().hex[:6].upper()}",
                facility_id=facility.id,
                facility_name=facility.name,
                title=f"Bed Surge Warning: {occ_rate:.1f}% Occupied",
                message=f"Critical occupancy at {facility.name} ({occ}/{tot} beds). Consider triage divert.",
                severity=AlertSeverity.WARNING,
                category="BED_CAPACITY",
                created_at=datetime.now(timezone.utc).isoformat(),
                action_required="Notify Regional Logistics Coordinator"
            )
            self.firestore_repo.add_alert(alert)

        return {
            "status": "success",
            "facility_id": facility.id,
            "total_beds": tot,
            "occupied_beds": occ,
            "occupancy_rate": round(occ_rate, 1),
            "updated_at": facility.digital_twin.last_sync_timestamp
        }

    def record_attendance(self, event: StaffAttendanceEvent) -> dict:
        facility = self.facility_repo.get_by_id(event.facility_id)
        if facility:
            facility.digital_twin.last_sync_timestamp = datetime.now(timezone.utc).isoformat()
            if event.action == "CHECK_IN":
                facility.digital_twin.staff.actual_staff_total = min(
                    facility.digital_twin.staff.expected_staff_total,
                    facility.digital_twin.staff.actual_staff_total + 1
                )
            elif event.action == "CHECK_OUT":
                facility.digital_twin.staff.actual_staff_total = max(
                    0,
                    facility.digital_twin.staff.actual_staff_total - 1
                )

        return {
            "status": "success",
            "staff_name": event.staff_name,
            "department": event.department,
            "action": event.action,
            "timestamp": event.timestamp
        }

    def get_live_alerts(self, facility_id: Optional[str] = None) -> List[OperationalAlert]:
        return self.firestore_repo.get_alerts(facility_id)

    def get_recent_transactions(self, facility_id: Optional[str] = None) -> List[InventoryTransaction]:
        return self.firestore_repo.get_recent_transactions(facility_id)

operational_state_service = OperationalStateService()
