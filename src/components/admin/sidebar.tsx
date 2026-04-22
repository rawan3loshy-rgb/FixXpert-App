"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"

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
      { name: "Phone Types", path: "/admin/phone-types", icon: "☎️" },
      { name: "Part Quality", path: "/admin/part-quality", icon: "🛠️" },
      { name: "Part Types", path: "/admin/part-types", icon: "🛠️" },
    ]
  },
  {
    title: "System",
    items: [
      { name: "Database", path: "/admin/system/database", icon: "🧠" },
      { name: "Logs", path: "/admin/system/logs", icon: "📜" },
    ]
  }
]

export default function Sidebar({ collapsed, setCollapsed }: any) {

  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className={`
      ${collapsed ? "w-20" : "w-64"}
      transition-all duration-300
      bg-slate-900/70 backdrop-blur-xl
      border-r border-white/10
      flex flex-col
    `}>

      {/* HEADER */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">

        {!collapsed && (
          <h2 className="text-lg font-bold">🚀 Admin</h2>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs bg-slate-800 px-2 py-1 rounded"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* MENU */}
      <div className="flex-1 p-3 space-y-6 overflow-auto">

        {sections.map(section => (
          <div key={section.title}>

            {!collapsed && (
              <p className="text-xs text-slate-400 mb-2">
                {section.title}
              </p>
            )}

            <div className="space-y-2">
              {section.items.map(item => {

                const active = pathname === item.path

                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => router.push(item.path)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition
                      ${active
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800/50 hover:bg-indigo-600/60 text-slate-300"
                      }
                    `}
                  >
                    <span>{item.icon}</span>
                    {!collapsed && <span>{item.name}</span>}
                  </motion.div>
                )
              })}
            </div>

          </div>
        ))}

      </div>

      {/* FOOTER */}
      <div className="p-3 text-xs text-slate-500 border-t border-white/10">
        {!collapsed && "Admin Panel v2.0"}
      </div>

    </div>
  )
}