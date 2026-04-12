"use client"

import { useRouter } from "next/navigation"
import { t, tStatus } from "@/lib/text"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { useEffect, useState } from "react"

type Props = {
  data: Record<string, number>
}

// 🎨 COLORS
const COLORS: Record<string, string> = {
  "received": "#3b82f6",
  "in-repair": "#6366f1",
  "pending-answer": "#f59e0b",
  "pending-parts": "#ea580c",
  "ready": "#22c55e",
  "delivered": "#64748b"
}

export default function StatusChart({ data }: Props) {

  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    const check = () => {
      setIsMobile(window.innerWidth < 768)
    }

    check()
    window.addEventListener("resize", check)

    return () => window.removeEventListener("resize", check)
  }, [])

  if (!mounted) return null

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (

    <div className="w-full h-full relative bg-slate-900/60 border border-white/10 p-5 rounded-xl">

      {/* TITLE */}
      <p className="text-sm text-slate-400 mb-4">
        {t("statusDistribution")}
      </p>

      {/* CENTER KPI */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-2xl md:text-4xl font-bold text-white">
            {total}
          </p>
          <p className="text-xs md:text-sm text-slate-400">
            {t("totalRepairs")}
          </p>
        </div>
      </div>

      {/* 🔥 FIXED CONTAINER */}
      <div className="w-full h-full min-w-0">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 60 : 90}
              outerRadius={isMobile ? 80 : 120}
              paddingAngle={3}
              isAnimationActive
              animationDuration={800}
              onClick={(entry:any) => {
                if (!entry?.name) return
                router.push(`/repairs?status=${entry.name}`)
              }}
            >

              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[entry.name] || "#8884d8"}
                />
              ))}

            </Pie>

            <Tooltip
              contentStyle={{
                background: "#020617",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "12px"
              }}
              formatter={(value, name) => [
                value as number,
                tStatus(name as string)
              ]}
            />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}