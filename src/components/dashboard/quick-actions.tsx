"use client"

import { useRouter } from "next/navigation"
import { t } from "@/lib/text"

export default function QuickActions() {

  const router = useRouter()

  const actions = [
    {
      id: "add",
      title: t("addNewRepair"),
      desc: t("addNewRepairDesc"),
      route: "/add-repair"
    },
    {
      id: "view",
      title: t("viewRepairs"),
      desc: t("viewRepairsDesc"),
      route: "/repairs"
    },
    {
      id: "track",
      title: t("trackDevice"),
      desc: t("trackDeviceDesc"),
      route: "/track"
    }
  ]

  return (

    <div>

      <h2>{t("quickActions")}</h2>

      {actions.map(action => (

        <div
          key={action.id}
          onClick={() => router.push(action.route)}
        >

          <div>{action.title}</div>
          <div>{action.desc}</div>

        </div>

      ))}

    </div>
  )
}