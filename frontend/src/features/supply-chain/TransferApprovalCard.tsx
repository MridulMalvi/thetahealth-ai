import { useState } from "react"
import { TransferRecommendation } from "@/types/supplyChain"
import { supplyChainService } from "@/services/supplyChainService"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Truck,
  Building2,
  Clock,
  ShieldCheck,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TransferApprovalCardProps {
  recommendation: TransferRecommendation
  onActionComplete: () => void
}

export function TransferApprovalCard({
  recommendation,
  onActionComplete,
}: TransferApprovalCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState(recommendation.status)

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      await supplyChainService.approveRecommendation(recommendation.recommendation_id)
      setStatus("APPROVED")
      onActionComplete()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      await supplyChainService.rejectRecommendation(recommendation.recommendation_id)
      setStatus("REJECTED")
      onActionComplete()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card
      className={cn(
        "transition-all overflow-hidden relative",
        status === "APPROVED"
          ? "border-emerald-500/40 bg-emerald-950/20"
          : status === "REJECTED"
          ? "border-slate-800 bg-slate-950/40 opacity-70"
          : "border-cyan-500/30 bg-slate-900/80 hover:border-cyan-500/60 shadow-xl"
      )}
    >
      <CardContent className="p-5 space-y-4">
        {/* Top Header: Urgency & AI Match */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-300">
              #{recommendation.recommendation_id}
            </span>
            <Badge
              variant={
                recommendation.urgency_level === "CRITICAL"
                  ? "destructive"
                  : recommendation.urgency_level === "HIGH"
                  ? "warning"
                  : "default"
              }
              className="text-[10px] font-bold"
            >
              {recommendation.urgency_level} URGENCY
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant="ai" className="text-[10px] gap-1">
              <Sparkles className="h-3 w-3" />
              {Math.round(recommendation.match_confidence * 100)}% Match Score
            </Badge>
          </div>
        </div>

        {/* Transfer Route Visualizer: Donor -> Target */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-center sm:text-left">
          {/* Source Donor */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Donor Node (Surplus)
            </div>
            <div className="text-xs font-bold text-white line-clamp-1">
              {recommendation.source_facility_name}
            </div>
            <span className="text-[10px] text-slate-400">Batch: {recommendation.batch_number}</span>
          </div>

          {/* Transfer Arrow & Telemetry */}
          <div className="flex flex-col items-center justify-center space-y-1 py-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-300">
              <Truck className="h-3.5 w-3.5" />
              <span>
                {recommendation.quantity} {recommendation.unit}
              </span>
            </div>
            <div className="w-full flex items-center justify-center gap-1 text-slate-600">
              <div className="h-px bg-slate-700 flex-1" />
              <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
              <div className="h-px bg-slate-700 flex-1" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {recommendation.distance_km} km · ~{Math.round(recommendation.estimated_transit_hours * 60)} mins
            </span>
          </div>

          {/* Target Recipient */}
          <div className="space-y-0.5 sm:text-right">
            <div className="flex items-center justify-center sm:justify-end gap-1 text-[10px] text-rose-400 font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" /> Recipient (Deficit)
            </div>
            <div className="text-xs font-bold text-white line-clamp-1">
              {recommendation.target_facility_name}
            </div>
            <span className="text-[10px] text-rose-300 font-medium">Stockout in 2.1 Days</span>
          </div>
        </div>

        {/* Clinical Rationale */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">
            AI Optimization Rationale:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
            {recommendation.reasoning}
          </p>
        </div>

        {/* Action Buttons or Status Result */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Human-in-the-loop authorization required</span>
          </div>

          {status === "APPROVED" ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
              <Check className="h-4 w-4" />
              <span>Transfer Approved & Dispatched</span>
            </div>
          ) : status === "REJECTED" ? (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <XCircle className="h-4 w-4" />
              <span>Recommendation Rejected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                disabled={isProcessing}
                className="text-xs h-8 text-slate-400 hover:text-white"
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={isProcessing}
                className="text-xs h-8 gap-1.5 bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isProcessing ? "Authorizing..." : "Approve Transfer"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
