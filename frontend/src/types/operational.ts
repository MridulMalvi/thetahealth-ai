export type TransactionType =
  | "RECEIVED"
  | "CONSUMED"
  | "ADJUSTED"
  | "TRANSFERRED_OUT"
  | "TRANSFERRED_IN"
  | "EXPIRED_DISCARDED"

export type OperationalSource =
  | "THETA_VOICE"
  | "MANUAL_WEB"
  | "BARCODE_SCAN"
  | "AUTOMATED_DISPATCH"
  | "API_IMPORT"

export interface InventoryTransaction {
  transaction_id: string
  facility_id: string
  medicine_id: string
  medicine_name: string
  batch_number: string
  type: TransactionType
  quantity: number
  unit: string
  source: OperationalSource
  created_by: string
  created_at: string
  notes?: string
  balance_after: number
}

export interface InventoryTransactionCreate {
  facility_id: string
  medicine_id: string
  medicine_name: string
  batch_number: string
  type: TransactionType
  quantity: number
  unit?: string
  source?: OperationalSource
  notes?: string
}

export type AlertSeverity = "CRITICAL" | "WARNING" | "INFO"

export interface OperationalAlert {
  alert_id: string
  facility_id: string
  facility_name: string
  title: string
  message: string
  severity: AlertSeverity
  category: string
  created_at: string
  is_resolved: boolean
  action_required?: string
}
