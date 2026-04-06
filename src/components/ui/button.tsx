"use client"

import { motion } from "framer-motion"

export default function Button({ children, ...props }: any) {
  return (
    <motion.button
      {...props}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold"
    >
      {children}
    </motion.button>
  )
}