"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Boxes,
  Activity,
  Package,
  BarChart3,
  Sparkles,
  ChevronDown
} from "lucide-react"

export default function HomePage() {

  const [lang, setLang] = useState<"de" | "en">("de")
  const [open, setOpen] = useState<string | null>(null)

  const t = (de: string, en: string) => (lang === "de" ? de : en)

  const features = [
    {
      icon: Boxes,
      title: t("Workflow organisieren", "Organize workflow"),
      desc: t("Strukturiere alle Reparaturen effizient.", "Structure all repairs efficiently.")
    },
    {
      icon: Activity,
      title: t("Live Tracking", "Live tracking"),
      desc: t("Verfolge Geräte in Echtzeit.", "Track devices in real time.")
    },
    {
      icon: Package,
      title: t("Lagerverwaltung", "Stock management"),
      desc: t("Verwalte Ersatzteile einfach.", "Manage inventory easily.")
    },
    {
      icon: BarChart3,
      title: t("Gewinne analysieren", "Analytics"),
      desc: t("Überblicke Einnahmen & Daten.", "Analyze revenue and data.")
    },
    {
      icon: Sparkles,
      title: t("Effizienz steigern", "Boost efficiency"),
      desc: t("Optimiere deinen Workflow.", "Optimize your workflow.")
    }
  ]

  return (
    <div className="bg-[#020617] text-white min-h-screen overflow-hidden">

      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">

        <h1 className="text-2xl font-bold text-indigo-400">
          ⚡️ FixXpert
        </h1>

        {/* NAV */}
        <nav className="hidden md:flex gap-6 text-sm">

          {[
            { name: "Support" },
            { name: "Pricing" },
            { name: "Über uns" },
            { name: "Terms" }
          ].map((item) => (

            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setOpen(item.name)}
              onMouseLeave={() => setOpen(null)}
            >

              <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-400">
                {item.name}
                <ChevronDown size={14} />
              </div>

              {/* DROPDOWN */}
              {open === item.name && (
                <div className="absolute top-6 left-0 bg-slate-900 border border-white/10 rounded-xl p-3 w-40 shadow-xl">
                  <p className="text-sm text-slate-400">
                    {t("Mehr Infos", "More info")}
                  </p>
                </div>
              )}

            </div>

          ))}

        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          <button
            onClick={()=>setLang(lang === "de" ? "en" : "de")}
            className="px-3 py-1 bg-slate-800 rounded-lg text-sm"
          >
            {lang.toUpperCase()}
          </button>

          <Link href="/login">
            <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700">
              Login
            </button>
          </Link>

          <Link href="/signup">
            <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700">
              Sign up
            </button>
          </Link>

        </div>

      </header>

      {/* ================= HERO ================= */}
      <section className="text-center py-28 px-6 relative">

        <div className="absolute w-[700px] h-[700px] bg-indigo-600/20 blur-[140px] top-0 left-1/2 -translate-x-1/2" />

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-extrabold mb-6"
        >
          {t("Das Reparatursystem der Zukunft", "The future of repair systems")}
        </motion.h2>

        <p className="text-slate-400 max-w-xl mx-auto mb-10">
          {t(
            "Verwalte dein Geschäft smarter, schneller und effizienter.",
            "Run your repair business smarter, faster and more efficiently."
          )}
        </p>

        <div className="flex justify-center gap-4">

          <Link href="/signup">
            <button className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700">
              {t("Jetzt starten", "Get started")}
            </button>
          </Link>

          <Link href="/login">
            <button className="px-6 py-3 bg-slate-800 rounded-xl hover:bg-slate-700">
              Login
            </button>
          </Link>

        </div>

      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-10 pb-28">

        <div className="grid md:grid-cols-3 gap-6">

          {features.map((f, i) => {
            const Icon = f.icon

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                <Icon className="text-indigo-400 mb-3" size={24} />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </motion.div>
            )
          })}

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="text-center py-24 border-t border-white/10">

        <h2 className="text-4xl font-bold mb-6">
          {t("Starte jetzt dein System", "Start your system now")}
        </h2>

        <Link href="/signup">
          <button className="px-8 py-4 bg-indigo-600 rounded-xl hover:bg-indigo-700">
            {t("Kostenlos starten", "Start free")}
          </button>
        </Link>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 p-10 text-sm text-slate-400">

        <div className="grid md:grid-cols-4 gap-6">

          <div>
            <h4 className="text-white mb-2">⚡️ FixXpert</h4>
            <p>
              {t("Professionelle Reparaturverwaltung.", "Professional repair system.")}
            </p>
          </div>

          <div>
            <h4 className="text-white mb-2">Support</h4>
            <p>Email</p>
            <p>Help Center</p>
          </div>

          <div>
            <h4 className="text-white mb-2">Legal</h4>
            <p>Terms</p>
            <p>Privacy</p>
          </div>

          <div>
            <h4 className="text-white mb-2">Company</h4>
            <p>About</p>
            <p>Pricing</p>
          </div>

        </div>

      </footer>

    </div>
  )
}