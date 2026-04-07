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

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  const isMobile =
  typeof window !== "undefined" && window.innerWidth < 768
  
  return (

    <div className="relative bg-slate-900/60 border border-white/10 p-5 rounded-xl">

      {/* TITLE */}
      <p className="text-sm text-slate-400 mb-4">
        {t("statusDistribution")}
      </p>

      {/* ✅ CENTER KPI */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center translate-y-4 md:translate-y-0 lg:translate-y-0">
          <p className="text-2xl md:text-4xl lg:text-8xl font-bold text-white">
            {total}
          </p>
          <p className="text-[10px] md:text-sm text-slate-400">
            {t("totalRepairs")}
          </p>
        </div>
      </div>

      {/* ✅ CHART CONTAINER (IMPORTANT) */}
      <div className="w-full h-[220px] md:h-[280px] lg:h-[340px] xl:h-[380px]">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
                innerRadius={isMobile ? 60 : 100}
                outerRadius={isMobile ? 90 : 140}
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
                  className="cursor-pointer hover:opacity-80 transition"
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