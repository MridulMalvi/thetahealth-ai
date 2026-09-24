import { useState } from "react"
import { MedicineSKU, DispenseResult } from "@/types/pharmacy"
import { pharmacyService } from "@/services/pharmacyService"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  X,
  Pill,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react"

interface DispenseModalProps {
  medicine: MedicineSKU | null
  onClose: () => void
  onSuccess: () => void
}

export function DispenseModal({ medicine, onClose, onSuccess }: DispenseModalProps) {
  const [quantity, setQuantity] = useState<number>(10)
  const [notes, setNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [result, setResult] = useState<DispenseResult | null>(null)

  if (!medicine) return null

  const handleDispense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (quantity <= 0) return

    setIsSubmitting(true)
    try {
      const res = await pharmacyService.dispenseFEFO({
        facility_id: "FAC-UP-MEE-002",
        medicine_id: medicine.id,
        quantity: Number(quantity),
        notes: notes || "Outpatient pharmacy dispensation",
      })
      setResult(res)
      onSuccess()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="ai" className="text-[10px]">
                <Sparkles className="h-3 w-3 mr-1" /> Automated FEFO Dispenser
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <Pill className="h-5 w-5 text-cyan-400" />
              Dispense {medicine.name}
            </h2>
            <p className="text-xs text-slate-400">
              Current Available Stock: <span className="text-white font-bold">{medicine.total_stock} {medicine.unit}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {result ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2 text-center">
              <div className="h-10 w-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Dispensation Successful</h3>
              <p className="text-xs text-slate-300">
                Dispensed <span className="font-bold text-white">{result.total_quantity_dispensed} {medicine.unit}</span> strictly complying with FEFO rules.
              </p>
              <span className="text-[10px] font-mono text-slate-400 block">
                Ref: {result.transaction_id}
              </span>
            </div>

            {/* Batch Allocation breakdown */}
            <div className="space-y-2 border border-slate-800 rounded-xl p-3 bg-slate-900/60">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                FEFO Batch Deductions
              </span>
              <div className="space-y-1.5 text-xs">
                {result.allocations.map((alloc) => (
                  <div
                    key={alloc.batch_id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 text-slate-300"
                  >
                    <span>Batch #{alloc.batch_number} (Exp: {alloc.expiry_date})</span>
                    <span className="font-bold text-cyan-300">-{alloc.quantity_dispensed} {medicine.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={onClose}
              className="w-full text-xs"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleDispense} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Quantity to Dispense ({medicine.unit})
              </label>
              <Input
                type="number"
                min="1"
                max={medicine.total_stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="bg-slate-900/80"
              />
              <span className="text-[10px] text-slate-400">
                Engine will automatically deduct from the earliest-expiring batch first.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Dispensation Notes / Prescription Ref (Optional)
              </label>
              <Input
                placeholder="e.g. OPD patient #8821 prescription"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-slate-900/80"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || quantity <= 0 || quantity > medicine.total_stock}
                className="text-xs gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isSubmitting ? "Allocating FEFO..." : "Confirm Dispense"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
