"use client"

import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import { getLang, t } from "@/lib/text"

export default function RepairsChart({ repairs }: { repairs: any[] }) {

  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const [lang, setLang] = useState("en")

  useEffect(() => {
    setMounted(true)
    setLang(getLang())

    setTimeout(() => {
      setReady(true)
    }, 120) // smoother than 100
  }, [])

  if (!mounted || !ready) return null

  // 🌍 months
  const months =
    lang === "de"
      ? ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"]
      : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  // 📊 data
  const monthlyData = months.map((month, index) => {

    const count = repairs.filter((r) => {
      const d = new Date(r.created_at)
      return d.getMonth() === index
    }).length

    return {
      month,
      repairs: count
    }
  })

  return (
    <div className="w-full space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white tracking-wide">
          📊 {t("repairsOverview") || "Repairs Overview"}
        </h2>

        <span className="text-xs text-slate-400">
          {t("monthlyStats") || "Monthly statistics"}
        </span>
      </div>

      {/* CHART */}
      <div className="w-full" style={{ height: 320 }}>

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={monthlyData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >

            {/* GRID */}
            <CartesianGrid
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            {/* GRADIENT */}
            <defs>
              <linearGradient id="cinematicGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="60%" stopColor="#6366f1" stopOpacity={0.25}/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>

            {/* AXIS */}
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            {/* TOOLTIP */}
            <Tooltip
              contentStyle={{
                background: "rgba(2,6,23,0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
              cursor={{
                stroke: "#6366f1",
                strokeWidth: 1,
                strokeDasharray: "4 4"
              }}
            />

            {/* AREA */}
            <Area
              type="monotone"
              dataKey="repairs"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#cinematicGradient)"
              isAnimationActive
              animationDuration={900}
            />

            {/* LINE GLOW */}
            <Line
              type="monotone"
              dataKey="repairs"
              stroke="#818cf8"
              strokeWidth={2}
              dot={{
                r: 3,
                stroke: "#fff",
                strokeWidth: 1,
                fill: "#6366f1"
              }}
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: "#6366f1",
                strokeWidth: 2
              }}
              isAnimationActive
              animationDuration={900}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}