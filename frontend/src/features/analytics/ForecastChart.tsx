import React, { useState } from "react"
import { ForecastPoint } from "@/types/analytics"
import { cn } from "@/lib/utils"

interface ForecastChartProps {
  historicalPoints: ForecastPoint[]
  forecastPoints: ForecastPoint[]
  currentStock: number
  unit?: string
}

export function ForecastChart({
  historicalPoints,
  forecastPoints,
  currentStock,
  unit = "units/day",
}: ForecastChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    point: ForecastPoint
    isForecast: boolean
    x: number
    y: number
  } | null>(null)

  const allPoints = [...historicalPoints, ...forecastPoints]
  if (allPoints.length === 0) return null

  const width = 760
  const height = 260
  const padding = { top: 30, right: 30, bottom: 40, left: 50 }

  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom

  const maxVal = Math.max(...allPoints.map((p) => p.p90_upper), currentStock * 0.4, 60)
  const minVal = 0

  const getX = (index: number) => {
    return padding.left + (index / (allPoints.length - 1)) * innerWidth
  }

  const getY = (val: number) => {
    return padding.top + innerHeight - ((val - minVal) / (maxVal - minVal)) * innerHeight
  }

  // Confidence Interval Polygon (P10 to P90)
  const confidencePolygonPoints = [
    ...forecastPoints.map((p, idx) => {
      const globalIdx = historicalPoints.length + idx
      return `${getX(globalIdx)},${getY(p.p90_upper)}`
    }),
    ...[...forecastPoints].reverse().map((p, idx) => {
      const revIdx = forecastPoints.length - 1 - idx
      const globalIdx = historicalPoints.length + revIdx
      return `${getX(globalIdx)},${getY(p.p10_lower)}`
    }),
  ].join(" ")

  // Historical Path (Actuals)
  const historicalPath = historicalPoints
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${getX(idx)} ${getY(p.predicted_quantity)}`)
    .join(" ")

  // Forecast Path (P50 Predictions)
  const forecastPath = [
    `M ${getX(historicalPoints.length - 1)} ${getY(
      historicalPoints[historicalPoints.length - 1].predicted_quantity
    )}`,
    ...forecastPoints.map((p, idx) => `L ${getX(historicalPoints.length + idx)} ${getY(p.predicted_quantity)}`),
  ].join(" ")

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[300px] select-none"
      >
        <defs>
          <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.03" />
          </linearGradient>

          <linearGradient id="historicalLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + innerHeight * ratio
          const val = Math.round(maxVal - ratio * (maxVal - minVal))
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                fill="#64748b"
                fontSize="10"
                textAnchor="end"
                className="font-mono"
              >
                {val}
              </text>
            </g>
          )
        })}

        {/* Today Divider Line */}
        <line
          x1={getX(historicalPoints.length - 1)}
          y1={padding.top}
          x2={getX(historicalPoints.length - 1)}
          y2={height - padding.bottom}
          stroke="#06b6d4"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <text
          x={getX(historicalPoints.length - 1)}
          y={padding.top - 10}
          fill="#38bdf8"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          TODAY (Real-Time State)
        </text>

        {/* Confidence Interval Envelope Polygon */}
        {forecastPoints.length > 0 && (
          <polygon
            points={confidencePolygonPoints}
            fill="url(#confidenceGradient)"
            stroke="#6366f1"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
        )}

        {/* Historical Line */}
        <path
          d={historicalPath}
          fill="none"
          stroke="url(#historicalLineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Forecast Line */}
        <path
          d={forecastPath}
          fill="none"
          stroke="#818cf8"
          strokeWidth="2.5"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />

        {/* Data points (Hoverable) */}
        {allPoints.map((p, idx) => {
          const isForecast = idx >= historicalPoints.length
          const x = getX(idx)
          const y = getY(p.predicted_quantity)

          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r={isForecast ? 3.5 : 4}
              className={cn(
                "cursor-pointer transition-all duration-150",
                isForecast
                  ? "fill-indigo-400 stroke-slate-950 stroke-2 hover:r-6 hover:fill-indigo-300"
                  : "fill-cyan-400 stroke-slate-950 stroke-2 hover:r-6 hover:fill-cyan-300"
              )}
              onMouseEnter={() => setHoveredPoint({ point: p, isForecast, x, y })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          )
        })}

        {/* X Axis Date Labels */}
        {allPoints.map((p, idx) => {
          if (idx % 3 !== 0 && idx !== allPoints.length - 1) return null
          const x = getX(idx)
          const label = p.date.substring(5) // MM-DD
          return (
            <text
              key={idx}
              x={x}
              y={height - padding.bottom + 18}
              fill="#64748b"
              fontSize="9"
              textAnchor="middle"
              className="font-mono"
            >
              {label}
            </text>
          )
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none rounded-xl border border-slate-700 bg-slate-950/90 p-2.5 shadow-2xl backdrop-blur-md text-xs space-y-1"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100 - 30}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-bold text-white flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                hoveredPoint.isForecast ? "bg-indigo-400" : "bg-cyan-400"
              )}
            />
            {hoveredPoint.point.date} {hoveredPoint.isForecast ? "(AutoML Forecast)" : "(Actual BigQuery)"}
          </div>
          <div className="text-cyan-300 font-semibold">
            Consumption: {hoveredPoint.point.predicted_quantity} {unit}
          </div>
          {hoveredPoint.isForecast && (
            <div className="text-[10px] text-slate-400">
              Confidence Range: [{hoveredPoint.point.p10_lower} - {hoveredPoint.point.p90_upper}]
            </div>
          )}
        </div>
      )}
    </div>
  )
}
