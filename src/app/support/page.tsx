"use client"

import MarketingLayout from "@/components/MarketingLayout"
import { useLang } from "@/lib/useLang"

export default function SupportPage(){

  const { t } = useLang()

  const items = [
    { title: t("contact"), desc: "Email support 24/7" },
    { title: t("help"), desc: "Guides and tutorials" },
    { title: t("live"), desc: "Live chat support" }
  ]

  return (
    <MarketingLayout
      title={t("support_title")}
      subtitle={t("support_sub")}
    >

      <div className="grid md:grid-cols-3 gap-6">

        {items.map((item, i) => (

          <div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500 hover:scale-105 transition"
          >
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400">{item.desc}</p>
          </div>

        ))}

      </div>

    </MarketingLayout>
  )
}