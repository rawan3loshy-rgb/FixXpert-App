"use client"

import { ReactNode, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

// 👉 هذا UI تبعك
import AppLayout from "@/components/layout/app-layout"

export default function Layout({ children }: { children: ReactNode }) {

  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAccess()
  }, [])

  async function checkAccess() {

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { data: shop } = await supabase
      .from("shops")
      .select("status")
      .eq("owner", user.id)
      .single()

    // 🚫 disabled
    if (shop?.status === "disabled") {
      window.location.href = "/blocked"
      return
    }

    // ⏳ pending
    if (shop?.status === "pending") {
      window.location.href = "/pending"
      return
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  // 🔥 لف UI تبعك
  return <AppLayout>{children}</AppLayout>
}