import { useAuth, DEMO_PERSONAS, RoleType } from "./AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Layers,
  Building2,
  Mic,
  Stethoscope,
  Pill,
  Truck,
  Flame,
  BarChart3,
  Check,
  X,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ROLE_ICONS: Record<RoleType, React.ComponentType<{ className?: string }>> = {
  NATIONAL_ADMIN: Shield,
  STATE_DISTRICT_ADMIN: Layers,
  HOSPITAL_ADMIN: Building2,
  PHC_WORKER: Mic,
  DOCTOR_NURSE: Stethoscope,
  PHARMACIST: Pill,
  SUPPLY_CHAIN_MANAGER: Truck,
  EMERGENCY_OFFICER: Flame,
  ANALYST: BarChart3,
}

export function RoleSelectorModal() {
  const { currentUser, isRoleModalOpen, setIsRoleModalOpen, switchRole } = useAuth()

  if (!isRoleModalOpen) return null

  const roles = Object.keys(DEMO_PERSONAS) as RoleType[]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 p-6 md:p-8 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="ai" className="text-xs gap-1">
                <Sparkles className="h-3 w-3" />
                Live Demo Persona Switcher
              </Badge>
              <span className="text-xs text-slate-400">9 RBAC Scopes Available</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Switch Operational Role & Organizational Scope
            </h2>
          </div>
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 9 Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {roles.map((roleKey) => {
            const persona = DEMO_PERSONAS[roleKey]
            const Icon = ROLE_ICONS[roleKey]
            const isSelected = currentUser.role === roleKey

            return (
              <button
                key={roleKey}
                onClick={() => {
                  switchRole(roleKey)
                  setIsRoleModalOpen(false)
                }}
                className={cn(
                  "group flex flex-col items-start p-3.5 rounded-xl border text-left transition-all relative overflow-hidden",
                  isSelected
                    ? "border-cyan-500/80 bg-cyan-950/30 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50"
                    : "border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950">
                    <Check className="h-3.5 w-3.5 font-bold stroke-[3]" />
                  </div>
                )}

                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center mb-2.5 transition-colors",
                    isSelected
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-slate-800 text-slate-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-400"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                  {persona.title}
                </span>
                <span className="text-[11px] font-medium text-slate-300 mt-0.5">
                  {persona.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  Scope: {persona.scope}
                </span>
              </button>
            )
          })}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
          <span>Switches backend authorization claims and UI operational view instantly.</span>
          <Button
            size="sm"
            onClick={() => setIsRoleModalOpen(false)}
            className="text-xs"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
