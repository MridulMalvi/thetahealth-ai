from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class EmergencyAction(BaseModel):
    action_id: str
    title: str
    category: str
    status: str  # "COMPLETED", "IN_PROGRESS", "PENDING_APPROVAL"
    assigned_team: str
    impact_summary: str

class EmergencyDeclaration(BaseModel):
    emergency_id: str
    title: str
    type: str  # "DENGUE_OUTBREAK", "RESPIRATORY_SURGE", "FLOOD_DISRUPTION"
    status: str  # "ACTIVE", "CONTAINED", "RESOLVED"
    severity: str  # "HIGH", "CRITICAL"
    affected_state: str
    affected_district: str
    affected_facilities_count: int
    affected_facilities: List[str]
    declared_at: str
    declared_by: str
    surge_multiplier: float
    priority_medicines: List[str]
    containment_progress_pct: float
    active_actions: List[EmergencyAction] = []
    patient_cases_total: int
    emergency_beds_allocated: int
