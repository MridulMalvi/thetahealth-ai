from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ResourceBalanceStatus(str, Enum):
    SURPLUS = "SURPLUS"
    NEUTRAL = "NEUTRAL"
    NEEDS_RESOURCE = "NEEDS_RESOURCE"

class TransferStatus(str, Enum):
    PROPOSED = "PROPOSED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"

class FacilityResourceBalance(BaseModel):
    facility_id: str
    facility_name: str
    state_name: str
    district_name: str
    facility_type: str
    balance_status: ResourceBalanceStatus
    resilience_score: float
    surplus_items: List[str] = []
    deficit_items: List[str] = []

class TransferRecommendation(BaseModel):
    recommendation_id: str
    source_facility_id: str
    source_facility_name: str
    target_facility_id: str
    target_facility_name: str
    medicine_id: str
    medicine_name: str
    batch_number: str
    quantity: int
    unit: str
    distance_km: float
    estimated_transit_hours: float
    match_confidence: float = Field(..., ge=0.0, le=1.0)
    urgency_level: str  # "CRITICAL", "HIGH", "MODERATE"
    reasoning: str
    status: TransferStatus = TransferStatus.PROPOSED
    created_at: str
    decided_at: Optional[str] = None
    decided_by: Optional[str] = None

class Shipment(BaseModel):
    shipment_id: str
    origin_name: str
    destination_name: str
    medicine_name: str
    quantity: int
    unit: str
    status: str  # "DISPATCHED", "IN_TRANSIT", "DELAYED", "DELIVERED"
    eta: str
    delay_days: int = 0
    corridor_status: str  # "CLEAR", "CONGESTED", "WEATHER_DELAY"
    carrier_name: str

class SupplyChainSummary(BaseModel):
    total_shipments_in_transit: int
    surplus_nodes_count: int
    deficit_nodes_count: int
    pending_recommendations_count: int
    recommendations: List[TransferRecommendation]
    shipments: List[Shipment]
    facility_balances: List[FacilityResourceBalance]
