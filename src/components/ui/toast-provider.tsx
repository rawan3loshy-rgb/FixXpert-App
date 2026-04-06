"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react"

import { motion, AnimatePresence } from "framer-motion"

type Notification = {
  id: string
  message: string
  type: "success" | "error" | "info"
  createdAt: Date
}

type ContextType = {
  showToast: (message: string, type?: Notification["type"]) => void
  addNotificationUnique: (key: string, message: string) => void
  notifications: Notification[]
  clearNotifications: () => void
}

const ToastContext = createContext<ContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {

  // 🔥 FIX HYDRATION
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 🔥 popup toast
  const [toasts, setToasts] = useState<Notification[]>([])

  // 🔥 notification panel
  const [notifications, setNotifications] = useState<Notification[]>([])

  // =========================
  // 🔥 UNIQUE NOTIFICATION
  // =========================
  const addNotificationUnique = (key: string, message: string) => {
    setNotifications(prev => {

      const exists = prev.some(n => n.message === message)
      if (exists) return prev

      return [
        {
          id: crypto.randomUUID(),
          message,
          type: "info",
          createdAt: new Date()
        },
        ...prev
      ]
    })
  }

  // =========================
  // 🔥 TOAST
  // =========================
  const showToast = (
    message: string,
    type: Notification["type"] = "info"
  ) => {

    const id = crypto.randomUUID()

    const newItem: Notification = {
      id,
      message,
      type,
      createdAt: new Date()
    }

    // popup
    setToasts(prev => [...prev, newItem])

    // notification (no duplicates)
    setNotifications(prev => {
      const exists = prev.some(n => n.message === message)
      if (exists) return prev
      return [newItem, ...prev]
    })

    // auto remove
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <ToastContext.Provider
      value={{
        showToast,
        addNotificationUnique,
        notifications,
        clearNotifications
      }}
    >

      {children}

      {/* ❌ FIX: لا ترندر قبل mount */}
      {mounted && (
        <div className="fixed top-6 right-6 space-y-3 z-50">

          <AnimatePresence>
            {toasts.map((toast) => (

              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`
                  px-4 py-3 rounded-xl text-sm font-semibold shadow-lg
                  border border-white/10 backdrop-blur-xl
                  ${
                    toast.type === "success"
                      ? "bg-green-500/20 text-green-400"
                      : toast.type === "error"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-slate-800 text-white"
                  }
                `}
              >
                {toast.message}
              </motion.div>

            ))}
          </AnimatePresence>

        </div>
      )}

    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside ToastProvider")
  return ctx
}