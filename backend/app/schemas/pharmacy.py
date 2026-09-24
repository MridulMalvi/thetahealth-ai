from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import date, datetime

class TherapeuticCategory(str, Enum):
    ANALGESIC = "ANALGESIC"
    ANTIBIOTIC = "ANTIBIOTIC"
    ANTIMALARIAL = "ANTIMALARIAL"
    ANTIVIRAL = "ANTIVIRAL"
    IV_FLUIDS = "IV_FLUIDS"
    RESPIRATORY = "RESPIRATORY"
    CARDIOVASCULAR = "CARDIOVASCULAR"
    VACCINE = "VACCINE"
    EMERGENCY_DRUG = "EMERGENCY_DRUG"

class ExpiryStatus(str, Enum):
    HEALTHY = "HEALTHY"          # > 90 days
    APPROACHING = "APPROACHING"  # 31 - 90 days
    CRITICAL = "CRITICAL"        # <= 30 days
    EXPIRED = "EXPIRED"          # <= 0 days

class MedicineBatch(BaseModel):
    batch_id: str
    batch_number: str
    medicine_id: str
    facility_id: str
    quantity: int
    manufacturing_date: str
    expiry_date: str
    days_to_expiry: int
    expiry_status: ExpiryStatus
    unit_cost_inr: float
    is_cold_chain: bool = False
    supplier_name: str

class MedicineSKU(BaseModel):
    id: str
    name: str
    generic_name: str
    category: TherapeuticCategory
    dosage_form: str  # Tablet, Syrup, Injection, Vial, Sachet
    strength: str
    unit: str         # strips, bottles, vials, sachets
    min_buffer_stock: int
    reorder_point: int
    total_stock: int
    daily_burn_rate: float
    days_of_supply: float
    is_essential: bool = True
    is_cold_chain: bool = False
    batches_count: int
    stock_status: str  # "SAFE", "REORDER_NEEDED", "CRITICAL_STOCKOUT"

class DispenseRequest(BaseModel):
    facility_id: str
    medicine_id: str
    quantity: int
    patient_id: Optional[str] = None
    doctor_name: Optional[str] = None
    notes: Optional[str] = None

class BatchAllocation(BaseModel):
    batch_id: str
    batch_number: str
    expiry_date: str
    quantity_dispensed: int
    remaining_in_batch: int

class DispenseResult(BaseModel):
    transaction_id: str
    medicine_id: str
    medicine_name: str
    total_quantity_dispensed: int
    allocations: List[BatchAllocation]
    facility_id: str
    dispensed_at: str
    dispensed_by: str
    fefo_compliant: bool = True

class ExpiryRiskReport(BaseModel):
    critical_batches_count: int
    approaching_batches_count: int
    estimated_financial_risk_inr: float
    at_risk_batches: List[MedicineBatch]
