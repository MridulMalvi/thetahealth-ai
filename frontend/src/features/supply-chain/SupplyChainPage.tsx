import { PhaseScaffold } from "@/components/common/PhaseScaffold"
import { Truck } from "lucide-react"

export function SupplyChainPage() {
  return (
    <PhaseScaffold
      phaseNumber={12}
      phaseTitle="Supply Chain Control Tower & Resource Exchange"
      tagline="Multi-tier visibility and AI-powered inter-facility redistribution"
      description="Visualizes supply flow from Manufacturers → Central Warehouses → District Depots → Hospitals → PHCs with AI redistribution algorithms to prevent localized stockouts."
      icon={Truck}
      features={[
        "Multi-tier supply chain pipeline visualization & telemetry",
        "Facility surplus vs. deficit automated classification",
        "Redistribution optimization engine factoring in distance, urgency, and expiry",
        "Human-in-the-loop transfer recommendation approval interface",
        "Shipment status tracking with supplier delay impact modeling",
        "Emergency logistics corridor routing during critical events",
      ]}
    />
  )
}
