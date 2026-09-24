export type FacilityType =
  | "HOSPITAL"
  | "PHC"
  | "COMMUNITY_HEALTH_CENTRE"
  | "WAREHOUSE"
  | "DISTRICT_DEPOT"

export type FacilityStatus =
  | "OPERATIONAL"
  | "SURGE"
  | "DISRUPTED"
  | "EMERGENCY"

export interface GeoCoordinates {
  latitude: number
  longitude: number
}

export interface BedStats {
  general_total: number
  general_occupied: number
  icu_total: number
  icu_occupied: number
  emergency_total: number
  emergency_occupied: number
}

export interface StaffStats {
  doctors_on_duty: number
  nurses_on_duty: number
  pharmacists_on_duty: number
  support_staff_on_duty: number
  expected_staff_total: number
  actual_staff_total: number
}

export interface InventorySummary {
  total_skus: number
  critical_stockouts_count: number
  expiring_in_30d_count: number
  days_of_supply_avg: number
  reorder_required_count: number
}

export interface DigitalTwinState {
  resilience_score: number
  risk_level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
  patient_footfall_today: number
  patient_footfall_predicted_tomorrow: number
  beds: BedStats
  staff: StaffStats
  inventory: InventorySummary
  last_sync_timestamp: string
}

export interface Facility {
  id: string
  name: string
  code: string
  type: FacilityType
  status: FacilityStatus
  country_code: string
  state_id: string
  state_name: string
  district_id: string
  district_name: string
  pincode: string
  address: string
  contact_phone: string
  coordinates: GeoCoordinates
  digital_twin: DigitalTwinState
}

export interface NetworkOverviewStats {
  total_states: number
  total_districts: number
  total_facilities: number
  total_hospitals: number
  total_phcs: number
  total_warehouses: number
  total_beds: number
  total_beds_occupied: number
  average_occupancy_rate: number
  average_resilience_score: number
  facilities_with_stockout_risk: number
  facilities_in_emergency: number
}
