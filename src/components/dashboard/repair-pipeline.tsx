"use client"

import Card from "@/components/ui/card"
import { t, tStatus } from "@/lib/text"

// 🎨 COLORS PER STATUS
const STATUS_COLORS: Record<string, string> = {
  received: "border-blue-500/30",
  "in-repair": "border-indigo-500/30",
  "pending-answer": "border-yellow-500/30",
  "pending-parts": "border-orange-500/30",
  ready: "border-green-500/30",
  delivered: "border-gray-500/30",
}

export default function RepairPipeline({ repairs }: { repairs: any[] }) {

  const stages = [
    { key: "received" },
    { key: "in-repair" },
    { key: "pending-answer" },
    { key: "pending-parts" },
    { key: "ready" },
    { key: "delivered" }
  ]

  return (
    <Card>

      {/* HEADER */}
      <h3 className="mb-6 font-semibold text-lg text-white">
        {t("repairPipeline")}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

        {stages.map(stage => {

          const items = repairs.filter(
            r => r.status?.toLowerCase().replace(/\s+/g, "-") === stage.key
          )

          return (
            <div
              key={stage.key}
              className={`
                rounded-xl p-4
                bg-slate-900/60
                border ${STATUS_COLORS[stage.key] || "border-white/10"}
                transition hover:scale-[1.02]
              `}
            >

              {/* TITLE */}
              <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">
                {tStatus(stage.key)}
              </p>

              {/* COUNT */}
              <p className="text-2xl font-bold text-white mb-3">
                {items.length}
              </p>

              {/* ITEMS */}
              <div className="space-y-2 max-h-[200px] overflow-auto pr-1">

                {items.length === 0 && (
                  <p className="text-xs text-slate-500">
                    {t("noRepairs") || "No repairs"}
                  </p>
                )}

                {items.map(r => (
                  <div
                    key={r.id}
                    className="
                      p-3 rounded-lg 
                      bg-slate-800 
                      border border-white/10
                      hover:bg-slate-700 transition
                    "
                  >
                    <p className="text-sm font-semibold text-white">
                      {r.customer}
                    </p>

                    <p className="text-xs text-slate-400">
                      {r.device}
                    </p>
                  </div>
                ))}

              </div>

            </div>
          )
        })}

      </div>

    </Card>
  )
}