"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"

export function UserMenu() {

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [shopId, setShopId] = useState("")
  const [mounted, setMounted] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
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

  if (!mounted) return null

  return (
    <>
      {/* Avatar */}
      <div ref={ref} className="relative z-10">
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
      </div>

      {/* 🔥 PORTAL DROPDOWN */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]"
              />

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}

                className="
                  fixed top-20 right-4 left-4 md:left-auto md:w-72
                  z-[99999]
                  bg-slate-900/95 backdrop-blur-xl
                  border border-white/10
                  rounded-2xl p-5
                  shadow-[0_30px_80px_rgba(0,0,0,0.7)]
                "
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

                {/* Divider */}
                <div className="h-px bg-white/10 mb-4" />

                {/* Logout */}
                <button
                  onClick={logout}
                  className="
                    w-full py-2
                    bg-red-500 hover:bg-red-600
                    transition rounded-xl
                    text-sm font-semibold
                  "
                >
                  Logout
                </button>

              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}