from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class TransactionType(str, Enum):
    RECEIVED = "RECEIVED"
    CONSUMED = "CONSUMED"
    ADJUSTED = "ADJUSTED"
    TRANSFERRED_OUT = "TRANSFERRED_OUT"
    TRANSFERRED_IN = "TRANSFERRED_IN"
    EXPIRED_DISCARDED = "EXPIRED_DISCARDED"

class OperationalSource(str, Enum):
    THETA_VOICE = "THETA_VOICE"
    MANUAL_WEB = "MANUAL_WEB"
    BARCODE_SCAN = "BARCODE_SCAN"
    AUTOMATED_DISPATCH = "AUTOMATED_DISPATCH"
    API_IMPORT = "API_IMPORT"

class InventoryTransaction(BaseModel):
    transaction_id: str
    facility_id: str
    medicine_id: str
    medicine_name: str
    batch_number: str
    type: TransactionType
    quantity: int
    unit: str = "units"
    source: OperationalSource
    created_by: str
    created_at: str
    notes: Optional[str] = None
    balance_after: int

class InventoryTransactionCreate(BaseModel):
    facility_id: str
    medicine_id: str
    medicine_name: str
    batch_number: str
    type: TransactionType
    quantity: int
    unit: str = "units"
    source: OperationalSource = OperationalSource.MANUAL_WEB
    notes: Optional[str] = None

class BedUpdateEvent(BaseModel):
    facility_id: str
    general_occupied: int
    icu_occupied: int
    emergency_occupied: int
    source: OperationalSource = OperationalSource.MANUAL_WEB
    updated_by: str
    notes: Optional[str] = None

class StaffAttendanceEvent(BaseModel):
    facility_id: str
    user_id: str
    staff_name: str
    department: str
    action: str  # "CHECK_IN" | "CHECK_OUT"
    source: OperationalSource = OperationalSource.THETA_VOICE
    timestamp: str

class AlertSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    WARNING = "WARNING"
    INFO = "INFO"

class OperationalAlert(BaseModel):
    alert_id: str
    facility_id: str
    facility_name: str
    title: str
    message: str
    severity: AlertSeverity
    category: str  # "STOCKOUT", "EXPIRY", "SURGE", "BED_CAPACITY", "STAFFING"
    created_at: str
    is_resolved: bool = False
    action_required: Optional[str] = None
