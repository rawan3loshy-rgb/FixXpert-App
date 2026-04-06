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

  // 🔥 NEW: sidebar mobile
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

      {/* 📱 MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative w-64 bg-slate-900 p-4">
            <Sidebar/>
          </div>

        </div>
      )}

      {/* 🔥 LAYOUT */}
      <div className="flex flex-col md:flex-row min-h-screen">

        {/* 💻 DESKTOP SIDEBAR */}
        <div className="hidden md:block">
          <Sidebar/>
        </div>

        {/* 📦 MAIN */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">

          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* 🔥 TOPBAR */}
            <div className="glass card flex justify-between items-center flex-wrap gap-3 px-4 py-3 relative z-[9999]"> 

              {/* LEFT */}
              <div className="flex items-center gap-3">

                {/* ☰ MOBILE MENU */}
                <button
                  className="md:hidden text-xl"
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

                {/* 🔥 EXPIRY DATE */}
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
                    className={`px-3 py-1 rounded ${lang==="en" && "bg-indigo-600"}`}
                  >
                    EN
                  </button>

                  <button 
                    onClick={()=>changeLang("de")} 
                    className={`px-3 py-1 rounded ${lang==="de" && "bg-indigo-600"}`}
                  >
                    DE
                  </button>
                </div>

                {/* USER */}
                <UserMenu/>

              </div>

            </div>

            {/* CONTENT */}
            <div className="glass card p-4 md:p-6">
              {children}
            </div>

          </div>

        </main>

      </div>

    </ProtectedRoute>
  )
}