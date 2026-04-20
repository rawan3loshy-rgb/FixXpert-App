"use client"

import { ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useToast } from "@/components/ui/toast-provider"
import NotificationsPanel from "@/components/ui/notifications-panel"
import { UserMenu } from "@/components/ui/user-menu"
import { t, setLang, getLang } from "@/lib/text"
import Sidebar from "@/components/sidebar"
import ProtectedRoute from "@/components/auth/protected-route"
import { supabase } from "@/lib/supabase"

export default function AppLayout({ children }: { children: ReactNode }) {

  const pathname = usePathname()
  const { notifications } = useToast()

  const [open,setOpen] = useState(false)
  const [lang,setLangState] = useState<"en"|"de">("en")
  const [mounted,setMounted] = useState(false)
  const [checking, setChecking] = useState(true)

  // 🔥 مهم
  const [shopId, setShopId] = useState<string | null>(null)
  const [shop, setShop] = useState<any>(null)

  // 🔥 SIDEBAR STATES
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isPublic =
  pathname.startsWith("/track") ||
  pathname.startsWith("/login") ||
  pathname.startsWith("/signup")

  // ✅ 1. أول شي نجيب shop_id
  useEffect(() => {
    async function loadShop() {

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setChecking(false)
        return
      }

      const { data } = await supabase
        .from("shops")
        .select("*")
        .eq("owner", user.id)
        .single()

      if (!data) {
        setChecking(false)
        return
      }

      setShopId(data.id)

      // 🔥 check مباشر بدون انتظار realtime
      if (data) {
      setShop(data)      // 🔥 هذا السطر مهم
      setShopId(data.id)

      if (data.status !== "active") {
      await supabase.auth.signOut()
      window.location.href = "/blocked"
      return
     }
     }

      setChecking(false)
    }

    loadShop()
  }, [])

  // ✅ 2. REALTIME الحقيقي
  useEffect(() => {

    if (!shopId) return

    const channel = supabase
      .channel("shop-status")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shops",
        },
        async (payload: any) => {

          // 🔥 أهم سطر
          if (payload.new.id !== shopId) return

          // 🔥 block فوري لأي حالة
          if (payload.new.status !== "active") {
            await supabase.auth.signOut()
            window.location.href = `/blocked?status=${payload.new.status}`
            console.log("REALTIME:", payload)
          }
        }
        
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
      
    }

  }, [shopId])

  useEffect(()=>{
    setMounted(true)
    setLangState(getLang())
  },[])
 
  const changeLang = (l:"en"|"de")=>{
    setLang(l)
    setLangState(l)
    window.location.reload()
  }
 if (checking) {
  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      Loading...
    </div>
  )
  }
  if(!mounted) return null
  
  if (isPublic) {
  return children
}

  const isExpanded = !collapsed || hovered

  return(
    <ProtectedRoute>

      {/* 📱 MOBILE SIDEBAR */}
      <div
        className={`
          fixed inset-0 z-50 flex
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
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar collapsed={false} />
        </div>

      </div>

      {/* 💻 MAIN LAYOUT */}
      <div className="flex min-h-screen">

        {/* 🔥 DESKTOP SIDEBAR (NOTION STYLE) */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`
            hidden md:flex flex-col
            transition-all duration-300 ease-out
            ${isExpanded ? "w-[240px]" : "w-[70px]"}
            bg-slate-900/70 backdrop-blur-xl
            border-r border-white/5
          `}
        >

          {/* 🔥 COLLAPSE BUTTON */}
          <div className="p-2 flex justify-end">
            <button
              onClick={() => setCollapsed(prev => !prev)}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              {collapsed ? "⬅️" : "➡️"}
            </button>
          </div>

          <Sidebar collapsed={!isExpanded} />

        </div>

        {/* 📦 MAIN */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-x-hidden">

          <div className="w-full max-w-[1400px] mx-auto space-y-6">

            {/* 🔥 TOPBAR */}
            <div className="glass card flex justify-between items-center flex-wrap gap-3 px-4 py-3 relative z-10 isolate">

              {/* LEFT */}
              <div className="flex items-center gap-3">

                {/* ☰ MOBILE */}
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
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition"
                >
                  🔔
                <span className="absolute top-1 right-1  w-2 h-2 bg-red-500 rounded-full"/>
                </button>
                {open && (
                  <>
                   {/* BLUR BACKGROUND */}
                   <div onClick={()=>setOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-md z-[998]" />
                    {/* PANEL */}
                    <div className="fixed top-20 right-6 w-[320px] bg-[#020617]/95 backdrop-blur-xl border border-white/10
                    rounded-2xl p-5 shadow-[0_20px_80px_rgba(0,0,0,0.7)] z-[999] ">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-semibold text-white"> 
                       Notifications 
                      </p>
                    <button onClick={()=>setOpen(false)}>✕</button>
                    </div>
                    <p className="text-sm text-slate-400">
                      No notifications
                    </p>
                    </div>
                    </>
                    )}
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

                <UserMenu/>

              </div>

            </div>

            {/* CONTENT */}
            <div className="w-full min-w-0">
             <div className="glass card p-4 md:p-6 transition-all duration-300 w-full">
               {children}
              </div>
            </div>

          </div>

        </main>

      </div>

    </ProtectedRoute>
  )
}