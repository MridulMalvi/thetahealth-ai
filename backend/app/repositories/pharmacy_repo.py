from typing import List, Optional, Dict
from datetime import datetime, date, timedelta, timezone
from app.schemas.pharmacy import (
    MedicineSKU,
    MedicineBatch,
    TherapeuticCategory,
    ExpiryStatus,
    BatchAllocation,
    DispenseResult,
    ExpiryRiskReport,
)

TODAY = date.today()

def calc_expiry(days_ahead: int) -> tuple[str, int, ExpiryStatus]:
    exp = TODAY + timedelta(days=days_ahead)
    status = ExpiryStatus.HEALTHY
    if days_ahead <= 0:
        status = ExpiryStatus.EXPIRED
    elif days_ahead <= 30:
        status = ExpiryStatus.CRITICAL
    elif days_ahead <= 90:
        status = ExpiryStatus.APPROACHING
    return exp.isoformat(), days_ahead, status

# Synthetic Batches
SYNTHETIC_BATCHES: List[MedicineBatch] = [
    # Paracetamol 500mg
    MedicineBatch(
        batch_id="BAT-PCM-001",
        batch_number="PCM-2026-B8",
        medicine_id="MED-PCM-500",
        facility_id="FAC-UP-MEE-002",
        quantity=350,
        manufacturing_date=(TODAY - timedelta(days=180)).isoformat(),
        expiry_date=calc_expiry(42)[0],
        days_to_expiry=calc_expiry(42)[1],
        expiry_status=calc_expiry(42)[2],
        unit_cost_inr=12.50,
        is_cold_chain=False,
        supplier_name="Cipla Healthcare",
    ),
    MedicineBatch(
        batch_id="BAT-PCM-002",
        batch_number="PCM-2026-B9",
        medicine_id="MED-PCM-500",
        facility_id="FAC-UP-MEE-002",
        quantity=300,
        manufacturing_date=(TODAY - timedelta(days=60)).isoformat(),
        expiry_date=calc_expiry(320)[0],
        days_to_expiry=calc_expiry(320)[1],
        expiry_status=calc_expiry(320)[2],
        unit_cost_inr=12.50,
        is_cold_chain=False,
        supplier_name="Cipla Healthcare",
    ),

    # Doxycycline 100mg
    MedicineBatch(
        batch_id="BAT-DOX-001",
        batch_number="DOX-2025-C4",
        medicine_id="MED-DOX-100",
        facility_id="FAC-UP-MEE-003",
        quantity=80,
        manufacturing_date=(TODAY - timedelta(days=300)).isoformat(),
        expiry_date=calc_expiry(24)[0],  # Critical Expiry (<30d)
        days_to_expiry=calc_expiry(24)[1],
        expiry_status=calc_expiry(24)[2],
        unit_cost_inr=24.00,
        is_cold_chain=False,
        supplier_name="Sun Pharma",
    ),
    MedicineBatch(
        batch_id="BAT-DOX-002",
        batch_number="DOX-2026-A1",
        medicine_id="MED-DOX-100",
        facility_id="FAC-UP-MEE-001",
        quantity=950,
        manufacturing_date=(TODAY - timedelta(days=45)).isoformat(),
        expiry_date=calc_expiry(280)[0],
        days_to_expiry=calc_expiry(280)[1],
        expiry_status=calc_expiry(280)[2],
        unit_cost_inr=23.50,
        is_cold_chain=False,
        supplier_name="Sun Pharma",
    ),

    # Normal Saline IV 500ml
    MedicineBatch(
        batch_id="BAT-IVF-001",
        batch_number="IVF-9921-A1",
        medicine_id="MED-IVF-NS",
        facility_id="FAC-UP-MEE-001",
        quantity=320,
        manufacturing_date=(TODAY - timedelta(days=120)).isoformat(),
        expiry_date=calc_expiry(210)[0],
        days_to_expiry=calc_expiry(210)[1],
        expiry_status=calc_expiry(210)[2],
        unit_cost_inr=35.00,
        is_cold_chain=False,
        supplier_name="Baxter Healthcare",
    ),

    # Artesunate Injection
    MedicineBatch(
        batch_id="BAT-ART-001",
        batch_number="ART-662-X1",
        medicine_id="MED-ART-60",
        facility_id="FAC-UP-MEE-003",
        quantity=25,
        manufacturing_date=(TODAY - timedelta(days=200)).isoformat(),
        expiry_date=calc_expiry(18)[0],  # Critical Expiry
        days_to_expiry=calc_expiry(18)[1],
        expiry_status=calc_expiry(18)[2],
        unit_cost_inr=145.00,
        is_cold_chain=True,
        supplier_name="Ipca Laboratories",
    ),

    # Rabies Vaccine (Cold-Chain)
    MedicineBatch(
        batch_id="BAT-RAB-001",
        batch_number="RAB-V-2026",
        medicine_id="MED-RAB-01",
        facility_id="FAC-UP-MEE-001",
        quantity=140,
        manufacturing_date=(TODAY - timedelta(days=90)).isoformat(),
        expiry_date=calc_expiry(150)[0],
        days_to_expiry=calc_expiry(150)[1],
        expiry_status=calc_expiry(150)[2],
        unit_cost_inr=320.00,
        is_cold_chain=True,
        supplier_name="Serum Institute of India",
    ),

    # ORS Sachets
    MedicineBatch(
        batch_id="BAT-ORS-001",
        batch_number="ORS-778-O1",
        medicine_id="MED-ORS-S1",
        facility_id="FAC-UP-MEE-002",
        quantity=800,
        manufacturing_date=(TODAY - timedelta(days=30)).isoformat(),
        expiry_date=calc_expiry(450)[0],
        days_to_expiry=calc_expiry(450)[1],
        expiry_status=calc_expiry(450)[2],
        unit_cost_inr=6.50,
        is_cold_chain=False,
        supplier_name="FDC India",
    ),
]

