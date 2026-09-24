import { PhaseScaffold } from "@/components/common/PhaseScaffold"
import { Pill } from "lucide-react"

export function PharmacyPage() {
  return (
    <PhaseScaffold
      phaseNumber={5}
      phaseTitle="Pharmacy & Inventory Intelligence"
      tagline="SKU tracking, FEFO batch management, and expiry intelligence"
      description="Track every essential medicine SKU across all healthcare nodes with First Expiry First Out (FEFO) dispensing rules, minimum buffer levels, and automated replenishment alerts."
      icon={Pill}
      features={[
        "Medicine SKU catalog with therapeutic categories and standard pack sizes",
        "Batch-level tracking with manufacturing and expiry date surveillance",
        "FEFO automated sorting for pharmacy dispensing workflows",
        "Expiry wastage risk ranking & automated redistribution triggers",
        "Buffer stock threshold alerts with calculated days-of-supply",
        "Cold-chain temperature sensitivity indicators",
      ]}
    />
  )
}
