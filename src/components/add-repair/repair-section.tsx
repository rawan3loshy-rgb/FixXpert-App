"use client"

import Input from "@/components/ui/input"
import { t, tStatus } from "@/lib/text"

type Props = {
  price: string
  setPrice: (v: string) => void
  status: string
  setStatus: (v: string) => void
  technician: string
  setTechnician: (v: string) => void
  returned: boolean
  setReturned: (v: boolean) => void
  description: string
  setDescription: (v: string) => void
  allowedStatuses?: string[]
}

export default function RepairSection({
  price,
  setPrice,
  status,
  setStatus,
  technician,
  setTechnician,
  returned,
  setReturned,
  description,
  setDescription,
  allowedStatuses = []
}: Props){

  // 🎨 Status colors
  const STATUS_COLORS: Record<string, string> = {
    received: "bg-blue-500/20 text-blue-400",
    "pending-parts": "bg-yellow-500/20 text-yellow-400",
    "pending-answer": "bg-orange-500/20 text-orange-400",
    "in-repair": "bg-purple-500/20 text-purple-400",
    ready: "bg-green-500/20 text-green-400",
    delivered: "bg-gray-500/20 text-gray-400",
  }

  return (
    <div className="space-y-5">

      
      <div>
       

        <textarea
          placeholder={t("repairDetails") || "Repair details..."}
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          className="w-full bg-slate-800 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 💰 PRICE */}
      <div>
        <p className="text-xs text-slate-400 mb-1">
          {t("priceLabel")}
        </p>

        <Input
          placeholder={t("priceLabel")}
          value={price}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPrice(e.target.value)
          }
          className="w-full bg-slate-800 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 🔥 STATUS */}
      <div>
        <p className="text-xs text-slate-400 mb-2">
          {t("statusLabel")}
        </p>

        <select
          value={status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setStatus(e.target.value)
          }
          className={`
            w-full px-4 py-3 rounded-xl border border-white/10
            bg-slate-800 outline-none transition
            ${STATUS_COLORS[status] || "text-white"}
          `}
        >

          {/* CURRENT */}
          <option value={status}>
            {tStatus(status)} ({t("current") || "current"})
          </option>

          {/* ALLOWED */}
          {allowedStatuses.map((s) => (
            <option key={s} value={s}>
              {tStatus(s)}
            </option>
          ))}

        </select>

        {/* LOCK MESSAGE */}
        {allowedStatuses.length === 0 && status === "delivered" && (
          <p className="text-xs text-red-400 mt-2">
            {t("repairLocked") || "This repair is locked"}
          </p>
        )}
      </div>

      {/* 👨‍🔧 TECHNICIAN */}
      <div>
        <p className="text-xs text-slate-400 mb-1">
          {t("technicianLabel")}
        </p>

        
      </div>

      {/* 📦 RETURNED */}
      <label className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-white/10">
        <input
          type="checkbox"
          checked={returned}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setReturned(e.target.checked)
          }
          className="accent-indigo-600 w-4 h-4"
        />

        {t("deviceReturned") || "Device returned"}
      </label>

    </div>
  )
}