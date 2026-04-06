"use client"

import MarketingLayout from "@/components/MarketingLayout"
import { useLang } from "@/lib/useLang"

export default function AboutPage(){

  const { t } = useLang()

  return (
    <MarketingLayout
      title={t("about_title")}
      subtitle={t("about_sub")}
    >

      <div className="max-w-3xl mx-auto text-center text-slate-400 space-y-6">

        <p>
          FixXpert is a modern SaaS platform built for repair shops.
        </p>

        <p>
          Manage repairs, customers and inventory in one system.
        </p>

      </div>

    </MarketingLayout>
  )
}