import { PhaseScaffold } from "@/components/common/PhaseScaffold"
import { Flame } from "lucide-react"

export function EmergencyPage() {
  return (
    <PhaseScaffold
      phaseNumber={13}
      phaseTitle="Emergency Command Mode"
      tagline="Rapid coordination protocol for outbreaks, natural disasters, and surges"
      description="Instant system-wide high-priority posture for outbreak containment (Dengue, Respiratory, Flood response). Overrides standard reordering with prioritized surge routing."
      icon={Flame}
      features={[
        "Hero Outbreak Scenario: Dengue surge detection to resolution loop",
        "Targeted medical resource surge reallocations (IV Fluids, Platelets, Paracetamol)",
        "Facility surge capacity indicators & emergency triage bed allocations",
        "Rapid cross-district resource commandeering with executive authorization",
        "Real-time outbreak containment dashboard with affected radius mapping",
        "Post-emergency debriefing and audit log export",
      ]}
    />
  )
}
