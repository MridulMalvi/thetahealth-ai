import {
  SupplyChainSummary,
  TransferRecommendation,
} from "@/types/supplyChain"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

const FALLBACK_SUMMARY: SupplyChainSummary = {
  total_shipments_in_transit: 2,
  surplus_nodes_count: 3,
  deficit_nodes_count: 1,
  pending_recommendations_count: 2,
  recommendations: [
    {
      recommendation_id: "REC-TX-8831",
      source_facility_id: "FAC-UP-MEE-001",
      source_facility_name: "District Hospital Meerut",
      target_facility_id: "FAC-UP-MEE-003",
      target_facility_name: "PHC Rampur",
      medicine_id: "MED-DOX-100",
      medicine_name: "Doxycycline 100mg Capsules",
      batch_number: "DOX-2026-A1",
      quantity: 400,
      unit: "strips",
      distance_km: 18.4,
      estimated_transit_hours: 0.75,
      match_confidence: 0.98,
      urgency_level: "CRITICAL",
      reasoning: "PHC Rampur has 2.1 days of supply remaining under Dengue vector surge (+68% burn rate). District Hospital Meerut has 950 surplus units (28 days of supply). Redistribution resolves deficit with 0 impact on donor hospital safety buffer.",
      status: "PROPOSED",
      created_at: new Date().toISOString(),
    },
    {
      recommendation_id: "REC-TX-8832",
      source_facility_id: "FAC-UP-LKO-001",
      source_facility_name: "Central Medical Warehouse Lucknow",
      target_facility_id: "FAC-UP-MEE-003",
      target_facility_name: "PHC Rampur",
      medicine_id: "MED-ART-60",
      medicine_name: "Artesunate 60mg Injection",
      batch_number: "ART-662-X1",
      quantity: 50,
      unit: "vials",
      distance_km: 430.0,
      estimated_transit_hours: 6.5,
      match_confidence: 0.94,
      urgency_level: "HIGH",
      reasoning: "Replenishes antimalarial injection buffer before seasonal peak.",
      status: "PROPOSED",
      created_at: new Date().toISOString(),
    },
  ],
  shipments: [
    {
      shipment_id: "SHP-9901",
      origin_name: "Central Medical Warehouse Lucknow",
      destination_name: "District Hospital Meerut",
      medicine_name: "Normal Saline 0.9% IV (500ml)",
      quantity: 1200,
      unit: "bottles",
      status: "IN_TRANSIT",
      eta: "Today, 18:30 IST",
      delay_days: 0,
      corridor_status: "CLEAR",
      carrier_name: "UP Medical Logistics Express",
    },
    {
      shipment_id: "SHP-9902",
      origin_name: "Cipla Pharma Plant Baddi",
      destination_name: "Central Medical Warehouse Lucknow",
      medicine_name: "Oral Rehydration Salts (WHO Formula)",
      quantity: 15000,
      unit: "sachets",
      status: "DELAYED",
      eta: "Oct 01, 2026",
      delay_days: 4,
      corridor_status: "WEATHER_DELAY",
      carrier_name: "North Corridor Freightlines",
    },
  ],
  facility_balances: [
    {
      facility_id: "FAC-UP-MEE-001",
      facility_name: "District Hospital Meerut",
      state_name: "Uttar Pradesh",
      district_name: "Meerut",
      facility_type: "HOSPITAL",
      balance_status: "SURPLUS",
      resilience_score: 91.5,
      surplus_items: ["Normal Saline IV", "Paracetamol 500mg", "Doxycycline 100mg"],
      deficit_items: [],
    },
    {
      facility_id: "FAC-UP-MEE-003",
      facility_name: "PHC Rampur",
      state_name: "Uttar Pradesh",
      district_name: "Meerut",
      facility_type: "PHC",
      balance_status: "NEEDS_RESOURCE",
      resilience_score: 64.0,
      surplus_items: [],
      deficit_items: ["Doxycycline 100mg (2.1 days left)", "Artesunate 60mg (4.5 days left)"],
    },
    {
      facility_id: "FAC-UP-MEE-002",
      facility_name: "PHC Anandpur",
      state_name: "Uttar Pradesh",
      district_name: "Meerut",
      facility_type: "PHC",
      balance_status: "NEUTRAL",
      resilience_score: 88.2,
      surplus_items: [],
      deficit_items: [],
    },
    {
      facility_id: "FAC-UP-LKO-001",
      facility_name: "Central Medical Warehouse Lucknow",
      state_name: "Uttar Pradesh",
      district_name: "Lucknow",
      facility_type: "WAREHOUSE",
      balance_status: "SURPLUS",
      resilience_score: 98.0,
      surplus_items: ["Artesunate 60mg", "Normal Saline IV", "Rabies Vaccine"],
      deficit_items: [],
    },
  ],
}

export const supplyChainService = {
  async getSummary(): Promise<SupplyChainSummary> {
    try {
      const res = await fetch(`${API_BASE_URL}/supply/summary`)
      if (!res.ok) throw new Error("API error")
      return await res.json()
    } catch {
      return FALLBACK_SUMMARY
    }
  },

  async approveRecommendation(recommendationId: string): Promise<TransferRecommendation> {
    try {
      const res = await fetch(`${API_BASE_URL}/supply/recommendations/${recommendationId}/approve`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("API error")
      return await res.json()
    } catch {
      const rec = FALLBACK_SUMMARY.recommendations.find((r) => r.recommendation_id === recommendationId)
      if (rec) {
        rec.status = "APPROVED"
        rec.decided_at = new Date().toISOString()
        rec.decided_by = "National Administrator"
      }
      return rec || FALLBACK_SUMMARY.recommendations[0]
    }
  },

  async rejectRecommendation(recommendationId: string): Promise<TransferRecommendation> {
    try {
      const res = await fetch(`${API_BASE_URL}/supply/recommendations/${recommendationId}/reject`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("API error")
      return await res.json()
    } catch {
      const rec = FALLBACK_SUMMARY.recommendations.find((r) => r.recommendation_id === recommendationId)
      if (rec) {
        rec.status = "REJECTED"
        rec.decided_at = new Date().toISOString()
        rec.decided_by = "National Administrator"
      }
      return rec || FALLBACK_SUMMARY.recommendations[0]
    }
  },
}
