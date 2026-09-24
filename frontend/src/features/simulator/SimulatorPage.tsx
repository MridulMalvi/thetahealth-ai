import { PhaseScaffold } from "@/components/common/PhaseScaffold"
import { Cpu } from "lucide-react"

export function SimulatorPage() {
  return (
    <PhaseScaffold
      phaseNumber={15}
      phaseTitle="Healthcare What-If Scenario Simulator"
      tagline="Stress-test supply chains and hospital capacity before crises hit"
      description="Interactive simulation engine allowing health administrators to model +30% patient surges, 7-day supplier strikes, or staff shortages and evaluate resilience response strategies."
      icon={Cpu}
      features={[
        "Surge parameters: Patient footfall (+10% to +100%), Outbreak vector intensity",
        "Supply chain shocks: Supplier delays (+1 to +14 days), Delivery failure rates",
        "Workforce disruptions: Absenteeism rates, Emergency doctor redeployment",
        "Comparative side-by-side projected stockout and bed deficit analysis",
        "Deterministic synthetic data seeds for 100% reproducible demo scenarios",
        "Resilience Score impact simulation with Gemini strategic debriefing",
      ]}
    />
  )
}
