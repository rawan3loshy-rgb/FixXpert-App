"use client"

import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { t } from "@/lib/text"

type Props = {
  collapsed: boolean
}

export default function Sidebar({ collapsed }: Props){

  const router = useRouter()
  const pathname = usePathname()

  const menu = [
    { label: t("dashboard"), icon: "🏠", path: "/dashboard" },
    { label: t("repairs"), icon: "📋", path: "/repairs" },
    { label: t("addRepair"), icon: "➕", path: "/add-repair" },
    { label: t("pipeline"), icon: "📊", path: "/pipeline" },
    { label: t("track"), icon: "🔍", path: "/track" },
    { label: t("stock") || "Stock", icon: "📦", path: "/stock" },
  ]

  return(
    <div className="h-full flex flex-col p-3">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-center md:justify-between mb-6">

        {!collapsed && (
          <span className="font-bold text-lg tracking-wide text-white">
            ⚡ FixXpert App
          </span>
        )}

      </div>

      {/* MENU */}
      <div className="space-y-2 flex-1">

        {menu.map(item=>{
          const active = pathname === item.path

          return(
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={()=>router.push(item.path)}
              className={`
                flex items-center
                ${collapsed ? "justify-center" : "gap-3"}
                px-3 py-3 rounded-xl cursor-pointer
                transition-all duration-200

                ${active 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "bg-white/5 hover:bg-white/10 text-slate-300"
                }
              `}
            >

              {/* ICON */}
              <span className="text-lg">{item.icon}</span>

              {/* LABEL */}
              {!collapsed && (
                <span className="text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              )}

            </motion.div>
          )
        })}

      </div>

    </div>
  )
}