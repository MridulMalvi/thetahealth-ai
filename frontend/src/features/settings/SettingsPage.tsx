import { PhaseScaffold } from "@/components/common/PhaseScaffold"
import { Settings } from "lucide-react"

export function SettingsPage() {
  return (
    <PhaseScaffold
      phaseNumber={2}
      phaseTitle="Authentication, RBAC & Security Governance"
      tagline="Firebase Auth & granular 9-tier Role Based Access Control"
      description="Enforce security at the FastAPI backend level with Firebase token verification and fine-grained permissions across 9 healthcare operational roles."
      icon={Settings}
      features={[
        "Firebase Authentication (Email/Password, Google, GitHub SSO)",
        "9 RBAC Roles: National Admin, District Admin, Hospital Admin, PHC Worker, Doctor, Pharmacist, Supply Manager, Emergency Officer, Analyst",
        "FastAPI JWT/Firebase ID Token verification middleware",
        "Granular organizational scope enforcement (Country -> State -> District -> Facility)",
        "Full immutable audit trail logging all access, updates, and transfer approvals",
        "API Key & GCP credentials management",
      ]}
    />
  )
}
