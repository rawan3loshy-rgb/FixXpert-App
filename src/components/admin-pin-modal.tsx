"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AdminPinModal({ onSuccess }: any) {

  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const handleKey = (e: KeyboardEvent) => {

      if (e.key >= "0" && e.key <= "9") {
        setPin(prev => (prev + e.key).slice(0, 6))
      }

      if (e.key === "Backspace") {
        setPin(prev => prev.slice(0, -1))
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)

  }, [])

  useEffect(() => {
    if (pin.length === 6) {
      verify()
    }
  }, [pin])

  async function verify() {
    try {
      setLoading(true)
      setError("")

      const {
        data: { user }
      } = await supabase.auth.getUser()

      const res = await fetch("/api/admin/check-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pin,
          userId: user?.id
        })
      })

      if (res.status === 200) {
        onSuccess()
      } else {
        setError("Wrong PIN")
        setPin("")
      }

    } catch {
      setError("Error")
      setPin("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl">

      <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl text-center w-[320px]">

        <h2 className="text-xl font-semibold mb-6">🔐 Admin Access</h2>

        {/* dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition ${
                pin[i] ? "bg-indigo-500 scale-110" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {loading && <p className="text-sm text-slate-400">Checking...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <p className="text-xs text-slate-500 mt-4">
          Use keyboard to enter PIN
        </p>

      </div>
    </div>
  )
}