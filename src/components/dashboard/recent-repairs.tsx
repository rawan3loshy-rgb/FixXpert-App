"use client"

import { useState } from "react"
import { t, tStatus } from "@/lib/text"
import { useRouter } from "next/navigation"

interface Repair {
  id: string
  created_at: string
  customer: string
  device: string
  status: string
}

export default function RecentRepairs({ repairs }: { repairs: Repair[] }) {

  const [search, setSearch] = useState("")
  const router = useRouter()

  // 🔍 FILTER
  const filtered = repairs.filter((repair) =>
    repair.customer?.toLowerCase().includes(search.toLowerCase()) ||
    repair.device?.toLowerCase().includes(search.toLowerCase()) ||
    repair.status?.toLowerCase().includes(search.toLowerCase())
  )

  // 📅 SORT + LIMIT
  const latest = filtered
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5)

  // 🎨 STATUS COLORS
  const STATUS_COLORS: Record<string, string> = {
    received: "bg-blue-500/20 text-blue-400",
    "in-repair": "bg-indigo-500/20 text-indigo-400",
    "pending-answer": "bg-yellow-500/20 text-yellow-400",
    "pending-parts": "bg-orange-500/20 text-orange-400",
    ready: "bg-green-500/20 text-green-400",
    delivered: "bg-gray-500/20 text-gray-400",
  }

  return (

    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h3 className="text-lg font-semibold text-white">
          {t("recentRepairs")}
        </h3>

        <input
          placeholder={t("searchRepair")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            bg-slate-800 border border-white/10
            rounded-lg px-3 py-2 text-sm text-white
            placeholder-slate-400
          "
        />

      </div>

      {/* LIST */}
      <div className="space-y-3">

        {latest.length === 0 && (
          <p className="text-slate-500 text-sm">
            {t("noRepairs") || "No repairs"}
          </p>
        )}

        {latest.map((repair) => (

          <div
            key={repair.id}
            onClick={() => router.push(`/view-repair/${repair.id}`)}
            className="
              bg-slate-900/60
              border border-white/10
              rounded-xl
              p-4
              flex justify-between items-center
              hover:border-indigo-500/30
              hover:bg-slate-800
              transition
              cursor-pointer
            "
          >

            {/* LEFT */}
            <div>
              <p className="font-semibold text-white">
                {repair.customer}
              </p>

              <p className="text-xs text-slate-400">
                {repair.device}
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-right space-y-1">

              {/* STATUS */}
              <span className={`
                text-xs px-2 py-1 rounded-md
                ${STATUS_COLORS[repair.status] || "bg-slate-700 text-white"}
              `}>
                {tStatus(repair.status)}
              </span>

              {/* DATE */}
              <p className="text-xs text-slate-500">
                {new Date(repair.created_at).toLocaleDateString()}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}