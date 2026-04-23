"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Sidebar from "@/components/admin/sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push("/login")
      return
    }

    const user = session.user

    const { data: shop } = await supabase
      .from("shops")
      .select("is_admin")
      .eq("owner", user.id)
      .single()

    if (!shop?.is_admin) {
      router.push("/dashboard")
      return
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        Loading admin...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

      {/* ✅ Sidebar (ذكي: Desktop + Mobile) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* 🔝 TOP BAR */}
        <div className="h-[60px] md:h-[70px] flex items-center justify-between px-4 md:px-6 border-b border-white/10 bg-slate-900/60 backdrop-blur">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* 📱 زر الموبايل */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-xl px-2 py-1 rounded hover:bg-white/10 transition"
            >
              ☰
            </button>

            <h1 className="font-semibold text-base md:text-lg tracking-wide">
              Admin Control Center
            </h1>

          </div>

          {/* RIGHT */}
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/login")
            }}
            className="text-red-400 hover:text-red-300 transition text-sm md:text-base"
          >
            Logout
          </button>

        </div>

        {/* 📦 CONTENT */}
        <div className="flex-1 overflow-auto">

          <div className="
            p-4 md:p-8
            max-w-[1400px]
            mx-auto
            w-full
          ">
            {children}
          </div>

        </div>

      </div>

    </div>
  )
}