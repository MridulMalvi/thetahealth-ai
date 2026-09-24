import {
  MedicineForecast,
  BedDemandForecast,
  AnalyticsOverview,
} from "@/types/analytics"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

export const analyticsService = {
  async getOverview(): Promise<AnalyticsOverview> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`)
      if (!res.ok) throw new Error("API error")
      return await res.json()
    } catch {
      return {
        total_consumed_ytd: 1420800,
        predicted_demand_next_14d: 98500,
        model_accuracy_pct: 94.2,
        active_anomalies_count: 1,
        monitored_medicines_count: 100,
        categories_trend: [
          { category: "ANTIBIOTIC", total_consumed_30d: 48200, growth_rate_pct: 18.4, seasonal_multiplier: 1.45 },
          { category: "ANALGESIC", total_consumed_30d: 92000, growth_rate_pct: 6.2, seasonal_multiplier: 1.10 },
          { category: "IV_FLUIDS", total_consumed_30d: 34500, growth_rate_pct: 12.1, seasonal_multiplier: 1.25 },
          { category: "ANTIMALARIAL", total_consumed_30d: 14200, growth_rate_pct: 34.0, seasonal_multiplier: 1.85 },
          { category: "VACCINE", total_consumed_30d: 8900, growth_rate_pct: -2.1, seasonal_multiplier: 0.98 },
        ],
      }
    }
  },

  async getMedicineForecast(
    medicineId: string = "MED-DOX-100",
    facilityId: string = "FAC-UP-MEE-003",
    horizonDays: number = 14
  ): Promise<MedicineForecast> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/analytics/forecasts/medicine?medicine_id=${medicineId}&facility_id=${facilityId}&horizon_days=${horizonDays}`
      )
      if (!res.ok) throw new Error("API error")
      return await res.json()
    } catch {
      const isDoxy = medicineId.includes("DOX")
      const baseBurn = isDoxy ? 38.0 : 32.5
      const currentStock = isDoxy ? 80 : 650

      const history = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (14 - i))
        const val = Math.round(baseBurn * (0.9 + Math.random() * 0.2))
        return {
          date: d.toISOString().split("T")[0],
          predicted_quantity: val,
          p10_lower: Math.round(val * 0.85),
          p90_upper: Math.round(val * 1.15),
          actual_quantity: val,
        }
      })

      const forecast = Array.from({ length: horizonDays }).map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() + (i + 1))
        const trend = isDoxy ? 1.0 + (i * 0.02) : 1.0
        const p50 = Math.round(baseBurn * trend * (0.95 + Math.random() * 0.1))
        return {
          date: d.toISOString().split("T")[0],
          predicted_quantity: p50,
          p10_lower: Math.round(p50 * 0.8),
          p90_upper: Math.round(p50 * 1.25),
          actual_quantity: null,
        }
      })

      const daysLeft = Number((currentStock / baseBurn).toFixed(1))

      return {
        medicine_id: medicineId,
        medicine_name: isDoxy ? "Doxycycline 100mg Capsules" : "Paracetamol 500mg Tablets",
        facility_id: facilityId,
        facility_name: isDoxy ? "PHC Rampur" : "PHC Anandpur",
        horizon_days: horizonDays,
        current_stock: currentStock,
        predicted_burn_rate_daily: baseBurn,
        days_until_stockout: daysLeft,
        predicted_stockout_date: isDoxy ? new Date(Date.now() + 2.1 * 86400000).toISOString().split("T")[0] : null,
        historical_points: history,
        forecast_points: forecast,
        confidence_score: 0.94,
        anomaly_detected: isDoxy,
        anomaly_reason: isDoxy
          ? "Outbreak vector surge: Dengue vector season in Meerut district cluster (+68% vs baseline)"
          : null,
      }
    }
  },

  async getBedForecast(): Promise<BedDemandForecast> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/forecasts/beds`)
      if (!res.ok) throw new Error("API error")
      return await res.json()
    } catch {
      const points = Array.from({ length: 24 }).map((_, i) => {
        const d = new Date(Date.now() + (i + 1) * 3 * 3600000)
        return {
          timestamp: d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" }),
          general_beds_demand: 140 + Math.floor(Math.sin(i / 2) * 15),
          icu_beds_demand: 18 + Math.floor((i / 24) * 5),
          emergency_beds_demand: 14 + Math.floor(Math.cos(i / 3) * 4),
          surge_risk_score: Number((0.65 + (i / 24) * 0.25).toFixed(2)),
        }
      })

      return {
        facility_id: "FAC-UP-MEE-001",
        facility_name: "District Hospital Meerut",
        horizon_hours: 72,
        points,
        peak_general_demand: 155,
        peak_icu_demand: 23,
        icu_saturation_risk_pct: 88.5,
      }
    }
  },
}
