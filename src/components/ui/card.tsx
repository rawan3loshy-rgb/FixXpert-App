"use client"

import { motion } from "framer-motion"

export default function Card({ children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="
        w-full min-w-0 flex flex-col   /* 🔥 الحل */
        bg-slate-900/60
        border border-white/10
        rounded-xl p-5
      "
    >
      {children}
    </motion.div>
  )
}