import { Facility, NetworkOverviewStats } from "@/types/facility"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

// Fallback seed data for development & offline mode
const FALLBACK_FACILITIES: Facility[] = [
  {
    id: "FAC-UP-MEE-001",
    name: "District Hospital Meerut",
    code: "DH-MEE-01",
    type: "HOSPITAL",
    status: "OPERATIONAL",
    country_code: "IN",
    state_id: "ST-UP",
    state_name: "Uttar Pradesh",
    district_id: "DIST-MEE",
    district_name: "Meerut",
    pincode: "250001",
    address: "Civil Lines, Meerut, UP",
    contact_phone: "+91-121-2640101",
    coordinates: { latitude: 28.9845, longitude: 77.7064 },
    digital_twin: {
      resilience_score: 91.5,
      risk_level: "LOW",
      patient_footfall_today: 620,
      patient_footfall_predicted_tomorrow: 680,
      beds: {
        general_total: 180,
        general_occupied: 142,
        icu_total: 25,
        icu_occupied: 18,
        emergency_total: 20,
        emergency_occupied: 14,
      },
      staff: {
        doctors_on_duty: 28,
        nurses_on_duty: 64,
        pharmacists_on_duty: 6,
        support_staff_on_duty: 32,
        expected_staff_total: 135,
        actual_staff_total: 130,
      },
      inventory: {
        total_skus: 148,
        critical_stockouts_count: 0,
        expiring_in_30d_count: 4,
        days_of_supply_avg: 21.4,
        reorder_required_count: 2,
      },
      last_sync_timestamp: new Date().toISOString(),
    },
  },
  {
    id: "FAC-UP-MEE-002",
    name: "PHC Anandpur",
    code: "PHC-AND-01",
    type: "PHC",
    status: "OPERATIONAL",
    country_code: "IN",
    state_id: "ST-UP",
    state_name: "Uttar Pradesh",
    district_id: "DIST-MEE",
    district_name: "Meerut",
    pincode: "250004",
    address: "Village Anandpur, Block Daurala, Meerut",
    contact_phone: "+91-98765-43210",
    coordinates: { latitude: 29.0412, longitude: 77.6890 },
    digital_twin: {
      resilience_score: 88.2,
      risk_level: "LOW",
      patient_footfall_today: 85,
      patient_footfall_predicted_tomorrow: 95,
      beds: {
        general_total: 10,
        general_occupied: 4,
        icu_total: 0,
        icu_occupied: 0,
        emergency_total: 2,
        emergency_occupied: 1,
      },
      staff: {
        doctors_on_duty: 2,
        nurses_on_duty: 4,
        pharmacists_on_duty: 1,
        support_staff_on_duty: 3,
        expected_staff_total: 10,
        actual_staff_total: 10,
      },
      inventory: {
        total_skus: 42,
        critical_stockouts_count: 0,
        expiring_in_30d_count: 1,
        days_of_supply_avg: 14.8,
        reorder_required_count: 1,
      },
      last_sync_timestamp: new Date().toISOString(),
    },
  },
  {
    id: "FAC-UP-MEE-003",
    name: "PHC Rampur",
    code: "PHC-RAM-01",
    type: "PHC",
    status: "SURGE",
    country_code: "IN",
    state_id: "ST-UP",
    state_name: "Uttar Pradesh",
    district_id: "DIST-MEE",
    district_name: "Meerut",
    pincode: "250102",
    address: "Rural Sector 4, Rampur Sub-district, Meerut",
    contact_phone: "+91-98765-11223",
    coordinates: { latitude: 28.9100, longitude: 77.7400 },
    digital_twin: {
      resilience_score: 64.0,
      risk_level: "HIGH",
      patient_footfall_today: 145,
      patient_footfall_predicted_tomorrow: 190,
      beds: {
        general_total: 12,
        general_occupied: 11,
        icu_total: 0,
        icu_occupied: 0,
        emergency_total: 3,
        emergency_occupied: 3,
      },
      staff: {
        doctors_on_duty: 1,
        nurses_on_duty: 3,
        pharmacists_on_duty: 1,
        support_staff_on_duty: 2,
        expected_staff_total: 8,
        actual_staff_total: 7,
      },
      inventory: {
        total_skus: 38,
        critical_stockouts_count: 2,
        expiring_in_30d_count: 0,
        days_of_supply_avg: 2.1,
        reorder_required_count: 4,
      },
      last_sync_timestamp: new Date().toISOString(),
    },
  },
  {
    id: "FAC-UP-LKO-001",
    name: "Central Medical Warehouse Lucknow",
    code: "WH-LKO-01",
    type: "WAREHOUSE",
    status: "OPERATIONAL",
    country_code: "IN",
    state_id: "ST-UP",
    state_name: "Uttar Pradesh",
    district_id: "DIST-LKO",
    district_name: "Lucknow",
    pincode: "226001",
    address: "Transport Nagar, Sector B, Lucknow",
    contact_phone: "+91-522-2430000",
    coordinates: { latitude: 26.8467, longitude: 80.9462 },
    digital_twin: {
      resilience_score: 98.0,
      risk_level: "LOW",
      patient_footfall_today: 0,
      patient_footfall_predicted_tomorrow: 0,
      beds: {
        general_total: 0,
        general_occupied: 0,
        icu_total: 0,
        icu_occupied: 0,
        emergency_total: 0,
        emergency_occupied: 0,
      },
      staff: {
        doctors_on_duty: 0,
        nurses_on_duty: 0,
        pharmacists_on_duty: 8,
        support_staff_on_duty: 24,
        expected_staff_total: 35,
        actual_staff_total: 32,
      },
      inventory: {
        total_skus: 320,
        critical_stockouts_count: 0,
        expiring_in_30d_count: 8,
        days_of_supply_avg: 45.0,
        reorder_required_count: 0,
      },
      last_sync_timestamp: new Date().toISOString(),
    },
  },
  {
    id: "FAC-DL-CEN-001",
    name: "All India Institute of Medical Sciences (AIIMS)",
    code: "AIIMS-DEL-01",
    type: "HOSPITAL",
    status: "OPERATIONAL",
    country_code: "IN",
    state_id: "ST-DL",
    state_name: "Delhi",
    district_id: "DIST-DL-CEN",
    district_name: "Central Delhi",
    pincode: "110029",
    address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi",
    contact_phone: "+91-11-26588500",
    coordinates: { latitude: 28.5672, longitude: 77.2100 },
    digital_twin: {
      resilience_score: 96.4,
      risk_level: "LOW",
      patient_footfall_today: 2450,
      patient_footfall_predicted_tomorrow: 2600,
      beds: {
        general_total: 1800,
        general_occupied: 1650,
        icu_total: 240,
        icu_occupied: 218,
        emergency_total: 120,
        emergency_occupied: 98,
      },
      staff: {
        doctors_on_duty: 320,
        nurses_on_duty: 780,
        pharmacists_on_duty: 45,
        support_staff_on_duty: 410,
        expected_staff_total: 1600,
        actual_staff_total: 1555,
      },
      inventory: {
        total_skus: 480,
        critical_stockouts_count: 0,
        expiring_in_30d_count: 12,
        days_of_supply_avg: 28.6,
        reorder_required_count: 5,
      },
      last_sync_timestamp: new Date().toISOString(),
    },
  },
  {
    id: "FAC-MH-MUM-001",
    name: "King Edward Memorial Hospital Mumbai",
    code: "KEM-MUM-01",
    type: "HOSPITAL",
    status: "SURGE",
    country_code: "IN",
    state_id: "ST-MH",
    state_name: "Maharashtra",
    district_id: "DIST-MH-MUM",
    district_name: "Mumbai City",
    pincode: "400012",
    address: "Acharya Donde Marg, Parel, Mumbai",
    contact_phone: "+91-22-24107000",
    coordinates: { latitude: 19.0016, longitude: 72.8427 },
    digital_twin: {
      resilience_score: 78.5,
      risk_level: "MODERATE",
      patient_footfall_today: 1820,
      patient_footfall_predicted_tomorrow: 1950,
      beds: {
        general_total: 1200,
        general_occupied: 1120,
        icu_total: 150,
        icu_occupied: 146,
        emergency_total: 80,
        emergency_occupied: 76,
      },
      staff: {
        doctors_on_duty: 180,
        nurses_on_duty: 420,
        pharmacists_on_duty: 22,
        support_staff_on_duty: 210,
        expected_staff_total: 850,
        actual_staff_total: 832,
      },
      inventory: {
        total_skus: 360,
        critical_stockouts_count: 1,
        expiring_in_30d_count: 7,
        days_of_supply_avg: 12.4,
        reorder_required_count: 8,
      },
      last_sync_timestamp: new Date().toISOString(),
    },
  },
]

