"use client"

import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { t } from "@/lib/text"

export default function Sidebar(){
 
  const router = useRouter()
  const pathname = usePathname()

  const [collapsed,setCollapsed] = useState(false)

  const menu = [
    { label: t("dashboard"), icon: "🏠", path: "/dashboard" },
    { label: t("repairs"), icon: "📋", path: "/repairs" },
    { label: t("addRepair"), icon: "➕", path: "/add-repair" },
    { label: t("pipeline"), icon: "📊", path: "/pipeline" },
    { label: t("track"), icon: "🔍", path: "/track" },
  
  ]

  return(
    <div className={`
      min-h-screen transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}
      glass border-r border-white/10 p-3
    `}>

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between mb-6">

        {!collapsed && (
          <span className="font-bold text-lg">⚡ FixXpert</span>
        )}

        <button
          onClick={()=>setCollapsed(!collapsed)}
          className="btn glass w-8 h-8 flex items-center justify-center rounded-lg"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>

      </div>

      {/* MENU */}
      <div className="space-y-2">

        {menu.map(item=>{
          const active = pathname === item.path

          return(
            <motion.div
              key={item.path}
              whileHover={{scale:1.05}}
              onClick={()=>router.push(item.path)}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer
                card glow
                ${active ? "bg-indigo-600 text-white" : "bg-white/5"}
              `}
            >
              <span>{item.icon}</span>

              {!collapsed && (
                <span>{item.label}</span>
              )}
            </motion.div>
          )
        })}

      </div>

    </div>
  )
}