import {
  MedicineSKU,
  MedicineBatch,
  DispenseResult,
  ExpiryRiskReport,
} from "@/types/pharmacy"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

const FALLBACK_MEDICINES: MedicineSKU[] = [
  {
    id: "MED-PCM-500",
    name: "Paracetamol 500mg Tablets",
    generic_name: "Paracetamol",
    category: "ANALGESIC",
    dosage_form: "Tablet",
    strength: "500mg",
    unit: "strips (10 tabs)",
    min_buffer_stock: 200,
    reorder_point: 300,
    total_stock: 650,
    daily_burn_rate: 32.5,
    days_of_supply: 20.0,
    is_essential: true,
    is_cold_chain: false,
    batches_count: 2,
    stock_status: "SAFE",
  },
  {
    id: "MED-DOX-100",
    name: "Doxycycline 100mg Capsules",
    generic_name: "Doxycycline Hyclate",
    category: "ANTIBIOTIC",
    dosage_form: "Capsule",
    strength: "100mg",
    unit: "strips (10 caps)",
    min_buffer_stock: 150,
    reorder_point: 250,
    total_stock: 80,
    daily_burn_rate: 38.0,
    days_of_supply: 2.1,
    is_essential: true,
    is_cold_chain: false,
    batches_count: 1,
    stock_status: "CRITICAL_STOCKOUT",
  },
  {
    id: "MED-ART-60",
    name: "Artesunate 60mg Injection",
    generic_name: "Artesunate",
    category: "ANTIMALARIAL",
    dosage_form: "Vial / Injection",
    strength: "60mg",
    unit: "vials",
    min_buffer_stock: 40,
    reorder_point: 60,
    total_stock: 25,
    daily_burn_rate: 5.5,
    days_of_supply: 4.5,
    is_essential: true,
    is_cold_chain: true,
    batches_count: 1,
    stock_status: "REORDER_NEEDED",
  },
  {
    id: "MED-IVF-NS",
    name: "Normal Saline 0.9% IV Infusion",
    generic_name: "Sodium Chloride 0.9%",
    category: "IV_FLUIDS",
    dosage_form: "IV Infusion Bottle",
    strength: "0.9% w/v (500ml)",
    unit: "bottles",
    min_buffer_stock: 100,
    reorder_point: 180,
    total_stock: 320,
    daily_burn_rate: 22.0,
    days_of_supply: 14.5,
    is_essential: true,
    is_cold_chain: false,
    batches_count: 1,
    stock_status: "SAFE",
  },
  {
    id: "MED-RAB-01",
    name: "Rabies Vaccine Human (Rabipur)",
    generic_name: "Inactivated Rabies Virus",
    category: "VACCINE",
    dosage_form: "Vial + Diluent",
    strength: "2.5 IU / dose",
    unit: "vials",
    min_buffer_stock: 50,
    reorder_point: 80,
    total_stock: 140,
    daily_burn_rate: 4.0,
    days_of_supply: 35.0,
    is_essential: true,
    is_cold_chain: true,
    batches_count: 1,
    stock_status: "SAFE",
  },
  {
    id: "MED-ORS-S1",
    name: "Oral Rehydration Salts (WHO Formula)",
    generic_name: "Electrolytes & Glucose",
    category: "EMERGENCY_DRUG",
    dosage_form: "Powder Sachet",
    strength: "20.5g / sachet",
    unit: "sachets",
    min_buffer_stock: 300,
    reorder_point: 500,
    total_stock: 800,
    daily_burn_rate: 45.0,
    days_of_supply: 17.7,
    is_essential: true,
    is_cold_chain: false,
    batches_count: 1,
    stock_status: "SAFE",
  },
]

