import { PhaseScaffold } from "@/components/common/PhaseScaffold"
import { Mic } from "lucide-react"

export function ThetaVoicePage() {
  return (
    <PhaseScaffold
      phaseNumber={6}
      phaseTitle="Theta Voice & Conversational Intake"
      tagline="Radically simple voice-first reporting for Primary Health Centre workers"
      description="Zero complex forms. PHC workers speak naturally in English/regional languages. Audio is captured and converted via Gemini into structured, validated Firestore transactions."
      icon={Mic}
      features={[
        "In-browser Web Audio speech recognition & transcription",
        "Natural language structured entity extraction (Medicine, Qty, Batch, Action)",
        "Theta Clarify: conversational follow-up for ambiguous requests",
        "Confidence scores per extracted field (AI transparency)",
        "Mandatory human confirmation step prior to database commit",
        "Offline caching & background sync when connectivity is restored",
      ]}
    />
  )
}
