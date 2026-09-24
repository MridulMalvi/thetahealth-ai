import { EmergencyDeclaration, EmergencyAction } from "@/types/emergency"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"

const MOCK_EMERGENCY: EmergencyDeclaration = {
  emergency_id: "EMG-2026-DENGUE-01",
  title: "Dengue Fever Surge Protocol",
  type: "DENGUE_OUTBREAK",
  status: "ACTIVE",
  severity: "CRITICAL",
  affected_state: "Kerala",
  affected_district: "Ernakulam",
  affected_facilities_count: 12,
  affected_facilities: [
    "District Hospital Ernakulam",
    "General Hospital Aluva",
    "Taluk Hospital Paravur",
    "Taluk Hospital Muvattupuzha",
    "Community Health Centre Vengola",
    "Community Health Centre Kothamangalam",
    "Primary Health Centre Kalady",
    "Primary Health Centre Edathala",
    "Primary Health Centre Kumbalangi",
    "Primary Health Centre Mulavukad",
    "Urban Primary Health Centre Fort Kochi",
    "Urban Primary Health Centre Kakkanad"
  ],
  declared_at: new Date().toISOString(),
  declared_by: "Dr. Ananya Nair (District Medical Officer)",
  surge_multiplier: 1.85,
  priority_medicines: [
    "MED-001 (Paracetamol 500mg)",
    "MED-002 (Amoxicillin 500mg)",
    "MED-004 (ORS Packets)",
    "MED-005 (IV Normal Saline 500ml)",
    "MED-006 (Dengue NS1 Antigen Rapid Kit)",
    "MED-008 (Platelet Concentrates)"
  ],
  containment_progress_pct: 68.0,
  patient_cases_total: 438,
  emergency_beds_allocated: 84,
  active_actions: [
    {
      action_id: "ACT-01",
      title: "Activate 24/7 Mobile Dengue Triage Units",
      category: "TRIAGE",
      status: "COMPLETED",
      assigned_team: "Rapid Action Medical Wing 4",
      impact_summary: "3 mobile triage vans deployed to Kalady and Vengola PHCs"
    },
    {
      action_id: "ACT-02",
      title: "Commandeered Central Buffer Stock of IV Saline (1,500 units)",
      category: "SUPPLY_CHAIN",
      status: "COMPLETED",
      assigned_team: "State Medical Logistics Hub",
      impact_summary: "IV Fluids redistributed to DH Ernakulam & GH Aluva"
    },
    {
      action_id: "ACT-03",
      title: "Emergency Platelet Stock Pooling from Kottayam Regional Blood Bank",
      category: "BLOOD_BANK",
      status: "IN_PROGRESS",
      assigned_team: "District Transfusion Service",
      impact_summary: "35 units en route to Taluk Hospital Paravur"
    },
    {
      action_id: "ACT-04",
      title: "Expand Surge Inpatient Capacity by 30 Beds at General Hospital Aluva",
      category: "BED_SURGE",
      status: "PENDING_APPROVAL",
      assigned_team: "Hospital Facilities Administration",
      impact_summary: "Requires conversion of Day Care Ward to Step-Down Isolation"
    }
  ]
}

export const emergencyService = {
  async getActiveEmergency(): Promise<EmergencyDeclaration> {
    try {
      const res = await fetch(`${API_BASE}/emergency/active`)
      if (!res.ok) throw new Error("Backend unavailable")
      return await res.json()
    } catch {
      return MOCK_EMERGENCY
    }
  },

  async executeAction(actionId: string): Promise<EmergencyAction> {
    try {
      const res = await fetch(`${API_BASE}/emergency/actions/${actionId}/execute`, {
        method: "POST"
      })
      if (!res.ok) throw new Error("Backend unavailable")
      return await res.json()
    } catch {
      const act = MOCK_EMERGENCY.active_actions.find(a => a.action_id === actionId)
      if (act) {
        act.status = "COMPLETED"
        const comp = MOCK_EMERGENCY.active_actions.filter(a => a.status === "COMPLETED").length
        MOCK_EMERGENCY.containment_progress_pct = Math.round((comp / MOCK_EMERGENCY.active_actions.length) * 100)
        return act
      }
      throw new Error("Action not found")
    }
  }
}
