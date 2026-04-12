"use client"

import { useEffect, useState, useRef } from "react"
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"
import { getLang, t } from "@/lib/text"

export default function RepairsChart({ repairs }: { repairs: any[] }) {

  const ref = useRef<HTMLDivElement>(null)

  const [width, setWidth] = useState(300) // fallback ثابت
  const [lang, setLang] = useState("en")

  useEffect(() => {
    setLang(getLang())

    const update = () => {
      if (!ref.current) return
      const w = ref.current.offsetWidth

      // 🔥 ضمان عدم الصفر
      if (w > 100) setWidth(w)
    }

    update()

    const observer = new ResizeObserver(update)
    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  const months =
    lang === "de"
      ? ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"]
      : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const monthlyData = months.map((month, index) => {
    const count = repairs.filter((r) => {
      const d = new Date(r.created_at)
      return d.getMonth() === index
    }).length

    return { month, repairs: count }
  })

  return (
    <div className="w-full space-y-4">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          📊 {t("repairsOverview")}
        </h2>
      </div>

      {/* 🔥 container */}
      <div ref={ref} className="w-full h-[280px]">

        <AreaChart
          width={width}
          height={280}
          data={monthlyData}
        >

          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />

          <defs>
            <linearGradient id="cinematicGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />

          <Tooltip />

          <Area
            dataKey="repairs"
            stroke="#6366f1"
            fill="url(#cinematicGradient)"
          />

          <Line dataKey="repairs" stroke="#818cf8" />

        </AreaChart>

      </div>

    </div>
  )
}