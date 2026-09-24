import { useAuth, DEMO_PERSONAS, RoleType } from "@/features/auth/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Shield,
  KeyRound,
  CheckCircle2,
  Users,
  Building2,
  Sparkles,
  Lock,
  Layers,
  Database,
  ArrowRight,
} from "lucide-react"

export function SettingsPage() {
  const { currentUser, switchRole, setIsRoleModalOpen } = useAuth()
  const roles = Object.keys(DEMO_PERSONAS) as RoleType[]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="ai" className="gap-1 px-2.5 py-0.5">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                Phase 2 · Security & RBAC Governance
              </Badge>
              <Badge variant="success">Firebase Auth Active</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="h-5 w-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Authentication & Role-Based Access Control
              </h1>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              FastAPI backend enforces JWT & Firebase ID token validation with strict role boundaries across 9 operational healthcare tiers.
            </p>
          </div>

          <Button
            onClick={() => setIsRoleModalOpen(true)}
            className="gap-2 text-xs shrink-0"
          >
            <Users className="h-4 w-4" />
            Switch Active Persona
          </Button>
        </div>
      </div>

      {/* Current User Session Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-cyan-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Persona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xl font-bold text-white">{currentUser.title}</div>
            <p className="text-xs text-slate-300 font-medium">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 font-mono">{currentUser.email}</p>
            <Badge variant="ai" className="mt-2 text-[10px]">
              Active Role: {currentUser.role}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Operational Scope
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {currentUser.facilityName || currentUser.districtName || "National Network"}
            </div>
            <p className="text-xs text-slate-400">{currentUser.scope}</p>
            <div className="pt-2">
              <span className="text-[10px] text-emerald-400 font-medium">
                ● Authorization Bound to Backend Endpoints
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Security Tokens & Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <KeyRound className="h-4 w-4 text-emerald-400" />
              Firebase Admin SDK
            </div>
            <p className="text-xs text-slate-400">
              Project: <span className="font-mono text-slate-300">thetahealth001</span>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="secondary" className="text-[10px]">FastAPI Depends()</Badge>
              <Badge variant="secondary" className="text-[10px]">Audit Logged</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RBAC 9-Tier Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-cyan-400" />
            9-Tier Role-Based Access Control Matrix
          </CardTitle>
          <CardDescription>
            Select any persona below to instantaneously test the application interface and backend permissions from that role's viewpoint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Role Tier</th>
                  <th className="py-3 px-3 font-semibold">Demo User</th>
                  <th className="py-3 px-3 font-semibold">Scope Level</th>
                  <th className="py-3 px-3 font-semibold">Primary Workspace</th>
                  <th className="py-3 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {roles.map((roleKey) => {
                  const persona = DEMO_PERSONAS[roleKey]
                  const isActive = currentUser.role === roleKey

                  return (
                    <tr
                      key={roleKey}
                      className={
                        isActive
                          ? "bg-cyan-950/20 text-white"
                          : "hover:bg-slate-900/50 text-slate-300"
                      }
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold flex items-center gap-2">
                          {persona.title}
                          {isActive && (
                            <Badge variant="ai" className="text-[9px] py-0">Current</Badge>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{roleKey}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium">{persona.name}</div>
                        <span className="text-[10px] text-slate-400">{persona.email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px]">
                          {persona.scope.split("(")[0]}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {roleKey === "PHC_WORKER" && "Theta Voice Assistant"}
                        {roleKey === "NATIONAL_ADMIN" && "National Command Center"}
                        {roleKey === "PHARMACIST" && "Pharmacy Intelligence"}
                        {roleKey === "SUPPLY_CHAIN_MANAGER" && "Resource Exchange"}
                        {roleKey === "EMERGENCY_OFFICER" && "Emergency Mode Ops"}
                        {roleKey === "ANALYST" && "Analytics & Forecasts"}
                        {roleKey === "HOSPITAL_ADMIN" && "Facility Operations"}
                        {roleKey === "DOCTOR_NURSE" && "Clinical Queue"}
                        {roleKey === "STATE_DISTRICT_ADMIN" && "District Dashboard"}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isActive ? (
                          <span className="text-emerald-400 font-semibold text-[11px] flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Active
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => switchRole(roleKey)}
                            className="h-7 text-xs"
                          >
                            Switch to this Role
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
