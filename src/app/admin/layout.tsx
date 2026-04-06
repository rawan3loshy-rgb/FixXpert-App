"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function AdminLayout({ children }: { children: ReactNode }) {

  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  const menu = [
    { name:"Dashboard", path:"/admin/dashboard", icon:"📊" },
    { name:"Repairs", path:"/admin/repairs", icon:"🛠" },
    { name:"Shops", path:"/admin/shops", icon:"🏪" },
    { name:"Subscriptions", path:"/admin/subscriptions", icon:"💳" },
    { name:"Devices", path:"/admin/devices", icon:"📱" },
    { name:"Problems", path:"/admin/problems", icon:"⚠️" },
  ]

  // 🔐 ADMIN PROTECTION (ما لمسناها)
  useEffect(()=>{
    checkAdmin()
  },[])

  async function checkAdmin(){

    const { data:{ session } } = await supabase.auth.getSession()

    if(!session){
      router.push("/login")
      return
    }

    const user = session.user

    const { data: shop } = await supabase
      .from("shops")
      .select("is_admin")
      .eq("owner", user.id)
      .single()

    if(!shop?.is_admin){
      router.push("/dashboard")
      return
    }

    setLoading(false)
  }

  // ⏳ LOADING
  if(loading){
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 to-black text-slate-400">
        Loading admin...
      </div>
    )
  }

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

      {/* 🔥 SIDEBAR ULTRA */}
      <div className={`
        ${collapsed ? "w-20" : "w-64"}
        transition-all duration-300
        bg-slate-900/70 backdrop-blur-xl
        border-r border-white/10
        flex flex-col
      `}>

        {/* LOGO + TOGGLE */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">

          {!collapsed && (
            <h2 className="text-lg font-bold tracking-wide">
              🚀 Admin
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 p-3 space-y-2">

          {menu.map(item => {

            const active = pathname === item.path

            return (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                onClick={()=>router.push(item.path)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition
                  ${active
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-slate-800/50 hover:bg-indigo-600/60 text-slate-300"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </motion.div>
            )
          })}

        </div>

        {/* FOOTER */}
        <div className="p-3 text-xs text-slate-500 border-t border-white/10">
          {!collapsed && "Admin Panel v1.0"}
        </div>

      </div>

      {/* 🔥 MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="h-[70px] flex items-center justify-between px-6 border-b border-white/10 bg-slate-900/40 backdrop-blur-xl">

          <h1 className="font-semibold text-lg">
            Admin Control Center
          </h1>

          <div className="flex items-center gap-3">

            {/* USER BADGE */}
            <div className="px-3 py-1 rounded-lg bg-slate-800 text-sm">
              Admin
            </div>

            {/* AVATAR */}
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
              A
            </div>

            {/* LOGOUT */}
            <button
              onClick={async ()=>{
                await supabase.auth.signOut()
                router.push("/login")
              }}
              className="text-sm text-red-400 hover:text-red-300 ml-3"
            >
              Logout
            </button>

          </div>

        </div>

        {/* CONTENT */}
        <div className="p-8 overflow-auto max-w-[1400px] mx-auto w-full">
          {children}
        </div>

      </div>

    </div>

  )
}