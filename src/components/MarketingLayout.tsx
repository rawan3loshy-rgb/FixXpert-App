"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function MarketingLayout({
  title,
  subtitle,
  children
}: any) {

  return (
    <div className="bg-[#020617] text-white min-h-screen">

      {/* HERO */}
      <section className="text-center py-28 px-6 relative">

        {/* Glow */}
        <div className="absolute w-[800px] h-[800px] bg-indigo-600/20 blur-[160px] top-0 left-1/2 -translate-x-1/2 pointer-events-none" />

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
      <section className="px-10 pb-28 max-w-6xl mx-auto">
        {children}
      </section>

      {/* CTA */}
      <section className="text-center pb-24">
        <Link href="/signup">
          <button className="px-8 py-4 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition">
            Get Started
          </button>
        </Link>
      </section>

    </div>
  )
}