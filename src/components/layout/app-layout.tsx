"use client"

import { ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useToast } from "@/components/ui/toast-provider"
import NotificationsPanel from "@/components/ui/notifications-panel"
import { UserMenu } from "@/components/ui/user-menu"
import { t, setLang, getLang } from "@/lib/text"
import Sidebar from "@/components/sidebar"
import ProtectedRoute from "@/components/auth/protected-route"

export default function AppLayout({ children }: { children: ReactNode }) {

  const pathname = usePathname()
  const { notifications } = useToast()

  const [open,setOpen] = useState(false)
  const [lang,setLangState] = useState<"en"|"de">("en")
  const [mounted,setMounted] = useState(false)
  const [shop, setShop] = useState<any>(null)

  // 🔥 Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(()=>{
    setMounted(true)
    setLangState(getLang())
  },[])

  const changeLang = (l:"en"|"de")=>{
    setLang(l)
    setLangState(l)
    window.location.reload()
  }

  if(!mounted) return null

  return(
    <ProtectedRoute>

      {/* 🔥 MOBILE SIDEBAR (Framer Style) */}
      <div
        className={`
          fixed inset-0 z-50 flex
          transition-all duration-300
          ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >

        {/* Overlay */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`
            absolute inset-0 bg-black/60 backdrop-blur-sm
            transition-opacity duration-300
            ${sidebarOpen ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Sidebar */}
        <div
          className={`
            relative h-full w-[260px]
            bg-slate-900/95 backdrop-blur-xl
            border-r border-white/10
            transform transition-transform duration-300 ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar/>
        </div>
      </div>

      {/* 🔥 MAIN LAYOUT */}
      <div className="flex min-h-screen relative">

        {/* 💻 DESKTOP SIDEBAR */}
        <div className="hidden md:block w-[260px] shrink-0 border-r border-white/5">
          <Sidebar/>
        </div>

        {/* 📦 MAIN */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">

          <div className="w-full max-w-[1400px] mx-auto space-y-6">

            {/* 🔥 TOPBAR */}
            <div className="glass card flex justify-between items-center flex-wrap gap-3 px-4 py-3 relative z-10">

              {/* LEFT */}
              <div className="flex items-center gap-3">

                {/* ☰ MOBILE MENU */}
                <button
                  className="md:hidden text-xl text-white"
                  onClick={() => setSidebarOpen(true)}
                >
                  ☰
                </button>

                <div>
                  <p className="text-xs text-slate-400">{t("monitor")}</p>
                  <p className="text-sm text-slate-500">{pathname}</p>
                </div>

              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                {/* PLAN */}
                <div className="hidden sm:block text-xs text-slate-400 text-right">
                  <p>Plan</p>
                  <p className="text-white font-semibold">
                    {shop?.subscription_expires_at
                      ? new Date(shop.subscription_expires_at).toLocaleDateString()
                      : "No plan"}
                  </p>
                </div>

                {/* Notifications */}
                <button
                  onClick={()=>setOpen(!open)}
                  className="glass btn w-10 h-10 flex items-center justify-center rounded-xl"
                >
                  🔔
                </button>

                <NotificationsPanel open={open} onClose={()=>setOpen(false)}/>

                {/* Lang */}
                <div className="glass flex rounded-xl p-1">
                  <button 
                    onClick={()=>changeLang("en")} 
                    className={`px-3 py-1 rounded transition ${lang==="en" && "bg-indigo-600"}`}
                  >
                    EN
                  </button>

                  <button 
                    onClick={()=>changeLang("de")} 
                    className={`px-3 py-1 rounded transition ${lang==="de" && "bg-indigo-600"}`}
                  >
                    DE
                  </button>
                </div>

                {/* USER */}
                <UserMenu/>

              </div>

            </div>

            {/* 🔥 CONTENT (Smooth appearance) */}
            <div className="glass card p-4 md:p-6 transition-all duration-300">
              {children}
            </div>

          </div>

        </main>

      </div>

    </ProtectedRoute>
  )
}