# Master Essential SKU Catalog
SYNTHETIC_SKUS: List[MedicineSKU] = [
    MedicineSKU(
        id="MED-PCM-500",
        name="Paracetamol 500mg Tablets",
        generic_name="Paracetamol",
        category=TherapeuticCategory.ANALGESIC,
        dosage_form="Tablet",
        strength="500mg",
        unit="strips (10 tabs)",
        min_buffer_stock=200,
        reorder_point=300,
        total_stock=650,
        daily_burn_rate=32.5,
        days_of_supply=20.0,
        is_essential=True,
        is_cold_chain=False,
        batches_count=2,
        stock_status="SAFE",
    ),
    MedicineSKU(
        id="MED-DOX-100",
        name="Doxycycline 100mg Capsules",
        generic_name="Doxycycline Hyclate",
        category=TherapeuticCategory.ANTIBIOTIC,
        dosage_form="Capsule",
        strength="100mg",
        unit="strips (10 caps)",
        min_buffer_stock=150,
        reorder_point=250,
        total_stock=80,
        daily_burn_rate=38.0,
        days_of_supply=2.1,
        is_essential=True,
        is_cold_chain=False,
        batches_count=1,
        stock_status="CRITICAL_STOCKOUT",
    ),
    MedicineSKU(
        id="MED-ART-60",
        name="Artesunate 60mg Injection",
        generic_name="Artesunate",
        category=TherapeuticCategory.ANTIMALARIAL,
        dosage_form="Vial / Injection",
        strength="60mg",
        unit="vials",
        min_buffer_stock=40,
        reorder_point=60,
        total_stock=25,
        daily_burn_rate=5.5,
        days_of_supply=4.5,
        is_essential=True,
        is_cold_chain=True,
        batches_count=1,
        stock_status="REORDER_NEEDED",
    ),
    MedicineSKU(
        id="MED-IVF-NS",
        name="Normal Saline 0.9% IV Infusion",
        generic_name="Sodium Chloride 0.9%",
        category=TherapeuticCategory.IV_FLUIDS,
        dosage_form="IV Infusion Bottle",
        strength="0.9% w/v (500ml)",
        unit="bottles",
        min_buffer_stock=100,
        reorder_point=180,
        total_stock=320,
        daily_burn_rate=22.0,
        days_of_supply=14.5,
        is_essential=True,
        is_cold_chain=False,
        batches_count=1,
        stock_status="SAFE",
    ),
    MedicineSKU(
        id="MED-RAB-01",
        name="Rabies Vaccine Human (Rabipur)",
        generic_name="Inactivated Rabies Virus",
        category=TherapeuticCategory.VACCINE,
        dosage_form="Vial + Diluent",
        strength="2.5 IU / dose",
        unit="vials",
        min_buffer_stock=50,
        reorder_point=80,
        total_stock=140,
        daily_burn_rate=4.0,
        days_of_supply=35.0,
        is_essential=True,
        is_cold_chain=True,
        batches_count=1,
        stock_status="SAFE",
    ),
    MedicineSKU(
        id="MED-ORS-S1",
        name="Oral Rehydration Salts (WHO Formula)",
        generic_name="Electrolytes & Glucose",
        category=TherapeuticCategory.EMERGENCY_DRUG,
        dosage_form="Powder Sachet",
        strength="20.5g / sachet",
        unit="sachets",
        min_buffer_stock=300,
        reorder_point=500,
        total_stock=800,
        daily_burn_rate=45.0,
        days_of_supply=17.7,
        is_essential=True,
        is_cold_chain=False,
        batches_count=1,
        stock_status="SAFE",
    ),
]

