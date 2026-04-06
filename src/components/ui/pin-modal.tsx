"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { createPortal } from "react-dom"
import { t } from "@/lib/text"

export default function PinModal({ correctPin, onClose, onSuccess }: any) {

  const [pin, setPin] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [mounted, setMounted] = useState(false)

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const lockTimer = useRef<any>(null)

  // 🔥 fix hydration (مهم جداً مع portal)
  useEffect(() => {
    setMounted(true)
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const interval = setInterval(() => {
      setCooldown((c) => c - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [cooldown])

  const pinValue = pin.join("")

  const handleChange = (value: string, index: number) => {
    if (locked) return
    if (!/^[0-9]?$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }

    if (index === 5 && value) {
      setTimeout(handleSubmit, 100)
    }
  }

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const handlePaste = (e: any) => {
    if (locked) return
    const paste = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(paste)) return

    const newPin = paste.split("")
    while (newPin.length < 6) newPin.push("")
    setPin(newPin)

    setTimeout(handleSubmit, 150)
  }

  const handleSubmit = () => {
    if (locked) return
    if (pinValue.length < 6) return

    if (pinValue === correctPin) {
      setError("")
      onSuccess()
      return
    }

    setError(t("wrongPin"))

    const el = document.getElementById("pin-box")
    el?.classList.add("animate-shake")
    setTimeout(() => el?.classList.remove("animate-shake"), 400)

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (newAttempts >= 3) {
      setLocked(true)
      setCooldown(10)

      lockTimer.current = setTimeout(() => {
        setLocked(false)
        setAttempts(0)
        setPin(["", "", "", "", "", ""])
        inputsRef.current[0]?.focus()
      }, 10000)
    }

    setPin(["", "", "", "", "", ""])
    inputsRef.current[0]?.focus()
  }

  // ❗ مهم جداً
  if (!mounted) return null

  return createPortal(

    <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-10 md:pt-20 bg-black/80 backdrop-blur-md">

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        id="pin-box"
        className="bg-slate-900 p-6 rounded-2xl w-80 border border-white/10 shadow-2xl"
      >

        {/* TITLE */}
        <h2 className="text-lg font-bold mb-6 text-center">
          {t("enterPin")}
        </h2>

        {/* LOCK */}
        {locked && (
          <p className="text-red-400 text-center mb-4">
            {t("tooManyAttempts")} ({cooldown}s)
          </p>
        )}

        {/* PIN INPUT */}
        <div className="flex justify-between gap-2 mb-4" onPaste={handlePaste}>
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {inputsRef.current[i] = el}}
              type="password"
              maxLength={1}
              value={digit}
              disabled={locked}
              onChange={(e)=>handleChange(e.target.value, i)}
              onKeyDown={(e)=>handleKeyDown(e, i)}
              className="w-10 h-12 text-center text-lg rounded-lg bg-slate-800 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
            />
          ))}
        </div>

        {/* ERROR */}
        {error && !locked && (
          <p className="text-red-400 text-sm text-center mb-3">
            {error}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 bg-slate-700 rounded-xl hover:bg-slate-600"
          >
            {t("cancel")}
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 px-3 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-500"
          >
            {t("confirm")}
          </button>
        </div>

      </motion.div>

      {/* SHAKE ANIMATION */}
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.3s;
        }
      `}</style>

    </div>,

    document.body
  )
}