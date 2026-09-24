export type TherapeuticCategory =
  | "ANALGESIC"
  | "ANTIBIOTIC"
  | "ANTIMALARIAL"
  | "ANTIVIRAL"
  | "IV_FLUIDS"
  | "RESPIRATORY"
  | "CARDIOVASCULAR"
  | "VACCINE"
  | "EMERGENCY_DRUG"

export type ExpiryStatus = "HEALTHY" | "APPROACHING" | "CRITICAL" | "EXPIRED"

export interface MedicineBatch {
  batch_id: string
  batch_number: string
  medicine_id: string
  facility_id: string
  quantity: number
  manufacturing_date: string
  expiry_date: string
  days_to_expiry: number
  expiry_status: ExpiryStatus
  unit_cost_inr: number
  is_cold_chain: boolean
  supplier_name: string
}

export interface MedicineSKU {
  id: string
  name: string
  generic_name: string
  category: TherapeuticCategory
  dosage_form: string
  strength: string
  unit: string
  min_buffer_stock: number
  reorder_point: number
  total_stock: number
  daily_burn_rate: number
  days_of_supply: number
  is_essential: boolean
  is_cold_chain: boolean
  batches_count: number
  stock_status: "SAFE" | "REORDER_NEEDED" | "CRITICAL_STOCKOUT"
}

export interface BatchAllocation {
  batch_id: string
  batch_number: string
  expiry_date: string
  quantity_dispensed: number
  remaining_in_batch: number
}

export interface DispenseResult {
  transaction_id: string
  medicine_id: string
  medicine_name: string
  total_quantity_dispensed: number
  allocations: BatchAllocation[]
  facility_id: string
  dispensed_at: string
  dispensed_by: string
  fefo_compliant: boolean
}

export interface ExpiryRiskReport {
  critical_batches_count: number
  approaching_batches_count: number
  estimated_financial_risk_inr: number
  at_risk_batches: MedicineBatch[]
}
