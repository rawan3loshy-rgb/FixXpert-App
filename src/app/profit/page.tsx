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
  // INIT + REALTIME
  // =========================
 useEffect(()=>{

  if(!shop?.id) return // 🔥 مهم جداً

  const channel = supabase
    .channel("repairs-live")
    .on(
      "postgres_changes",
      { 
        event: "*", 
        schema: "public", 
        table: "repairs",
        filter: `shop_id=eq.${shop.id}` // ✅ الآن صحيح
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

    const { data: shopData } = await supabase
      .from("shops")
      .select("*")
      .eq("shop_id", session.user.id)
      .limit(1)
      .maybeSingle()

    if(!shopData){
      setLoading(false)
      return
    }

    setShop(shopData)

    const { data } = await supabase
      .from("repairs")
      .select("*")
      .eq("shop_id", shopData.id)
      .order("created_at",{ascending:false})

    setRepairs(data || [])
    setLoading(false)
  }

  // =========================
  // FILTER
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
    let warranty = 0

    for(const r of result){
      const p = Number(r.price||0) - Number(r.cost||0)

      if(r.fix_status === "fixed"){
        fixed++
        profit += p
      }

      if(r.fix_status === "not-fixed"){
        notFixed++
      }

      if(r.warranty){
        warranty++
      }
    }

    const avg = result.length ? Math.round(profit / result.length) : 0
    const successRate = result.length ? Math.round((fixed / result.length) * 100) : 0

    setStats({fixed,notFixed,profit,warranty,avg,successRate})
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
  // CHART DATA
  // =========================
  const chartData = Array.from({ length: 12 }).map((_, i) => {

    const monthRepairs = repairs.filter(r =>
  new Date(r.created_at).getMonth() === i &&
  r.fix_status === "fixed" && r.price // 🔥 أهم سطر
 )

 const profit = monthRepairs.reduce(
  (sum, r) => sum + (Number(r.price || 0) - Number(r.cost || 0)),
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

            <div className="flex items-center gap-3">

              

              <h1 className="text-3xl font-bold">
                💰 {t("profit")}
              </h1>

            </div>

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
                className="btn px-4 py-2 bg-indigo-600 rounded-lg"
              >
                🧾 {t("exportPDF")}
              </button>

            </div>

          </div>

          {/* FILTER */}
          <div className="flex gap-2 flex-wrap">

            {[
              {id:"today",label:t("today")},
              {id:"week",label:t("thisWeek")},
              {id:"month",label:t("thisMonth")}
            ].map(f=>(
              <button
                key={f.id}
                onClick={()=>setRange(f.id)}
                className={`px-3 py-2 rounded-lg ${
                  range===f.id ? "bg-indigo-600" : "bg-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}

            {range === "month" && (
              <select
                value={selectedMonth}
                onChange={(e)=>setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 bg-slate-800 rounded-lg"
              >
                {Array.from({length:12}).map((_,i)=>(
                  <option key={i} value={i}>
                    {new Date(0,i).toLocaleString(lang,{month:"long"})}
                  </option>
                ))}
              </select>
            )}

          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Stat title={t("profit")} value={`${stats.profit} €`} highlight />
            <Stat title={t("fixed")} value={stats.fixed} />
            <Stat title={t("notFixed")} value={stats.notFixed} />
            <Stat title={t("successRate")} value={`${stats.successRate}%`} />
          </div>

          {/* 🔥 CHART */}
          <Card>
            <div className="h-[340px] p-6">

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={chartData}>

                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />

                  <defs>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.7}/>
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />

                  <Tooltip
                    contentStyle={{
                      background: "#020617",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "#fff"
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#profitGradient)"
                  />

                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#818cf8"
                    strokeWidth={2}
                    dot={false}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>
          </Card>

          {/* TABLE */}
          <Card>
            <div className="overflow-x-auto">

              <table className="w-full text-sm text-left">

                <thead className="border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">{t("deviceLabel")}</th>
                    <th className="p-3">{t("problemLabel")}</th>
                    <th className="p-3">{t("price")}</th>
                    <th className="p-3">{t("statusLabel")}</th>
                  </tr>
                </thead>

                <tbody>

                  {filtered.map(r=>{

                    const profit = Number(r.price||0) - Number(r.cost||0)

                    return(
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">

                        <td className="p-3 font-bold">#{r.order_number}</td>
                        <td className="p-3">{r.device}</td>
                        <td className="p-3 text-slate-400">{r.problem}</td>

                        <td className="p-3 text-green-400 font-semibold">
                          {profit} €
                        </td>

                        <td className="p-3">
                          <div className="flex gap-2">

                            {r.fix_status === "fixed" && (
                              <Badge color="green" text={t("fixed")} />
                            )}

                            {r.fix_status === "not-fixed" && (
                              <Badge color="red" text={t("notFixed")} />
                            )}

                            {r.warranty && (
                              <Badge color="yellow" text={t("noWarranty")} />
                            )}

                          </div>
                        </td>

                      </tr>
                    )
                  })}

                </tbody>

              </table>

            </div>
          </Card>
         {/* 🤖 AI SYSTEM */}
          <Card>
         <div className="p-6">
         <AISection data={filtered} />
         </div>
         </Card>
        </div>
        )}

      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          * { color: black !important; background: transparent !important; }
        }
      `}</style>

    </PageWrapper>
  )
}

// UI

function Stat({title,value,highlight}:any){
  return(
    <motion.div
      whileHover={{scale:1.05}}
      className={`glass card glow p-4 rounded-xl 
      ${highlight && "shadow-[0_0_25px_rgba(99,102,241,0.4)]"}`}
    >
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </motion.div>
  )
}

function Badge({color,text}:any){
  const map:any = {
    green:"bg-green-500/20 text-green-400",
    red:"bg-red-500/20 text-red-400",
    yellow:"bg-yellow-500/20 text-yellow-400"
  }

  return(
    <span className={`px-2 py-1 text-xs rounded-full ${map[color]}`}>
      {text}
    </span>
  )
}
// =========================
// 🤖 AI SYSTEM ULTRA UI
// =========================
function AISection({data}:any){

  let totalProfit = 0
  let fixed = 0

  const deviceMap:any = {}
  const problemMap:any = {}

  for(const r of data){

    const profit = Number(r.price||0) - Number(r.cost||0)

    if(r.fix_status === "fixed"){
      totalProfit += profit
      fixed++

      deviceMap[r.device] = (deviceMap[r.device] || 0) + profit
    }

    problemMap[r.problem] = (problemMap[r.problem] || 0) + 1
  }

  const bestDevice = Object.entries(deviceMap).sort((a:any,b:any)=>b[1]-a[1])[0]
  const worstDevice = Object.entries(deviceMap).sort((a:any,b:any)=>a[1]-b[1])[0]
  const topProblem = Object.entries(problemMap).sort((a:any,b:any)=>b[1]-a[1])[0]

  const success = data.length ? Math.round((fixed/data.length)*100) : 0

  return(
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">
          🤖 {t("aiInsights") || "AI Insights"}
        </h2>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 gap-4">

        <AICard
          title={t("bestDevice") || "Best Device"}
          value={bestDevice?.[0]}
          extra={`€${bestDevice?.[1] || 0}`}
          color="green"
        />

        <AICard
          title={t("worstDevice") || "Worst Device"}
          value={worstDevice?.[0]}
          extra={`€${worstDevice?.[1] || 0}`}
          color="red"
        />

        <AICard
          title={t("topProblem") || "Top Problem"}
          value={topProblem?.[0]}
          extra={`${topProblem?.[1] || 0}x`}
          color="yellow"
        />

        <AICard
          title={t("successRate") || "Success Rate"}
          value={`${success}%`}
          color="blue"
        />

      </div>

      {/* AI SUGGESTION */}
      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-xl"
      >
        <p className="text-sm text-indigo-300 mb-2">
          💡 {t("aiSuggestion") || "AI Suggestion"}
        </p>

        <p className="text-sm text-white">

          {success < 60 && (t("aiBad") || "⚠️ Improve repair success rate")}
          {success >= 60 && success < 85 && (t("aiMid") || "👍 Optimize pricing and workflow")}
          {success >= 85 && (t("aiGood") || "🚀 Excellent! Scale your business")}

        </p>
      </motion.div>

    </div>
  )
}

// =========================
// AI CARD (MATCH YOUR UI)
// =========================
function AICard({title,value,extra,color}:any){

  const colors:any = {
    green:"text-green-400",
    red:"text-red-400",
    yellow:"text-yellow-400",
    blue:"text-indigo-400"
  }

  return(
    <motion.div
      whileHover={{scale:1.05}}
      className="glass card glow p-4 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl"
    >
      <p className="text-xs text-slate-400">{title}</p>

      <p className={`text-lg font-bold mt-1 ${colors[color]}`}>
        {value || "-"}
      </p>

      {extra && (
        <p className="text-xs text-slate-500 mt-1">
          {extra}
        </p>
      )}
    </motion.div>
  )
}