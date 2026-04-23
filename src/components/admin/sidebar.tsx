"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

const sections = [
  {
    title: "Core",
    items: [
      { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
      { name: "Repairs", path: "/admin/repairs", icon: "🛠" },
      { name: "Shops", path: "/admin/shops", icon: "🏪" },
    ]
  },
  {
    title: "Management",
    items: [
      { name: "Subscriptions", path: "/admin/subscriptions", icon: "💳" },
      { name: "Devices", path: "/admin/devices", icon: "📱" },
      { name: "Problems", path: "/admin/problems", icon: "⚠️" },
      { name: "Employees", path: "/admin/employees", icon: "👨‍💻" },
      { name: "Technicians", path: "/admin/technicians", icon: "👨‍🔧" },
      { name: "Phone Quality", path: "/admin/phone-quality", icon: "☎️" },
      { name: "Phone Types", path: "/admin/phone-types", icon: "📱" },
      { name: "Part Quality", path: "/admin/part-quality", icon: "🧩" },
      { name: "Part Types", path: "/admin/part-types", icon: "🔧" },
    ]
  },
  {
    title: "System",
    items: [
      { name: "Logs", path: "/admin/system/logs", icon: "📜" },
    ]
  }
]

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}: any) {

  const pathname = usePathname()
  const router = useRouter()

  // 🔥 ESC لإغلاق الموبايل
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  const SidebarContent = (
    <div className={`
      ${collapsed ? "w-20" : "w-64"}
      h-full
      transition-all duration-300
      bg-slate-900/80 backdrop-blur-xl
      border-r border-white/10
      flex flex-col
    `}>

      {/* HEADER */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <h2 className="text-lg font-bold tracking-wide">
            🚀 Admin
          </h2>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded transition"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* MENU */}
      <div className="flex-1 p-3 space-y-6 overflow-auto">

        {sections.map(section => (
          <div key={section.title}>

            {!collapsed && (
              <p className="text-xs text-slate-400 mb-2 px-2">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map(item => {

                const active = pathname === item.path

                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      router.push(item.path)
                      setMobileOpen(false) // 🔥 اغلاق بالموبايل
                    }}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all
                      ${active
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-slate-800/40 hover:bg-indigo-500/10 text-slate-300"
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && (
                      <span className="text-sm font-medium tracking-wide">
                        {item.name}
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </div>

          </div>
        ))}

      </div>

      {/* FOOTER */}
      <div className="p-3 text-xs text-slate-500 border-t border-white/10">
        {!collapsed && "Admin Panel v3.0"}
      </div>
    </div>
  )

  return (
    <>
      {/* 💻 DESKTOP */}
      <div className="hidden md:block">
        {SidebarContent}
      </div>

      {/* 📱 MOBILE */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 left-0 h-full z-50"
            >
              {SidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}