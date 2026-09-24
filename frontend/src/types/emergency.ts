export interface EmergencyAction {
  action_id: string
  title: string
  category: "TRIAGE" | "SUPPLY_CHAIN" | "BLOOD_BANK" | "BED_SURGE" | "STAFFING"
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING_APPROVAL"
  assigned_team: string
  impact_summary: string
}

export interface EmergencyDeclaration {
  emergency_id: string
  title: string
  type: "DENGUE_OUTBREAK" | "RESPIRATORY_SURGE" | "FLOOD_DISRUPTION"
  status: "ACTIVE" | "CONTAINED" | "RESOLVED"
  severity: "HIGH" | "CRITICAL"
  affected_state: string
  affected_district: string
  affected_facilities_count: number
  affected_facilities: string[]
  declared_at: string
  declared_by: string
  surge_multiplier: number
  priority_medicines: string[]
  containment_progress_pct: number
  patient_cases_total: number
  emergency_beds_allocated: number
  active_actions: EmergencyAction[]
}
