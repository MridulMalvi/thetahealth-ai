import {
  InventoryTransaction,
  InventoryTransactionCreate,
  OperationalAlert,
} from "@/types/operational"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

// Local fallback store
let fallbackTransactions: InventoryTransaction[] = [
  {
    transaction_id: "TX-902188",
    facility_id: "FAC-UP-MEE-002",
    medicine_id: "MED-PCM-500",
    medicine_name: "Paracetamol 500mg Tablets",
    batch_number: "PCM-2026-B8",
    type: "RECEIVED",
    quantity: 150,
    unit: "strips",
    source: "THETA_VOICE",
    created_by: "Sunita Devi (PHC Worker)",
    created_at: new Date(Date.now() - 60000).toISOString(),
    notes: "Logged via Theta Voice speech-to-structured JSON intake",
    balance_after: 650,
  },
  {
    transaction_id: "TX-902187",
    facility_id: "FAC-UP-MEE-001",
    medicine_id: "MED-IVF-NS",
    medicine_name: "Normal Saline IV 500ml",
    batch_number: "IVF-9921-A1",
    type: "CONSUMED",
    quantity: 40,
    unit: "bottles",
    source: "MANUAL_WEB",
    created_by: "Dr. Sanjay Gupta",
    created_at: new Date(Date.now() - 300000).toISOString(),
    notes: "Emergency Ward fluid replenishment",
    balance_after: 320,
  },
  {
    transaction_id: "TX-902186",
    facility_id: "FAC-UP-LKO-001",
    medicine_id: "MED-DOX-100",
    medicine_name: "Doxycycline 100mg Capsules",
    batch_number: "DOX-2025-C4",
    type: "TRANSFERRED_OUT",
    quantity: 400,
    unit: "strips",
    source: "AUTOMATED_DISPATCH",
    created_by: "Central Logistics Engine",
    created_at: new Date(Date.now() - 720000).toISOString(),
    notes: "Redistribution transfer dispatched to PHC Rampur",
    balance_after: 2800,
  },
]

let fallbackAlerts: OperationalAlert[] = [
  {
    alert_id: "ALT-001",
    facility_id: "FAC-UP-MEE-003",
    facility_name: "PHC Rampur",
    title: "Critical Stockout: Doxycycline 100mg",
    message: "Projected stock depletion in 2.1 days due to vector surge. Inter-facility transfer recommended.",
    severity: "CRITICAL",
    category: "STOCKOUT",
    created_at: new Date(Date.now() - 120000).toISOString(),
    is_resolved: false,
    action_required: "Approve stock transfer from District Hospital Meerut",
  },
  {
    alert_id: "ALT-002",
    facility_id: "FAC-MH-MUM-001",
    facility_name: "King Edward Memorial Hospital Mumbai",
    title: "ICU Surge: 97.3% Capacity",
    message: "146 of 150 ICU beds occupied. Triage diversion active.",
    severity: "WARNING",
    category: "BED_CAPACITY",
    created_at: new Date(Date.now() - 600000).toISOString(),
    is_resolved: false,
    action_required: "Prepare auxiliary ventilator capacity in Ward 4",
  },
]

export const operationalService = {
  async getRecentTransactions(facilityId?: string): Promise<InventoryTransaction[]> {
    try {
      const url = facilityId
        ? `${API_BASE_URL}/operational/inventory/transactions?facility_id=${facilityId}`
        : `${API_BASE_URL}/operational/inventory/transactions`
      const res = await fetch(url)
      if (!res.ok) throw new Error("API offline")
      return await res.json()
    } catch {
      return facilityId
        ? fallbackTransactions.filter((tx) => tx.facility_id === facilityId)
        : fallbackTransactions
    }
  },

  async recordTransaction(payload: InventoryTransactionCreate): Promise<InventoryTransaction> {
    try {
      const res = await fetch(`${API_BASE_URL}/operational/inventory/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("API error")
      const data = await res.json()
      fallbackTransactions = [data, ...fallbackTransactions]
      return data
    } catch {
      const newTx: InventoryTransaction = {
        transaction_id: `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        facility_id: payload.facility_id,
        medicine_id: payload.medicine_id,
        medicine_name: payload.medicine_name,
        batch_number: payload.batch_number,
        type: payload.type,
        quantity: payload.quantity,
        unit: payload.unit || "units",
        source: payload.source || "MANUAL_WEB",
        created_by: "Local Operator",
        created_at: new Date().toISOString(),
        notes: payload.notes,
        balance_after: 500 + (payload.type === "RECEIVED" ? payload.quantity : -payload.quantity),
      }
      fallbackTransactions = [newTx, ...fallbackTransactions]
      return newTx
    }
  },

  async getLiveAlerts(): Promise<OperationalAlert[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/operational/alerts`)
      if (!res.ok) throw new Error("API offline")
      return await res.json()
    } catch {
      return fallbackAlerts
    }
  },
}
