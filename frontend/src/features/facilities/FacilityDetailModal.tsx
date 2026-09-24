import { Facility } from "@/types/facility"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  X,
  Building2,
  MapPin,
  Phone,
  Bed,
  Users,
  Pill,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowRight,
  Mic,
  Truck,
  Activity,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

interface FacilityDetailModalProps {
  facility: Facility | null
  onClose: () => void
}

export function FacilityDetailModal({ facility, onClose }: FacilityDetailModalProps) {
  const navigate = useNavigate()

  if (!facility) return null

  const dt = facility.digital_twin
  const beds = dt.beds
  const staff = dt.staff
  const inv = dt.inventory

  const totalBeds = beds.general_total + beds.icu_total + beds.emergency_total
  const occupiedBeds = beds.general_occupied + beds.icu_occupied + beds.emergency_occupied
  const bedPercent = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0

  const attendancePercent =
    staff.expected_staff_total > 0
      ? Math.round((staff.actual_staff_total / staff.expected_staff_total) * 100)
      : 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-6 md:p-8 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="ai" className="gap-1 px-2 py-0.5 text-xs">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                Operational Digital Twin
              </Badge>
              <Badge
                variant={
                  facility.status === "EMERGENCY"
                    ? "destructive"
                    : facility.status === "SURGE"
                    ? "warning"
                    : "success"
                }
              >
                {facility.status}
              </Badge>
              <span className="text-xs text-slate-400">Code: {facility.code}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Building2 className="h-6 w-6 text-cyan-400" />
              {facility.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                {facility.district_name}, {facility.state_name} ({facility.pincode})
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-500" />
                {facility.contact_phone}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Digital Twin Core Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Resilience Score */}
          <Card className="border-cyan-500/30 bg-slate-900/90">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs text-slate-400">Resilience Score</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex items-baseline gap-1.5">
                <span
                  className={cn(
                    "text-3xl font-black",
                    dt.resilience_score >= 85
                      ? "text-emerald-400"
                      : dt.resilience_score >= 70
                      ? "text-amber-400"
                      : "text-rose-400"
                  )}
                >
                  {dt.resilience_score}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <Badge
                variant={
                  dt.risk_level === "LOW"
                    ? "success"
                    : dt.risk_level === "MODERATE"
                    ? "warning"
                    : "destructive"
                }
                className="mt-2 text-[10px]"
              >
                {dt.risk_level} Risk Level
              </Badge>
            </CardContent>
          </Card>

          {/* Bed Occupancy */}
          <Card className="bg-slate-900/90">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs text-slate-400">Bed Occupancy</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold text-white">
                {occupiedBeds} <span className="text-xs font-normal text-slate-400">/ {totalBeds} beds</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    bedPercent > 85 ? "bg-rose-500" : bedPercent > 70 ? "bg-amber-400" : "bg-cyan-400"
                  )}
                  style={{ width: `${bedPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">{bedPercent}% Capacity</span>
            </CardContent>
          </Card>

          {/* Workforce Attendance */}
          <Card className="bg-slate-900/90">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs text-slate-400">Workforce on Duty</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold text-white">
                {staff.actual_staff_total}{" "}
                <span className="text-xs font-normal text-slate-400">
                  / {staff.expected_staff_total} staff
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${attendancePercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {attendancePercent}% Attendance
              </span>
            </CardContent>
          </Card>

          {/* Patient Footfall */}
          <Card className="bg-slate-900/90">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs text-slate-400">Patient Footfall</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold text-cyan-300">
                {dt.patient_footfall_today}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Projected tomorrow:{" "}
                <span className="text-white font-medium">
                  {dt.patient_footfall_predicted_tomorrow}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Beds & Clinical Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bed className="h-4 w-4 text-cyan-400" />
                Bed Allocation & Capacity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {totalBeds === 0 ? (
                <p className="text-xs text-slate-400">Facility does not host inpatient beds (Warehouse/Depot).</p>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">General Inpatient Beds</span>
                    <span className="font-semibold text-white">
                      {beds.general_occupied} / {beds.general_total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">ICU / Critical Care Beds</span>
                    <span className="font-semibold text-amber-400">
                      {beds.icu_occupied} / {beds.icu_total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Emergency & Triage Beds</span>
                    <span className="font-semibold text-rose-400">
                      {beds.emergency_occupied} / {beds.emergency_total}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pharmacy & Inventory Intelligence */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Pill className="h-4 w-4 text-emerald-400" />
                Pharmacy & Medicine Stock
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Total Monitored SKUs</span>
                <span className="font-semibold text-white">{inv.total_skus} SKUs</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Critical Stockouts (&lt;3 days)</span>
                <span
                  className={cn(
                    "font-semibold",
                    inv.critical_stockouts_count > 0 ? "text-rose-400" : "text-emerald-400"
                  )}
                >
                  {inv.critical_stockouts_count} SKUs
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Expiring in 30 Days (FEFO)</span>
                <span className="font-semibold text-amber-400">
                  {inv.expiring_in_30d_count} Batches
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Average Days of Supply</span>
                <span className="font-semibold text-cyan-300">
                  {inv.days_of_supply_avg} Days
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose()
                navigate("/voice")
              }}
              className="text-xs gap-1.5"
            >
              <Mic className="h-3.5 w-3.5 text-cyan-400" />
              Log Voice Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose()
                navigate("/supply-chain")
              }}
              className="text-xs gap-1.5"
            >
              <Truck className="h-3.5 w-3.5 text-amber-400" />
              Request Transfer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose()
                navigate("/pharmacy")
              }}
              className="text-xs gap-1.5"
            >
              <Pill className="h-3.5 w-3.5 text-emerald-400" />
              View Pharmacy
            </Button>
          </div>

          <Button
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  )
}
