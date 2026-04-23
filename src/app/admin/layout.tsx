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

  if(loading){
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        Loading admin...
      </div>
    )
  }

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
       <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
      <div className="fixed inset-0 z-50 flex">
    
        <div className="w-64 bg-slate-900">
         <Sidebar collapsed={false} setCollapsed={()=>{}} />
        </div>

        {/* overlay */}
       <div
         className="flex-1 bg-black/50"
         onClick={() => setMobileOpen(false)}
          />
        </div>
       )}

      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="h-[70px] flex items-center justify-between px-4 md:px-6 border-b border-white/10 bg-slate-900/40">

          <div className="flex items-center gap-3">

          {/* زر الموبايل */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-xl"
           >
            ☰
          </button>

          <h1 className="font-semibold text-lg">
           Admin Control Center
           </h1>

          </div>
          

          <button
            onClick={async ()=>{
              await supabase.auth.signOut()
              router.push("/login")
            }}
            className="text-red-400"
          >
            Logout
          </button>

        </div>

        {/* CONTENT */}
        <div className="p-4 md:p-8 overflow-auto max-w-[1400px] mx-auto w-full">
          {children}
        </div>

      </div>

    </div>
  )
}