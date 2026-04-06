"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [shopId, setShopId] = useState("")
  const ref = useRef<HTMLDivElement>(null)

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
    <div ref={ref} className="relative z-50">

      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 transition flex items-center justify-center cursor-pointer font-bold"
      >
        {avatarLetter}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              absolute right-0 mt-3 w-72
              bg-slate-900/95 backdrop-blur-xl
              border border-white/10
              rounded-xl p-5
              shadow-2xl
            "
          >

            {/* EMAIL */}
            <p className="text-xs text-slate-400">Email</p>
            <p className="text-sm mb-4 break-all">{email}</p>

            {/* SHOP */}
            <p className="text-xs text-slate-400">Shop ID</p>
            <p className="text-xs text-slate-300 mb-4 break-all">
              {shopId}
            </p>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="w-full py-2 bg-red-500 hover:bg-red-600 transition rounded-lg text-sm font-semibold"
            >
              Logout
            </button>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}