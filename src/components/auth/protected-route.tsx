"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

export default function ProtectedRoute({ children }: any) {

  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
   // 🔥 allow public routes
  if (
    pathname.startsWith("/track") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup")
  )

  useEffect(() => {

    const check = async () => {

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/login")
        return
      }

      setLoading(false)
    }

    check()

  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400">
        Loading...
      </div>
    )
  }

  return children
}