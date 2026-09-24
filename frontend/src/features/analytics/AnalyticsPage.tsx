import { PhaseScaffold } from "@/components/common/PhaseScaffold"
import { BarChart3 } from "lucide-react"

export function AnalyticsPage() {
  return (
    <PhaseScaffold
      phaseNumber={10}
      phaseTitle="Predictive ML & BigQuery Analytics"
      tagline="Vertex AI 7/14/30-day demand forecasting & historical analytics"
      description="Time-series forecasting models trained on consumption patterns, patient footfall, seasonal vectors, and facility characteristics to anticipate resource needs before depletion occurs."
      icon={BarChart3}
      features={[
        "BigQuery partitioned historical consumption and footfall data lake",
        "Vertex AI AutoML medicine demand forecasting models (7/14/30-day curves)",
        "Bed occupancy and ICU demand predictive horizon forecasting",
        "Workforce shortage early warning indicators by specialty",
        "Confidence intervals (P10, P50, P90) on all predictive charts",
        "Anomaly detection for sudden unexplained consumption spikes",
      ]}
    />
  )
}
