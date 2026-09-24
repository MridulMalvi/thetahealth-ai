from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SimulatorRequest(BaseModel):
    scenario_name: str = "Custom Stress Test"
    patient_surge_pct: float = Field(default=25.0, ge=0.0, le=200.0)
    supplier_delay_days: int = Field(default=3, ge=0, le=30)
    staff_absenteeism_pct: float = Field(default=10.0, ge=0.0, le=75.0)
    apply_ai_redistribution: bool = True
    apply_emergency_buffer: bool = True

class CriticalBottleneck(BaseModel):
    entity: str
    risk_type: str  # "STOCKOUT", "BED_CAPACITY", "STAFF_DEFICIT"
    days_until_breach: float
    severity: str  # "MODERATE", "CRITICAL", "CATASTROPHIC"
    description: str

class SimulatorResponse(BaseModel):
    scenario_name: str
    baseline_resilience: float
    simulated_resilience: float
    resilience_delta: float
    projected_bed_occupancy_pct: float
    stockout_risk_skus_count: int
    critical_bottlenecks: List[CriticalBottleneck]
    recommended_mitigations: List[str]
    simulated_at: str
