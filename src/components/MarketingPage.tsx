"use client"

import { motion } from "framer-motion"

export default function MarketingPage({
  title,
  subtitle,
  children
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {

  return (
    <div className="bg-[#020617] text-white min-h-screen">

      {/* HERO */}
      <section className="text-center py-28 px-6 relative">

        <div className="absolute w-[700px] h-[700px] bg-indigo-600/20 blur-[140px] top-0 left-1/2 -translate-x-1/2 pointer-events-none" />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold mb-6"
        >
          {title}
        </motion.h1>

        <p className="text-slate-400 max-w-xl mx-auto">
          {subtitle}
        </p>

      </section>

      {/* CONTENT */}
      <section className="px-10 pb-28">
        {children}
      </section>

    </div>
  )
}