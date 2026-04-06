"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import TopShops from "@/components/admin/top-shops"
import ProblemChart from "@/components/admin/problem-chart"
import ActivityFeed from "@/components/admin/activity-feed"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function AdminDashboard(){

  const [shops,setShops] = useState(0)
  const [repairsToday,setRepairsToday] = useState(0)
  const [totalRepairs,setTotalRepairs] = useState(0)
  const [revenue,setRevenue] = useState(0)
  const [chartData,setChartData] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [notifications,setNotifications] = useState<string[]>([])
  const [search,setSearch] = useState("")

  useEffect(()=>{
    loadStats()

    const interval = setInterval(()=>{
      loadStats()
    },10000)

    const channel = supabase
      .channel("admin-live")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "repairs" },
        () => loadStats()
      )
      .subscribe()

    return ()=>{
      clearInterval(interval)
      supabase.removeChannel(channel)
    }

  },[])

  async function loadStats(){
    try{

      setLoading(true)

      const { count: shopsCount } = await supabase
        .from("shops")
        .select("*",{ count:"exact", head:true })

      const today = new Date().toISOString().split("T")[0]

      const { count: repairsTodayCount } = await supabase
        .from("repairs")
        .select("*",{ count:"exact", head:true })
        .gte("created_at",today)

      const { count: totalRepairsCount } = await supabase
        .from("repairs")
        .select("*",{ count:"exact", head:true })

      const startOfMonth = new Date()
      startOfMonth.setDate(1)

      const { data: revenueData } = await supabase
        .from("subscriptions")
        .select("price")
        .gte("created_at", startOfMonth.toISOString())

      let total = 0
      revenueData?.forEach((s:any)=> total += s.price)

      const { data: repairs } = await supabase
        .from("repairs")
        .select("created_at")

      const grouped:any = {}

      repairs?.forEach((r:any)=>{
        const date = r.created_at.split("T")[0]
        if(!grouped[date]) grouped[date] = 0
        grouped[date]++
      })

      const chart = Object.entries(grouped).map(([date, repairs])=>({
        date,
        repairs
      }))

      setChartData(chart)

      setShops(shopsCount || 0)
      setRepairsToday(repairsTodayCount || 0)
      setTotalRepairs(totalRepairsCount || 0)
      setRevenue(total)

      if(repairsTodayCount && repairsTodayCount > 5){
        setNotifications(prev=>["🔥 High repair activity",...prev])
      }

    }catch(e){
      console.error("Admin error:", e)
    }finally{
      setLoading(false)
    }
  }

  function exportCSV(){
    const csv = [
      ["date","repairs"],
      ...chartData.map(d=>[d.date,d.repairs])
    ].map(e=>e.join(",")).join("\n")

    const blob = new Blob([csv])
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "repairs.csv"
    a.click()
  }

  return(

    <div className="max-w-7xl mx-auto space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          🚀 Admin Control Center
        </h1>
        <p className="text-slate-400 mt-1">
          Real-time platform analytics & system insights
        </p>
      </div>

      {/* SEARCH + EXPORT */}
      <div className="flex gap-4">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="bg-slate-900 border border-white/10 px-4 py-2 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          onClick={exportCSV}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition"
        >
          Export
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {notifications.length > 0 && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl backdrop-blur-md">
          {notifications.slice(0,3).map((n,i)=>(
            <p key={i} className="text-sm text-indigo-300">{n}</p>
          ))}
        </div>
      )}

      {/* ALERTS */}
      <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <h3 className="font-semibold mb-4 text-red-400">🚨 System Alerts</h3>

        {repairsToday === 0 && <p className="text-yellow-400">⚠️ No repairs today</p>}
        {shops === 0 && <p className="text-red-400">❌ No shops</p>}
        {revenue === 0 && <p className="text-orange-400">💸 No revenue</p>}
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Active Shops" value={shops}/>
        <Card title="Repairs Today" value={repairsToday} highlight/>
        <Card title="Total Repairs" value={totalRepairs}/>
        <Card title="Revenue" value={`€${revenue}`} success/>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">

          <h2 className="mb-4 font-semibold">Repairs Growth</h2>

          {loading ? "Loading..." : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip />
                <Line 
                  type="monotone"
                  dataKey="repairs"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

        </div>

        <div className="space-y-6">

          <SystemStatus/>

          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
            <TopShops/>
          </div>

        </div>

      </div>

      {/* SECOND */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <ProblemChart/>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <ActivityFeed/>
        </div>

      </div>

    </div>
  )
}

/* CARD */
function Card({title,value,highlight,success}:any){
  return(
    <div className={`
      p-6 rounded-2xl border border-white/10 transition
      bg-slate-900/60 backdrop-blur-xl shadow-lg
      hover:scale-[1.03]
      ${highlight && "ring-2 ring-indigo-500"}
      ${success && "shadow-[0_0_20px_rgba(34,197,94,0.4)]"}
    `}>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}

/* STATUS */
function SystemStatus(){
  return(
    <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
      <h3 className="font-semibold">⚡ System Status</h3>
      <div className="flex items-center gap-2 mt-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        All systems operational
      </div>
    </div>
  )
}