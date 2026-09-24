import { useState, useEffect } from "react"
import {
  Sliders,
  Play,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Activity,
  Bed,
  Package,
  Users,
  Clock,
  Sparkles,
  RefreshCw,
  Layers,
  ArrowRight
} from "lucide-react"
import { simulatorService } from "@/services/simulatorService"
import { SimulatorRequest, SimulatorResponse } from "@/types/simulator"

const PRESET_TEMPLATES = [
  {
    name: "Monsoon Dengue Epidemic",
    patientSurge: 65,
    supplierDelay: 5,
    staffAbsenteeism: 15,
    desc: "+65% admissions surge with 5-day regional road waterlogging disruptions"
  },
  {
    name: "Port Customs & Logistics Strike",
    patientSurge: 10,
    supplierDelay: 12,
    staffAbsenteeism: 5,
    desc: "12-day supply chain bottleneck on imported active pharmaceutical ingredients"
  },
  {
    name: "Viral Respiratory Winter Wave",
    patientSurge: 45,
    supplierDelay: 3,
    staffAbsenteeism: 25,
    desc: "High clinical staff absenteeism combined with pediatric ICU bed saturation"
  }
]

export function SimulatorPage() {
  const [params, setParams] = useState<SimulatorRequest>({
    scenario_name: "Custom Network Stress Test",
    patient_surge_pct: 35,
    supplier_delay_days: 4,
    staff_absenteeism_pct: 12,
    apply_ai_redistribution: true,
    apply_emergency_buffer: true
  })

  const [result, setResult] = useState<SimulatorResponse | null>(null)
  const [running, setRunning] = useState(false)

  const handleRunSimulation = async (customParams?: SimulatorRequest) => {
    setRunning(true)
    const activeParams = customParams || params
    try {
      const res = await simulatorService.runSimulation(activeParams)
      setResult(res)
    } finally {
      setRunning(false)
    }
  }

  useEffect(() => {
    handleRunSimulation()
  }, [])

  const applyTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    const updated: SimulatorRequest = {
      ...params,
      scenario_name: template.name,
      patient_surge_pct: template.patientSurge,
      supplier_delay_days: template.supplierDelay,
      staff_absenteeism_pct: template.staffAbsenteeism
    }
    setParams(updated)
    handleRunSimulation(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white">Healthcare What-If Scenario Simulator</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
              Monte Carlo Stress Testing
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate epidemic surges, supply delays, and workforce deficits to forecast resilience impact and test AI mitigations.
          </p>
        </div>

        <button
          onClick={() => handleRunSimulation()}
          disabled={running}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
        >
          {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          Execute Stress Test
        </button>
      </div>

      {/* Preset Crisis Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRESET_TEMPLATES.map((tmpl, idx) => (
          <div
            key={idx}
            onClick={() => applyTemplate(tmpl)}
            className="cursor-pointer bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-purple-500/40 p-3.5 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-purple-300">
              <span>{tmpl.name}</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">{tmpl.desc}</p>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-purple-400 font-mono">
              <span>+{tmpl.patientSurge}% Surge</span>
              <span>•</span>
              <span>+{tmpl.supplierDelay}d Delay</span>
              <span>•</span>
              <span>{tmpl.staffAbsenteeism}% Absent</span>
            </div>
          </div>
        ))}
      </div>

      {/* Control Sliders & Result Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Policy Toggles */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Stress Parameters
            </h3>

            {/* Slider 1: Patient Surge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  Patient Surge Load
                </span>
                <span className="font-mono font-bold text-red-400">+{params.patient_surge_pct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={params.patient_surge_pct}
                onChange={(e) => setParams({ ...params, patient_surge_pct: Number(e.target.value) })}
                className="w-full accent-red-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Baseline (0%)</span>
                <span>+75% Epidemic</span>
                <span>+150% Catastrophic</span>
              </div>
            </div>

            {/* Slider 2: Supplier Delay */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Supplier Lead-Time Delay
                </span>
                <span className="font-mono font-bold text-amber-400">+{params.supplier_delay_days} Days</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={params.supplier_delay_days}
                onChange={(e) => setParams({ ...params, supplier_delay_days: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 Days</span>
                <span>+10 Days</span>
                <span>+20 Days</span>
              </div>
            </div>

            {/* Slider 3: Staff Absenteeism */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Workforce Absenteeism
                </span>
                <span className="font-mono font-bold text-blue-400">{params.staff_absenteeism_pct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={params.staff_absenteeism_pct}
                onChange={(e) => setParams({ ...params, staff_absenteeism_pct: Number(e.target.value) })}
                className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% Normal</span>
                <span>25% Strike</span>
                <span>50% Severe</span>
              </div>
            </div>

            {/* Mitigation Toggles */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Counter-Measures</h4>
              
              <label className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-200 font-medium flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-teal-400" />
                  Automated AI Supply Leveling (+12.0 pts)
                </span>
                <input
                  type="checkbox"
                  checked={params.apply_ai_redistribution}
                  onChange={(e) => setParams({ ...params, apply_ai_redistribution: e.target.checked })}
                  className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-200 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Release Emergency Reserve Buffer (+8.0 pts)
                </span>
                <input
                  type="checkbox"
                  checked={params.apply_emergency_buffer}
                  onChange={(e) => setParams({ ...params, apply_emergency_buffer: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Projected Resilience Outcomes */}
        <div className="lg:col-span-7 space-y-4">
          {result && (
            <>
              {/* Resilience Score Gauge Comparison */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Projected Network Resilience Impact</h3>
                  <span className="text-xs font-mono text-slate-400">{result.scenario_name}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Baseline */}
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-xs text-slate-400 font-medium">Baseline Network State</span>
                    <div className="text-3xl font-black text-emerald-400">{result.baseline_resilience} <span className="text-sm font-normal text-slate-500">/ 100</span></div>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Resilient & Buffered
                    </span>
                  </div>

                  {/* Simulated Outcome */}
                  <div className="p-4 bg-slate-950/60 border border-purple-500/30 rounded-xl space-y-2">
                    <span className="text-xs text-purple-300 font-medium">Simulated Stress Outcome</span>
                    <div className="text-3xl font-black text-purple-400">{result.simulated_resilience} <span className="text-sm font-normal text-slate-500">/ 100</span></div>
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                      result.resilience_delta < 0 ? "text-red-400" : "text-emerald-400"
                    }`}>
                      {result.resilience_delta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                      {result.resilience_delta > 0 ? `+${result.resilience_delta}` : result.resilience_delta} Index Points
                    </span>
                  </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                      <Bed className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Peak Bed Occupancy</p>
                      <p className="text-sm font-bold text-white">{result.projected_bed_occupancy_pct}%</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Stockout Risk SKUs</p>
                      <p className="text-sm font-bold text-white">{result.stockout_risk_skus_count} SKUs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Bottlenecks */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Projected Critical Bottlenecks
                </h3>

                <div className="space-y-2">
                  {result.critical_bottlenecks.map((bn, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{bn.entity}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            bn.severity === "CATASTROPHIC"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : bn.severity === "CRITICAL"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}>
                            {bn.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{bn.description}</p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <span className="text-xs font-mono font-bold text-amber-400">T - {bn.days_until_breach}d</span>
                        <p className="text-[10px] text-slate-500">to breach</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Mitigations */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  Prescriptive Counter-Measures
                </h3>

                <ul className="space-y-2 text-xs">
                  {result.recommended_mitigations.map((mit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <ArrowRight className="w-3.5 h-3.5 text-teal-400 mt-0.5 flex-shrink-0" />
                      <span>{mit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
