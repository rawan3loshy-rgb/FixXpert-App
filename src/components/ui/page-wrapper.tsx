"use client"

import { motion } from "framer-motion"

export default function PageWrapper({ children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-w-0 flex flex-col" // 🔥 هذا هو الحل
    >
      {children}
    </motion.div>
  )
}