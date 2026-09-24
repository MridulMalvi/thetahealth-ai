from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field

class FacilityType(str, Enum):
    HOSPITAL = "HOSPITAL"
    PHC = "PHC"
    COMMUNITY_HEALTH_CENTRE = "COMMUNITY_HEALTH_CENTRE"
    WAREHOUSE = "WAREHOUSE"
    DISTRICT_DEPOT = "DISTRICT_DEPOT"

class FacilityStatus(str, Enum):
    OPERATIONAL = "OPERATIONAL"
    SURGE = "SURGE"
    DISRUPTED = "DISRUPTED"
    EMERGENCY = "EMERGENCY"

class GeoCoordinates(BaseModel):
    latitude: float
    longitude: float

class BedStats(BaseModel):
    general_total: int
    general_occupied: int
    icu_total: int
    icu_occupied: int
    emergency_total: int
    emergency_occupied: int

    @property
    def total_beds(self) -> int:
        return self.general_total + self.icu_total + self.emergency_total

    @property
    def total_occupied(self) -> int:
        return self.general_occupied + self.icu_occupied + self.emergency_occupied

    @property
    def occupancy_rate(self) -> float:
        tot = self.total_beds
        return round((self.total_occupied / tot) * 100, 1) if tot > 0 else 0.0

class StaffStats(BaseModel):
    doctors_on_duty: int
    nurses_on_duty: int
    pharmacists_on_duty: int
    support_staff_on_duty: int
    expected_staff_total: int
    actual_staff_total: int

    @property
    def attendance_rate(self) -> float:
        return round((self.actual_staff_total / self.expected_staff_total) * 100, 1) if self.expected_staff_total > 0 else 0.0

class InventorySummary(BaseModel):
    total_skus: int
    critical_stockouts_count: int
    expiring_in_30d_count: int
    days_of_supply_avg: float
    reorder_required_count: int

class DigitalTwinState(BaseModel):
    resilience_score: float = Field(..., ge=0, le=100)
    risk_level: str  # LOW, MODERATE, HIGH, CRITICAL
    patient_footfall_today: int
    patient_footfall_predicted_tomorrow: int
    beds: BedStats
    staff: StaffStats
    inventory: InventorySummary
    last_sync_timestamp: str

class Facility(BaseModel):
    id: str
    name: str
    code: str
    type: FacilityType
    status: FacilityStatus
    country_code: str = "IN"
    state_id: str
    state_name: str
    district_id: str
    district_name: str
    pincode: str
    address: str
    contact_phone: str
    coordinates: GeoCoordinates
    digital_twin: DigitalTwinState

class DistrictSummary(BaseModel):
    district_id: str
    district_name: str
    state_id: str
    total_facilities: int
    total_hospitals: int
    total_phcs: int
    avg_resilience_score: float

class StateSummary(BaseModel):
    state_id: str
    state_name: str
    total_districts: int
    total_facilities: int
    districts: List[DistrictSummary] = []

class NetworkOverviewStats(BaseModel):
    total_states: int
    total_districts: int
    total_facilities: int
    total_hospitals: int
    total_phcs: int
    total_warehouses: int
    total_beds: int
    total_beds_occupied: int
    average_occupancy_rate: float
    average_resilience_score: float
    facilities_with_stockout_risk: int
    facilities_in_emergency: int
