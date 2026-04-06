"use client"
import UltimateEffects from "@/components/ui/ultimate-effects"
import { motion } from "framer-motion"
import {
  Boxes,
  Activity,
  Package,
  BarChart3,
  Sparkles
} from "lucide-react"

export default function AuthLayout({ children }: any) {

  const features = [
    { text: "Organisiere deinen gesamten Workflow", icon: Boxes },
    { text: "Verfolge Reparaturen in Echtzeit", icon: Activity },
    { text: "Intelligente Lagerverwaltung", icon: Package },
    { text: "Analysiere Gewinne und Einnahmen", icon: BarChart3 },
    { text: "Maximale Effizienz für dich & Kunden", icon: Sparkles },
  ]

  return (
    
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden">
      <UltimateEffects />
      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900" />

      {/* 🔥 ANIMATED GLOW */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[160px] -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 flex min-h-screen">

        {/* ================= LEFT SIDE ================= */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-12">

          <div className="max-w-xl">

            {/* TITLE */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-extrabold mb-6 tracking-tight"
            >
              ⚡️ FixXpert App
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 mb-12 text-lg"
            >
              Intelligentes Reparaturmanagementsystem für maximale Geschwindigkeit, Kontrolle und Übersicht.
            </motion.p>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-2 gap-5">

              {features.map((f, i) => {
                const Icon = f.icon

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{
                      scale: 1.08,
                      boxShadow: "0 0 40px rgba(99,102,241,0.4)"
                    }}
                    className="
                      p-6 rounded-2xl
                      bg-white/5 border border-white/10
                      backdrop-blur-xl
                      transition cursor-pointer
                    "
                  >

                    <Icon className="text-indigo-400 mb-3" size={22} />

                    <p className="text-sm font-semibold leading-relaxed">
                      {f.text}
                    </p>

                  </motion.div>
                )
              })}

            </div>

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex flex-1 items-center justify-center p-6">

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="
              w-full max-w-md
              bg-white/5
              backdrop-blur-2xl
              border border-white/10
              rounded-3xl
              p-8
              shadow-[0_0_80px_rgba(99,102,241,0.25)]
            "
          >
            {children}
          </motion.div>
          
        </div>

      </div>

    </div>
  )
}