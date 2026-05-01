"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AdminPinModal({ onSuccess }: any) {

  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleChange = (e: any) => {
    const value = e.target.value.replace(/\D/g, "")
    setPin(value)

    if (value.length === 6) {
      submit(value)
    }
  }

  const submit = async (value: string) => {
    try {
      setLoading(true)
      setError("")

      const { data: { user } } = await supabase.auth.getUser()

      const res = await fetch("/api/admin/check-pin", {
        method: "POST",
        body: JSON.stringify({
          pin: value,
          userId: user?.id
        })
      })

      if (res.status === 200) {
        onSuccess()
      } else if (res.status === 403) {
        setError("🔒 Locked for 5 minutes")
      } else {
        setError("❌ Wrong PIN")
        setPin("")
      }

    } catch {
      setError("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50">
       <div
       onClick={() => inputRef.current?.focus()}
       className="bg-slate-900 p-10 rounded-3xl shadow-2xl w-[340px] text-center border border-white/10">

        <h2 className="text-xl font-semibold mb-6">
          🔐 Admin Access
        </h2>

        {/* PIN DOTS */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`
                w-4 h-4 rounded-full
                ${i < pin.length ? "bg-indigo-500" : "bg-white/20"}
              `}
            />
          ))}
        </div>

        {/* HIDDEN INPUT */}
        <input
         ref={inputRef}
         value={pin}
          onChange={handleChange}
          type="tel"
         inputMode="numeric"
         maxLength={6}
         autoFocus
          className="w-0 h-0 opacity-0 absolute"
         />

        <p className="text-sm text-slate-400 mb-4">
          Enter your 6-digit PIN
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        {loading && (
          <p className="text-indigo-400 text-sm">Checking...</p>
        )}

      </div>
    </div>
  )
}