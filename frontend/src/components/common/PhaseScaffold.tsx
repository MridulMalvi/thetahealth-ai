import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, CheckCircle, ArrowRight, Construction } from "lucide-react"

interface PhaseScaffoldProps {
  phaseNumber: number
  phaseTitle: string
  tagline: string
  description: string
  features: string[]
  icon: React.ComponentType<{ className?: string }>
}

export function PhaseScaffold({
  phaseNumber,
  phaseTitle,
  tagline,
  description,
  features,
  icon: Icon,
}: PhaseScaffoldProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="ai" className="gap-1 px-2.5 py-0.5">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                Phase {phaseNumber} Module
              </Badge>
              <Badge variant="secondary">Ready for P{phaseNumber} Execution</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Icon className="h-5 w-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {phaseTitle}
              </h1>
            </div>
            <p className="text-sm font-medium text-cyan-300">{tagline}</p>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Construction className="h-4 w-4 text-cyan-400" />
            Core Capabilities & Architectural Scope
          </CardTitle>
          <CardDescription>
            Engineered per ThetaHealth AI Product Requirements Document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-slate-800/80 bg-slate-950/50 p-3"
              >
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 font-medium leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