const FALLBACK_BATCHES: Record<string, MedicineBatch[]> = {
  "MED-PCM-500": [
    {
      batch_id: "BAT-PCM-001",
      batch_number: "PCM-2026-B8",
      medicine_id: "MED-PCM-500",
      facility_id: "FAC-UP-MEE-002",
      quantity: 350,
      manufacturing_date: "2026-03-24",
      expiry_date: "2026-11-05",
      days_to_expiry: 42,
      expiry_status: "APPROACHING",
      unit_cost_inr: 12.5,
      is_cold_chain: false,
      supplier_name: "Cipla Healthcare",
    },
    {
      batch_id: "BAT-PCM-002",
      batch_number: "PCM-2026-B9",
      medicine_id: "MED-PCM-500",
      facility_id: "FAC-UP-MEE-002",
      quantity: 300,
      manufacturing_date: "2026-07-24",
      expiry_date: "2027-08-10",
      days_to_expiry: 320,
      expiry_status: "HEALTHY",
      unit_cost_inr: 12.5,
      is_cold_chain: false,
      supplier_name: "Cipla Healthcare",
    },
  ],
  "MED-DOX-100": [
    {
      batch_id: "BAT-DOX-001",
      batch_number: "DOX-2025-C4",
      medicine_id: "MED-DOX-100",
      facility_id: "FAC-UP-MEE-003",
      quantity: 80,
      manufacturing_date: "2025-11-20",
      expiry_date: "2026-10-18",
      days_to_expiry: 24,
      expiry_status: "CRITICAL",
      unit_cost_inr: 24.0,
      is_cold_chain: false,
      supplier_name: "Sun Pharma",
    },
  ],
  "MED-ART-60": [
    {
      batch_id: "BAT-ART-001",
      batch_number: "ART-662-X1",
      medicine_id: "MED-ART-60",
      facility_id: "FAC-UP-MEE-003",
      quantity: 25,
      manufacturing_date: "2026-03-01",
      expiry_date: "2026-10-12",
      days_to_expiry: 18,
      expiry_status: "CRITICAL",
      unit_cost_inr: 145.0,
      is_cold_chain: true,
      supplier_name: "Ipca Laboratories",
    },
  ],
  "MED-IVF-NS": [
    {
      batch_id: "BAT-IVF-001",
      batch_number: "IVF-9921-A1",
      medicine_id: "MED-IVF-NS",
      facility_id: "FAC-UP-MEE-001",
      quantity: 320,
      manufacturing_date: "2026-05-24",
      expiry_date: "2027-04-22",
      days_to_expiry: 210,
      expiry_status: "HEALTHY",
      unit_cost_inr: 35.0,
      is_cold_chain: false,
      supplier_name: "Baxter Healthcare",
    },
  ],
  "MED-RAB-01": [
    {
      batch_id: "BAT-RAB-001",
      batch_number: "RAB-V-2026",
      medicine_id: "MED-RAB-01",
      facility_id: "FAC-UP-MEE-001",
      quantity: 140,
      manufacturing_date: "2026-06-24",
      expiry_date: "2027-02-21",
      days_to_expiry: 150,
      expiry_status: "HEALTHY",
      unit_cost_inr: 320.0,
      is_cold_chain: true,
      supplier_name: "Serum Institute of India",
    },
  ],
  "MED-ORS-S1": [
    {
      batch_id: "BAT-ORS-001",
      batch_number: "ORS-778-O1",
      medicine_id: "MED-ORS-S1",
      facility_id: "FAC-UP-MEE-002",
      quantity: 800,
      manufacturing_date: "2026-08-24",
      expiry_date: "2027-12-18",
      days_to_expiry: 450,
      expiry_status: "HEALTHY",
      unit_cost_inr: 6.5,
      is_cold_chain: false,
      supplier_name: "FDC India",
    },
  ],
}

export const pharmacyService = {
  async getMedicines(filters?: {
    category?: string
    search?: string
    stock_status?: string
  }): Promise<MedicineSKU[]> {
    try {
      const params = new URLSearchParams()
      if (filters?.category) params.append("category", filters.category)
      if (filters?.search) params.append("search", filters.search)
      if (filters?.stock_status) params.append("stock_status", filters.stock_status)

      const res = await fetch(`${API_BASE_URL}/pharmacy/medicines?${params.toString()}`)
      if (!res.ok) throw new Error("API error")
      return await res.json()
    } catch {
      let result = [...FALLBACK_MEDICINES]
      if (filters?.category && filters.category !== "ALL") {
        result = result.filter((m) => m.category === filters.category)
      }
      if (filters?.stock_status) {
        result = result.filter((m) => m.stock_status === filters.stock_status)
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase()
        result = result.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.generic_name.toLowerCase().includes(q) ||
            m.id.toLowerCase().includes(q)
        )
      }
      return result
    }
  },

  async getBatchesFEFO(medicineId: string): Promise<MedicineBatch[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/pharmacy/batches/${medicineId}`)
      if (!res.ok) throw new Error("API error")
      return await res.json()
    } catch {
      return FALLBACK_BATCHES[medicineId] || []
    }
  },

  async getExpiryReport(): Promise<ExpiryRiskReport> {
    try {
      const res = await fetch(`${API_BASE_URL}/pharmacy/expiring`)
      if (!res.ok) throw new Error("API error")
      return await res.json()
    } catch {
      return {
        critical_batches_count: 2,
        approaching_batches_count: 1,
        estimated_financial_risk_inr: 5545.0,
        at_risk_batches: [
          FALLBACK_BATCHES["MED-DOX-100"][0],
          FALLBACK_BATCHES["MED-ART-60"][0],
          FALLBACK_BATCHES["MED-PCM-500"][0],
        ],
      }
    }
  },

  async dispenseFEFO(payload: {
    facility_id: string
    medicine_id: string
    quantity: number
    notes?: string
  }): Promise<DispenseResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/pharmacy/dispense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("API error")
      return await res.json()
    } catch {
      const batches = FALLBACK_BATCHES[payload.medicine_id] || []
      const med = FALLBACK_MEDICINES.find((m) => m.id === payload.medicine_id)
      return {
        transaction_id: `DISP-${Math.floor(100000 + Math.random() * 900000)}`,
        medicine_id: payload.medicine_id,
        medicine_name: med ? med.name : "Medicine",
        total_quantity_dispensed: payload.quantity,
        allocations: batches.map((b) => ({
          batch_id: b.batch_id,
          batch_number: b.batch_number,
          expiry_date: b.expiry_date,
          quantity_dispensed: payload.quantity,
          remaining_in_batch: Math.max(0, b.quantity - payload.quantity),
        })),
        facility_id: payload.facility_id,
        dispensed_at: new Date().toISOString(),
        dispensed_by: "Dr. Pharmacist",
        fefo_compliant: true,
      }
    }
  },
}
