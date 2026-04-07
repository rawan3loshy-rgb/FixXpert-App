"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

export function UserMenu() {

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [shopId, setShopId] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  // 🔥 detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    loadUser()
  }, [])

  // 🔥 close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      setEmail(user.email || "")

      const { data } = await supabase
        .from("shops")
        .select("id")
        .eq("owner", user.id)
        .single()

      if (data) setShopId(data.id)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const avatarLetter = email ? email[0].toUpperCase() : "👤"

  return (
    <div ref={ref} className="relative z-[99999]">

      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        className="
          w-10 h-10 rounded-full
          bg-indigo-600 hover:bg-indigo-500
          transition flex items-center justify-center
          cursor-pointer font-bold
          shadow-lg
        "
      >
        {avatarLetter}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}

            className={`
              ${isMobile 
                ? "fixed top-20 right-4 left-4"
                : "absolute right-0 mt-3 w-72"
              }

              z-[9999]
              bg-slate-900/95 backdrop-blur-xl
              border border-white/10
              rounded-2xl p-5
              shadow-[0_20px_60px_rgba(0,0,0,0.6)]
            `}
          >

            {/* EMAIL */}
            <p className="text-xs text-slate-400 mb-1">Email</p>
            <p className="text-sm mb-4 break-all text-white">
              {email}
            </p>

            {/* SHOP */}
            <p className="text-xs text-slate-400 mb-1">Shop ID</p>
            <p className="text-xs text-slate-300 mb-4 break-all">
              {shopId}
            </p>

            {/* DIVIDER */}
            <div className="h-px bg-white/10 mb-4" />

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="
                w-full py-2
                bg-red-500 hover:bg-red-600
                transition rounded-xl
                text-sm font-semibold
                shadow-md
              "
            >
              Logout
            </button>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}