export const facilityService = {
  async getFacilities(filters?: {
    state_id?: string
    district_id?: string
    facility_type?: string
    search?: string
  }): Promise<Facility[]> {
    try {
      const params = new URLSearchParams()
      if (filters?.state_id) params.append("state_id", filters.state_id)
      if (filters?.district_id) params.append("district_id", filters.district_id)
      if (filters?.facility_type) params.append("facility_type", filters.facility_type)
      if (filters?.search) params.append("search", filters.search)

      const res = await fetch(`${API_BASE_URL}/facilities?${params.toString()}`)
      if (!res.ok) throw new Error("Backend unavailable")
      return await res.json()
    } catch {
      // Fallback
      let result = [...FALLBACK_FACILITIES]
      if (filters?.state_id) {
        result = result.filter((f) => f.state_id === filters.state_id)
      }
      if (filters?.facility_type) {
        result = result.filter((f) => f.type === filters.facility_type)
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase()
        result = result.filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.district_name.toLowerCase().includes(q) ||
            f.state_name.toLowerCase().includes(q)
        )
      }
      return result
    }
  },

  async getFacilityById(id: string): Promise<Facility | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/facilities/${id}`)
      if (!res.ok) throw new Error("Facility not found")
      return await res.json()
    } catch {
      return FALLBACK_FACILITIES.find((f) => f.id === id) || null
    }
  },

  async getOverviewStats(): Promise<NetworkOverviewStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/facilities/stats/overview`)
      if (!res.ok) throw new Error("Overview stats unavailable")
      return await res.json()
    } catch {
      return {
        total_states: 10,
        total_districts: 50,
        total_facilities: 400,
        total_hospitals: 100,
        total_phcs: 300,
        total_warehouses: 15,
        total_beds: 5662,
        total_beds_occupied: 4945,
        average_occupancy_rate: 87.3,
        average_resilience_score: 94.2,
        facilities_with_stockout_risk: 3,
        facilities_in_emergency: 2,
      }
    }
  },
}
