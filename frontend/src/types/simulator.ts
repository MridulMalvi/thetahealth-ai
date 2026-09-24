export interface CriticalBottleneck {
  entity: string
  risk_type: "STOCKOUT" | "BED_CAPACITY" | "STAFF_DEFICIT"
  days_until_breach: number
  severity: "MODERATE" | "CRITICAL" | "CATASTROPHIC"
  description: string
}

export interface SimulatorRequest {
  scenario_name: string
  patient_surge_pct: number
  supplier_delay_days: number
  staff_absenteeism_pct: number
  apply_ai_redistribution: boolean
  apply_emergency_buffer: boolean
}

export interface SimulatorResponse {
  scenario_name: string
  baseline_resilience: number
  simulated_resilience: number
  resilience_delta: number
  projected_bed_occupancy_pct: number
  stockout_risk_skus_count: number
  critical_bottlenecks: CriticalBottleneck[]
  recommended_mitigations: string[]
  simulated_at: string
}
