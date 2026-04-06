"use client"

import MarketingLayout from "@/components/MarketingLayout"
import { useLang } from "@/lib/useLang"

export default function PricingPage(){

  const { t } = useLang()

  const plans = [
    { name: t("trial"), price: "€0" },
    { name: t("pro"), price: "€29" },
    { name: t("business"), price: "€79" }
  ]

  return (
    <MarketingLayout
      title={t("pricing_title")}
      subtitle={t("pricing_sub")}
    >

      <div className="grid md:grid-cols-3 gap-6">

        {plans.map((p, i) => (

          <div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500 text-center transition hover:scale-105"
          >
            <h3 className="text-xl font-bold mb-2">{p.name}</h3>
            <p className="text-3xl mb-4">{p.price}</p>

            <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700">
              {t("select")}
            </button>
          </div>

        ))}

      </div>

    </MarketingLayout>
  )
}