"use client"

import { t } from "@/lib/text"

type Props = {
  label: string
  value: number
}

export default function StatCard({ label, value }: Props) {

  return (
    <div className="
      bg-slate-900/60
      border border-white/10
      rounded-xl
      p-5
      transition
      hover:scale-[1.02]
      hover:border-indigo-500/30
    ">

      {/* LABEL */}
      <p className="text-sm text-slate-400">
        {t(label)}
      </p>

      {/* VALUE */}
      <h2 className="text-3xl font-bold text-white mt-2">
        {value}
      </h2>

    </div>
  )
}