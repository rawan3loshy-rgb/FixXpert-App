"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AdminPinModal({ onSuccess }: any) {

  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // 🔥 focus تلقائي
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }, [])

  // 🔥 auto submit
  useEffect(() => {
    if (pin.length === 6) verify()
  }, [pin])

  async function verify() {
    try {
      setLoading(true)
      setError("")

      const { data: { user } } = await supabase.auth.getUser()

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
        inputRef.current?.focus()
      }

    } catch {
      setError("Error")
      setPin("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* 🔥 BLUR */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />

      {/* 🔒 CARD */}
      <div className="relative z-10 w-[320px] p-8 rounded-3xl
        bg-white/5 backdrop-blur-xl border border-white/10
        shadow-[0_20px_80px_rgba(0,0,0,0.6)] text-center">

        <h2 className="text-xl font-semibold text-white mb-6">
          🔐 Admin Access
        </h2>

        {/* ✅ INPUT (المهم جداً) */}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          value={pin}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "")
            if (val.length <= 6) setPin(val)
          }}
          className="absolute opacity-0"
        />

        {/* 🔵 DOTS */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex justify-center gap-3 mb-4 cursor-text"
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                pin[i] ? "bg-white scale-110" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-white/60">
          Enter your 6-digit PIN
        </p>

        {loading && (
          <p className="text-xs text-blue-400 mt-2">
            Checking...
          </p>
        )}

        {error && (
          <p className="text-xs text-red-400 mt-2">
            {error}
          </p>
        )}

      </div>
    </div>
  )
}