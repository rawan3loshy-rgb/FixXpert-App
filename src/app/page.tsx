"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Boxes,
  Activity,
  Package,
  BarChart3,
  Sparkles
} from "lucide-react"

export default function HomePage() {

  const [lang, setLang] = useState<"de" | "en">("de")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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

  const previews = [
    {
      src: "/dashboard.png",
      title: t("Dashboard", "Dashboard"),
      desc: t(
        "Alle wichtigen Informationen deines Shops auf einen Blick.",
        "All important shop data at a glance."
      )
    },
    {
      src: "/tracking.png",
      title: t("Live Tracking", "Live Tracking"),
      desc: t(
        "Kunden verfolgen Reparaturen live über QR-Code.",
        "Customers track repairs live via QR code."
      )
    },
    {
      src: "/repair.png",
      title: t("Neue Reparatur", "New Repair"),
      desc: t(
        "Erstelle Reparaturen schnell mit vordefinierten Daten.",
        "Create repairs fast with predefined data."
      )
    }
  ]

  return (
    <div className="bg-[#020617] text-white min-h-screen overflow-visible">

      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">

        <Link href="/">
          <h1 className="text-2xl font-bold text-indigo-400 cursor-pointer">
            ⚡️ FixXpert App
          </h1>
        </Link>

        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/support" className="hover:text-indigo-400">{t("Support","Support")}</Link>
          <Link href="/pricing" className="hover:text-indigo-400">{t("Preise","Pricing")}</Link>
          <Link href="/about" className="hover:text-indigo-400">{t("Über uns","About")}</Link>
          <Link href="/terms" className="hover:text-indigo-400">AGB</Link>
          <Link href="/privacy" className="hover:text-indigo-400">{t("Datenschutz","Privacy")}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={()=>setLang(lang === "de" ? "en" : "de")}
            className="px-3 py-1 bg-slate-800 rounded-lg text-sm"
          >
            {lang.toUpperCase()}
          </button>

          <Link href="/login" className="px-4 py-2 bg-slate-800 rounded-lg">
            {t("Anmelden","Login")}
          </Link>

          <Link href="/signup" className="px-4 py-2 bg-indigo-600 rounded-lg">
            {t("Registrieren","Sign up")}
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="text-center py-28 px-6 relative">

        <div className="absolute w-[700px] h-[700px] bg-indigo-600/20 blur-[140px] top-0 left-1/2 -translate-x-1/2 pointer-events-none" />

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          {t("Das Reparatursystem der Zukunft","The future of repair systems")}
        </motion.h2>

        <p className="text-slate-400 mb-10">
          {t(
            "Verwalte dein Geschäft smarter, schneller und effizienter.",
            "Run your business smarter and faster."
          )}
        </p>

        <div className="flex justify-center gap-4 relative z-10">
          <Link href="/login" className="px-6 py-3 bg-slate-800 rounded-xl">
            {t("Anmelden","Login")}
          </Link>

          <Link href="/signup" className="px-6 py-3 bg-indigo-600 rounded-xl">
            {t("Registrieren", "Sign up")}
          </Link>

          
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-10 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div key={i} whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <Icon className="text-indigo-400 mb-3" size={24}/>
                <h3>{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ================= IMAGE SECTION PRO ================= */}
      <section className="px-10 pb-28">

        <h2 className="text-3xl font-bold mb-10 text-center">
          {t("Ein Blick ins System","Take a look inside")}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {previews.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(item.src)}
            >
              <img
                src={item.src}
                className="w-full h-[200px] object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

      </section>

      {/* ================= MODAL ================= */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            src={selectedImage}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-[90%] max-h-[90%] rounded-xl"
          />
        </div>
      )}

      {/* ================= CTA ================= */}
      <section className="text-center py-24 border-t border-white/10">
        <h2 className="text-4xl mb-6">
          {t("Starte jetzt dein System","Start your system now")}
        </h2>

        <Link href="/signup" className="px-8 py-4 bg-indigo-600 rounded-xl">
          {t("Kostenlos starten","Start free")}
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 p-10 text-sm text-slate-400">

        <div className="grid md:grid-cols-4 gap-6">

          <div>
            <h4 className="text-white">⚡️ FixXpert App</h4>
            <p>{t("Professionelle Reparaturverwaltung.","Professional system.")}</p>
          </div>

          <div>
            <h4 className="text-white">{t("Support","Support")}</h4>
            <Link href="/support">{t("Kontakt","Contact")}</Link>
          </div>

          <div>
            <h4 className="text-white">{t("Rechtliches","Legal")}</h4>
            <Link href="/terms">AGB</Link>
            <Link href="/privacy">{t("Datenschutz","Privacy")}</Link>
          </div>

          <div>
            <h4 className="text-white">{t("Unternehmen","Company")}</h4>
            <Link href="/about">{t("Über uns","About")}</Link>
            <Link href="/pricing">{t("Preise","Pricing")}</Link>
          </div>

        </div>

      </footer>

    </div>
  )
}