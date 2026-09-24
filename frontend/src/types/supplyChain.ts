export type ResourceBalanceStatus = "SURPLUS" | "NEUTRAL" | "NEEDS_RESOURCE"

export type TransferStatus = "PROPOSED" | "APPROVED" | "REJECTED" | "IN_TRANSIT" | "DELIVERED"

export interface FacilityResourceBalance {
  facility_id: string
  facility_name: string
  state_name: string
  district_name: string
  facility_type: string
  balance_status: ResourceBalanceStatus
  resilience_score: number
  surplus_items: string[]
  deficit_items: string[]
}

export interface TransferRecommendation {
  recommendation_id: string
  source_facility_id: string
  source_facility_name: string
  target_facility_id: string
  target_facility_name: string
  medicine_id: string
  medicine_name: string
  batch_number: string
  quantity: number
  unit: string
  distance_km: number
  estimated_transit_hours: number
  match_confidence: number
  urgency_level: "CRITICAL" | "HIGH" | "MODERATE"
  reasoning: string
  status: TransferStatus
  created_at: string
  decided_at?: string | null
  decided_by?: string | null
}

export interface Shipment {
  shipment_id: string
  origin_name: string
  destination_name: string
  medicine_name: string
  quantity: number
  unit: string
  status: "DISPATCHED" | "IN_TRANSIT" | "DELAYED" | "DELIVERED"
  eta: string
  delay_days: number
  corridor_status: "CLEAR" | "CONGESTED" | "WEATHER_DELAY"
  carrier_name: string
}

export interface SupplyChainSummary {
  total_shipments_in_transit: number
  surplus_nodes_count: number
  deficit_nodes_count: number
  pending_recommendations_count: number
  recommendations: TransferRecommendation[]
  shipments: Shipment[]
  facility_balances: FacilityResourceBalance[]
}
