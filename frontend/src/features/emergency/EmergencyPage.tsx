import { useState, useEffect } from "react"
import {
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Activity,
  Package,
  Bed,
  MapPin,
  RefreshCw,
  Zap,
  TrendingUp,
  FileCheck
} from "lucide-react"
import { emergencyService } from "@/services/emergencyService"
import { EmergencyDeclaration, EmergencyAction } from "@/types/emergency"

export function EmergencyPage() {
  const [emergency, setEmergency] = useState<EmergencyDeclaration | null>(null)
  const [loading, setLoading] = useState(true)
  const [executingActionId, setExecutingActionId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"actions" | "resources" | "facilities">("actions")

  useEffect(() => {
    loadEmergencyData()
  }, [])

  const loadEmergencyData = async () => {
    try {
      const data = await emergencyService.getActiveEmergency()
      setEmergency(data)
    } finally {
      setLoading(false)
    }
  }

  const handleExecuteAction = async (actionId: string) => {
    setExecutingActionId(actionId)
    try {
      await emergencyService.executeAction(actionId)
      await loadEmergencyData()
    } finally {
      setExecutingActionId(null)
    }
  }

  if (loading || !emergency) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Outbreak Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900/90 to-amber-950/60 border border-red-500/40 p-6 backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                ACTIVE SURGE PROTOCOL
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {emergency.severity} SEVERITY
              </span>
              <span className="text-xs text-slate-400">
                ID: <span className="font-mono text-slate-200">{emergency.emergency_id}</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              {emergency.title}
            </h1>

            <p className="text-sm text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>{emergency.affected_district}, {emergency.affected_state}</span>
              <span className="text-slate-500">•</span>
              <span>{emergency.affected_facilities_count} High-Surge Facilities</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Authority: {emergency.declared_by}</span>
            </p>
          </div>

          {/* Containment Gauge */}
          <div className="flex items-center gap-4 bg-slate-900/80 border border-red-500/30 p-4 rounded-xl min-w-[240px]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${emergency.containment_progress_pct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-black text-emerald-400">{emergency.containment_progress_pct}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Containment Progress</p>
              <p className="text-sm font-bold text-white">Surge Control Loop</p>
              <span className="text-[11px] text-emerald-400 font-medium">Protocol Step 3 of 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Total Confirmed Cases</span>
            <div className="text-2xl font-black text-white">{emergency.patient_cases_total}</div>
            <span className="text-xs text-red-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +{((emergency.surge_multiplier - 1) * 100).toFixed(0)}% Surge Load
            </span>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Emergency Beds Mobilized</span>
            <div className="text-2xl font-black text-amber-400">{emergency.emergency_beds_allocated}</div>
            <span className="text-xs text-slate-400 font-medium">across 4 District Centres</span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Surge Multiplier</span>
            <div className="text-2xl font-black text-purple-400">{emergency.surge_multiplier}x</div>
            <span className="text-xs text-purple-300 font-medium">Automatic buffer recalculation</span>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Priority SKUs Fast-Tracked</span>
            <div className="text-2xl font-black text-emerald-400">{emergency.priority_medicines.length}</div>
            <span className="text-xs text-emerald-300 font-medium">IV Saline, Platelets & NS1</span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab("actions")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "actions"
              ? "border-red-500 text-red-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Incident Action Protocol ({emergency.active_actions.length})
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "resources"
              ? "border-red-500 text-red-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Package className="w-4 h-4" />
          Surge Resource Quotas ({emergency.priority_medicines.length})
        </button>
        <button
          onClick={() => setActiveTab("facilities")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "facilities"
              ? "border-red-500 text-red-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <MapPin className="w-4 h-4" />
          Affected Facilities Map ({emergency.affected_facilities_count})
        </button>
      </div>

      {/* Tab 1: Incident Action Protocol Checklist */}
      {activeTab === "actions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Surge Directive Checklist</h3>
            <span className="text-xs text-slate-400">Authorized command actions</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {emergency.active_actions.map((action: EmergencyAction) => (
              <div
                key={action.action_id}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {action.status === "COMPLETED" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : action.status === "IN_PROGRESS" ? (
                      <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{action.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        action.status === "COMPLETED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : action.status === "IN_PROGRESS"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}>
                        {action.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{action.impact_summary}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Assigned: {action.assigned_team}</p>
                  </div>
                </div>

                <div>
                  {action.status === "PENDING_APPROVAL" ? (
                    <button
                      onClick={() => handleExecuteAction(action.action_id)}
                      disabled={executingActionId === action.action_id}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-red-500/20 flex items-center gap-2"
                    >
                      {executingActionId === action.action_id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      )}
                      Authorize Surge Action
                    </button>
                  ) : action.status === "IN_PROGRESS" ? (
                    <button
                      onClick={() => handleExecuteAction(action.action_id)}
                      disabled={executingActionId === action.action_id}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Completed
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Executed & Logged
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Priority Medicines Surge Board */}
      {activeTab === "resources" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Fast-Track Surge SKUs</h3>
            <span className="text-xs text-emerald-400">1.85x Surge Multiplier Applied</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergency.priority_medicines.map((med, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    SURGE SKU #{idx + 1}
                  </span>
                  <span className="text-xs font-medium text-emerald-400">Express Routing</span>
                </div>
                <h4 className="text-sm font-bold text-white">{med}</h4>
                <p className="text-xs text-slate-400">Emergency reserve commandeered from Central State Logistics Hub.</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Buffer: +85% Target</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> Priority Tier 1
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Affected Facilities */}
      {activeTab === "facilities" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">District Containment Grid</h3>
            <span className="text-xs text-slate-400">{emergency.affected_district} Zone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {emergency.affected_facilities.map((fac, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-mono text-xs font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{fac}</p>
                  <p className="text-[11px] text-red-400 font-medium">Active Outbreak Posture</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
