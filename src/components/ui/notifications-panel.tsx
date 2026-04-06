"use client"

import { useToast } from "./toast-provider"
import { motion, AnimatePresence } from "framer-motion"

export default function NotificationsPanel({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {

  const { notifications, clearNotifications } = useToast()

  return (
    <AnimatePresence>

      {open && (
        <>
          {/* 🔥 BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* 🔥 DRAWER */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ duration: 0.3 }}
            className="
              absolute right-0 mt-3 w-80
  bg-slate-900/95 backdrop-blur-xl
  border border-white/10
  rounded-xl p-4
  shadow-2xl z-50
            "
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">

              <h2 className="font-semibold text-lg">
                Notifications
              </h2>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto space-y-2">

              {notifications.length === 0 && (
                <p className="text-sm text-slate-400">
                  No notifications
                </p>
              )}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2 border-b border-white/10 text-sm"
                >
                  {n.message}
                </div>
              ))}

            </div>

            {/* FOOTER */}
            <button
              onClick={clearNotifications}
              className="
                mt-4 w-full py-2 rounded-xl
                bg-slate-800 hover:bg-slate-700
                text-sm
              "
            >
              Clear All
            </button>

          </motion.div>
        </>
      )}

    </AnimatePresence>
  )
}