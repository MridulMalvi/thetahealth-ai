import { PhaseScaffold } from "@/components/common/PhaseScaffold"
import { BotMessageSquare } from "lucide-react"

export function CopilotPage() {
  return (
    <PhaseScaffold
      phaseNumber={14}
      phaseTitle="Ask Theta — Healthcare AI Copilot"
      tagline="Authoritative conversational intelligence powered by Gemini & Grounded Database Tools"
      description="Natural-language operational assistant for healthcare leaders. Answers questions using live Firestore and BigQuery facts—never fabricates data or hallucinates clinical decisions."
      icon={BotMessageSquare}
      features={[
        "Grounding in live Firestore operational state & BigQuery historical trends",
        "Tool-calling architecture: GetFacilityInventory, QueryStockoutRisk, GetResilienceScore",
        "Executive summaries, risk explanations, and automated scenario briefs",
        "Zero clinical diagnosis/prescription guardrails strictly enforced",
        "Per-query confidence score and underlying source data references",
        "Instant drill-down links to facilities, transfers, and inventory batches",
      ]}
    />
  )
}
