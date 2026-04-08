"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import PageWrapper from "@/components/ui/page-wrapper"
import Card from "@/components/ui/card"
import PinModal from "@/components/ui/pin-modal"
import { motion } from "framer-motion"
import { t, getLang, setLang } from "@/lib/text"

import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

export default function ProfitPage(){

  const router = useRouter()
  const lang = getLang()

  const [repairs,setRepairs] = useState<any[]>([])
  const [filtered,setFiltered] = useState<any[]>([])
  const [loading,setLoading] = useState(true)

  const [shop,setShop] = useState<any>(null)

  const [unlocked,setUnlocked] = useState(false)
  const lockTimer = useRef<any>(null)

  const [stats,setStats] = useState({
    fixed:0,
    notFixed:0,
    profit:0,
    warranty:0,
    avg:0,
    successRate:0
  })

  const [range,setRange] = useState("today")
  const [selectedMonth,setSelectedMonth] = useState(new Date().getMonth())
  const [mounted,setMounted] = useState(false)

  // =========================
  // INIT
  // =========================
  useEffect(()=>{
    setMounted(true)
    load()
  },[])

  // =========================
  // 🔥 REALTIME (SECURE)
  // =========================
  useEffect(()=>{

    if(!shop?.id) return

    const channel = supabase
      .channel("repairs-live")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "repairs",
          filter: `shop_id=eq.${shop.id}` // 🔥 مهم جداً
        },
        () => {
          load()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  },[shop?.id])

  useEffect(()=>{
    if(mounted){
      applyFilter()
    }
  },[range,repairs,mounted,selectedMonth])

  // =========================
  // LOAD
  // =========================
  const load = async ()=>{

    const { data: { session } } = await supabase.auth.getSession()

    if(!session){
      setLoading(false)
      return
    }

    // 🔥 جيب المحل تبع اليوزر
    const { data: shopData } = await supabase
      .from("shops")
      .select("*")
      .eq("shop_id", session.user.id)
      .maybeSingle()

    if(!shopData){
      setLoading(false)
      return
    }

    setShop(shopData)

    // 🔥 أهم سطر (فلترة حسب المحل)
    const { data } = await supabase
      .from("repairs")
      .select("*")
      .eq("shop_id", shopData.id)
      .order("created_at",{ascending:false})

    setRepairs(data || [])
    setLoading(false)
  }

  // =========================
  // FILTER + STATS
  // =========================
  const applyFilter = ()=>{

    let result = repairs
    const now = new Date()

    if(range === "today"){
      result = repairs.filter(r =>
        new Date(r.created_at).toDateString() === now.toDateString()
      )
    }

    if(range === "week"){
      const weekAgo = new Date()
      weekAgo.setDate(now.getDate()-7)
      result = repairs.filter(r =>
        new Date(r.created_at) >= weekAgo
      )
    }

    if(range === "month"){
      result = repairs.filter(r =>
        new Date(r.created_at).getMonth() === selectedMonth
      )
    }

    setFiltered(result)

    let fixed = 0
    let notFixed = 0
    let profit = 0

    for(const r of result){

      // 🔥 فقط إذا repariert
      if(r.fix_status === "fixed"){
        fixed++
        profit += Number(r.price||0) - Number(r.cost||0)
      }

      if(r.fix_status === "not-fixed"){
        notFixed++
      }
    }

    const avg = fixed ? Math.round(profit / fixed) : 0
    const successRate = result.length ? Math.round((fixed / result.length) * 100) : 0

    setStats({fixed,notFixed,profit,warranty:0,avg,successRate})
  }

  // =========================
  // ACTIONS
  // =========================
  const unlock = ()=>{
    setUnlocked(true)
    if(lockTimer.current) clearTimeout(lockTimer.current)
    lockTimer.current = setTimeout(()=>setUnlocked(false),3000000)
  }

  const exportPDF = ()=>{
    window.print()
  }

  if(!mounted) return null

  if(loading){
    return <p className="p-10 text-white">{t("loading")}</p>
  }

  // =========================
  // CHART (FIXED ONLY)
  // =========================
  const chartData = Array.from({ length: 12 }).map((_, i) => {

      const monthRepairs = repairs.filter(r =>
      new Date(r.created_at).getMonth() === i &&
      r.fix_status === "fixed" && r.price // 🔥 أهم سطر"
    )

    const profit = monthRepairs.reduce(
      (sum, r) => sum + (Number(r.price||0) - Number(r.cost||0)),
      0
    )

    return {
      month: new Date(0, i).toLocaleString(lang, { month: "short" }),
      profit
    }
  })

  return(
    <PageWrapper>

      {!unlocked && shop && (
        <PinModal
          correctPin={shop?.profit_pin}
          onSuccess={unlock}
          onClose={()=>{}}
        />
      )}

      {unlocked && (
        <div className="space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center flex-wrap gap-3">

            <h1 className="text-3xl font-bold">
              💰 {t("profit")}
            </h1>

            <div className="flex gap-2">

              <button
                onClick={()=>{
                  setLang(lang === "de" ? "en" : "de")
                  location.reload()
                }}
                className="px-3 py-2 bg-slate-800 rounded-lg"
              >
                {lang === "de" ? "EN" : "DE"}
              </button>

              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-indigo-600 rounded-lg"
              >
                🧾 {t("exportPDF")}
              </button>

            </div>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat title="Profit" value={`${stats.profit} €`} highlight />
            <Stat title="Fixed" value={stats.fixed} />
            <Stat title="Not Fixed" value={stats.notFixed} />
            <Stat title="Success" value={`${stats.successRate}%`} />
          </div>

          {/* CHART */}
          <Card>
            <div className="h-[320px] p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false}/>
                  <XAxis dataKey="month" stroke="#64748b"/>
                  <YAxis stroke="#64748b"/>
                  <Tooltip/>
                  <Area type="monotone" dataKey="profit" stroke="#6366f1" fillOpacity={0.2}/>
                  <Line type="monotone" dataKey="profit" stroke="#818cf8"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>
      )}

    </PageWrapper>
  )
}

// =========================
// UI
// =========================
function Stat({title,value,highlight}:any){
  return(
    <motion.div
      whileHover={{scale:1.05}}
      className={`p-4 rounded-xl bg-slate-900 border border-white/10
      ${highlight && "shadow-[0_0_25px_rgba(99,102,241,0.4)]"}`}
    >
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </motion.div>
  )
}