class PharmacyRepository:
    def __init__(self):
        self._skus: Dict[str, MedicineSKU] = {m.id: m for m in SYNTHETIC_SKUS}
        self._batches: List[MedicineBatch] = list(SYNTHETIC_BATCHES)

    def list_medicines(
        self,
        category: Optional[TherapeuticCategory] = None,
        search: Optional[str] = None,
        stock_status: Optional[str] = None
    ) -> List[MedicineSKU]:
        results = list(self._skus.values())
        if category:
            results = [m for m in results if m.category == category]
        if stock_status:
            results = [m for m in results if m.stock_status == stock_status]
        if search:
            q = search.lower()
            results = [
                m for m in results
                if q in m.name.lower() or q in m.generic_name.lower() or q in m.id.lower()
            ]
        return results

    def get_medicine_by_id(self, medicine_id: str) -> Optional[MedicineSKU]:
        return self._skus.get(medicine_id)

    def get_batches(self, medicine_id: str, facility_id: Optional[str] = None) -> List[MedicineBatch]:
        """
        Returns batches sorted by First-Expiry-First-Out (FEFO) principle.
        """
        batches = [b for b in self._batches if b.medicine_id == medicine_id and b.quantity > 0]
        if facility_id:
            batches = [b for b in batches if b.facility_id == facility_id]
        # Sort FEFO: earliest expiry date first
        return sorted(batches, key=lambda b: b.expiry_date)

    def get_all_expiring_batches(self, days_threshold: int = 30) -> ExpiryRiskReport:
        critical = [b for b in self._batches if b.days_to_expiry <= days_threshold and b.quantity > 0]
        approaching = [b for b in self._batches if 30 < b.days_to_expiry <= 90 and b.quantity > 0]
        financial_risk = sum(b.quantity * b.unit_cost_inr for b in critical)

        return ExpiryRiskReport(
            critical_batches_count=len(critical),
            approaching_batches_count=len(approaching),
            estimated_financial_risk_inr=round(financial_risk, 2),
            at_risk_batches=critical + approaching,
        )

    def dispense_fefo(
        self,
        medicine_id: str,
        quantity: int,
        facility_id: str,
        dispensed_by: str
    ) -> DispenseResult:
        batches = self.get_batches(medicine_id, facility_id=facility_id)
        sku = self.get_medicine_by_id(medicine_id)
        if not sku:
            raise ValueError(f"Medicine '{medicine_id}' not found")

        remaining_to_dispense = quantity
        allocations: List[BatchAllocation] = []

        for batch in batches:
            if remaining_to_dispense <= 0:
                break
            dispense_from_this_batch = min(batch.quantity, remaining_to_dispense)
            batch.quantity -= dispense_from_this_batch
            remaining_to_dispense -= dispense_from_this_batch

            allocations.append(
                BatchAllocation(
                    batch_id=batch.batch_id,
                    batch_number=batch.batch_number,
                    expiry_date=batch.expiry_date,
                    quantity_dispensed=dispense_from_this_batch,
                    remaining_in_batch=batch.quantity,
                )
            )

        # Update SKU total stock and stock status
        total_dispensed = quantity - remaining_to_dispense
        sku.total_stock = max(0, sku.total_stock - total_dispensed)
        sku.days_of_supply = round(sku.total_stock / sku.daily_burn_rate, 1) if sku.daily_burn_rate > 0 else 0
        if sku.days_of_supply <= 3:
            sku.stock_status = "CRITICAL_STOCKOUT"
        elif sku.days_of_supply <= 7:
            sku.stock_status = "REORDER_NEEDED"
        else:
            sku.stock_status = "SAFE"

        return DispenseResult(
            transaction_id=f"DISP-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            medicine_id=sku.id,
            medicine_name=sku.name,
            total_quantity_dispensed=total_dispensed,
            allocations=allocations,
            facility_id=facility_id,
            dispensed_at=datetime.now(timezone.utc).isoformat(),
            dispensed_by=dispensed_by,
            fefo_compliant=True,
        )

pharmacy_repository = PharmacyRepository()
