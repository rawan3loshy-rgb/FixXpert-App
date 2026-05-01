"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AdminPinModal({ onSuccess }: any) {

  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // ⌨️ keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        addDigit(e.key)
      }
      if (e.key === "Backspace") {
        removeDigit()
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [pin])

  // 🔢 add digit
  function addDigit(d: string) {
    if (pin.length >= 6) return
    setPin(prev => prev + d)
  }

  function removeDigit() {
    setPin(prev => prev.slice(0, -1))
  }

  // 🔥 auto submit
  useEffect(() => {
    if (pin.length === 6) verify()
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

      <div className="bg-slate-900 p-8 rounded-3xl text-center w-[320px]">

        <h2 className="text-xl font-bold mb-6">🔐 Admin Access</h2>

        {/* dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                pin[i] ? "bg-indigo-500" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {loading && <p className="text-slate-400 text-sm">Checking...</p>}

        {/* 🔢 keypad */}
        <div className="grid grid-cols-3 gap-3 mt-4">

          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button
              key={n}
              onClick={() => addDigit(n.toString())}
              className="h-14 rounded-xl bg-slate-800 hover:bg-indigo-600 text-lg font-semibold"
            >
              {n}
            </button>
          ))}

          <div />

          <button
            onClick={() => addDigit("0")}
            className="h-14 rounded-xl bg-slate-800 hover:bg-indigo-600 text-lg font-semibold"
          >
            0
          </button>

          <button
            onClick={removeDigit}
            className="h-14 rounded-xl bg-red-500 hover:bg-red-600 text-lg"
          >
            ⌫
          </button>

        </div>

      </div>
    </div>
  )
}