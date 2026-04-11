"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { usePathname, useRouter } from "next/navigation"

export default function ProtectedRoute({ children }: any) {

  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {

    const check = async () => {

      // =========================
      // ✅ PUBLIC ROUTES
      // =========================
      if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/verify") ||
        pathname.startsWith("/track")
      ) {
        setLoading(false)
        return
      }

      // =========================
      // 🔐 CHECK SESSION
      // =========================
      const { data: { session } } = await supabase.auth.getSession()

      const otpVerified = localStorage.getItem("otp_verified")

      // =========================
      // 🔥 FULL PATH (IMPORTANT)
      // =========================
      const fullPath =
        window.location.pathname + window.location.search

      // =========================
      // ❌ NOT AUTHORIZED
      // =========================
      if (!session || otpVerified !== "true") {
        router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`)
        return
      }

      // =========================
      // ✅ OK
      // =========================
      setLoading(false)
    }

    check()

  }, [pathname])

  // =========================
  // ⏳ LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400">
        Loading...
      </div>
    )
  }

  return children
}