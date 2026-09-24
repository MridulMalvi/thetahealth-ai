import { useState, useEffect } from "react"
import { MedicineSKU, MedicineBatch } from "@/types/pharmacy"
import { pharmacyService } from "@/services/pharmacyService"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  X,
  Pill,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  ThermometerSnowflake,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BatchDetailsModalProps {
  medicine: MedicineSKU | null
  onClose: () => void
  onOpenDispense: (medicine: MedicineSKU) => void
}

export function BatchDetailsModal({
  medicine,
  onClose,
  onOpenDispense,
}: BatchDetailsModalProps) {
  const [batches, setBatches] = useState<MedicineBatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (medicine) {
      setLoading(true)
      pharmacyService.getBatchesFEFO(medicine.id).then((data) => {
        setBatches(data)
        setLoading(false)
      })
    }
  }, [medicine])

  if (!medicine) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="ai" className="text-xs gap-1">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                FEFO Batch Intelligence
              </Badge>
              {medicine.is_cold_chain && (
                <Badge variant="warning" className="gap-1">
                  <ThermometerSnowflake className="h-3 w-3" /> Cold Chain (2°C - 8°C)
                </Badge>
              )}
              <span className="text-xs text-slate-400">SKU: {medicine.id}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Pill className="h-5 w-5 text-cyan-400" />
              {medicine.name}
            </h2>
            <p className="text-xs text-slate-400">
              Generic: <span className="text-slate-300 font-medium">{medicine.generic_name}</span> · {medicine.dosage_form} ({medicine.strength})
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stock & Burn Rate Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="bg-slate-900/80">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs text-slate-400">Total Stock Available</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold text-white">
                {medicine.total_stock}{" "}
                <span className="text-xs font-normal text-slate-400">{medicine.unit}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs text-slate-400">Daily Burn Rate</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold text-cyan-300">
                {medicine.daily_burn_rate}{" "}
                <span className="text-xs font-normal text-slate-400">units/day</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs text-slate-400">Days of Supply</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div
                className={cn(
                  "text-2xl font-bold",
                  medicine.days_of_supply <= 3
                    ? "text-rose-400"
                    : medicine.days_of_supply <= 7
                    ? "text-amber-400"
                    : "text-emerald-400"
                )}
              >
                {medicine.days_of_supply}{" "}
                <span className="text-xs font-normal text-slate-400">days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FEFO Batch List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              FEFO Dispensation Order (Earliest Expiry First)
            </h3>
            <span className="text-xs text-slate-400">{batches.length} active batches</span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">Loading batch details...</div>
          ) : batches.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
              No active batches in inventory. Stock replenishment required.
            </div>
          ) : (
            <div className="space-y-2">
              {batches.map((batch, index) => (
                <div
                  key={batch.batch_id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all",
                    index === 0
                      ? "border-cyan-500/50 bg-cyan-950/20 shadow-md shadow-cyan-500/5"
                      : "border-slate-800 bg-slate-900/50"
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Batch #{batch.batch_number}
                      </span>
                      {index === 0 && (
                        <Badge variant="ai" className="text-[9px] py-0 font-bold">
                          #1 NEXT FOR DISPENSE
                        </Badge>
                      )}
                      <Badge
                        variant={
                          batch.expiry_status === "CRITICAL"
                            ? "destructive"
                            : batch.expiry_status === "APPROACHING"
                            ? "warning"
                            : "success"
                        }
                        className="text-[9px] py-0"
                      >
                        {batch.days_to_expiry} Days Left
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>Mfg: {batch.manufacturing_date}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-300">
                        Exp: {batch.expiry_date}
                      </span>
                      <span>·</span>
                      <span>Supplier: {batch.supplier_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">
                        {batch.quantity} {medicine.unit}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        ₹{batch.unit_cost_inr.toFixed(2)}/unit
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Close
          </Button>

          <Button
            size="sm"
            onClick={() => {
              onClose()
              onOpenDispense(medicine)
            }}
            className="text-xs gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            Dispense via FEFO Rule
          </Button>
        </div>
      </div>
    </div>
  )
}
