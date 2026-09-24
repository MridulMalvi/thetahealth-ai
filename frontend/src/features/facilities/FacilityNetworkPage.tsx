import { PhaseScaffold } from "@/components/common/PhaseScaffold"
import { Layers } from "lucide-react"

export function FacilityNetworkPage() {
  return (
    <PhaseScaffold
      phaseNumber={3}
      phaseTitle="Facility Network & Digital Twin"
      tagline="Hierarchical telemetry from Country → State → District → Facility"
      description="Real-time operational digital twin consolidating inventory, bed occupancy, footfall, and workforce capacity across 400 healthcare facilities."
      icon={Layers}
      features={[
        "Country / State / District / Facility geographical hierarchy",
        "Facility classifications: Hospitals, PHCs, Community Health Centres, Warehouses",
        "Live Digital Twin state aggregation (Firestore Real-Time Listeners)",
        "Facility-level Resilience Scores & vulnerability heatmaps",
        "Geospatial mapping and route accessibility indexes",
        "Role-scoped facility views (National to PHC level)",
      ]}
    />
  )
}
