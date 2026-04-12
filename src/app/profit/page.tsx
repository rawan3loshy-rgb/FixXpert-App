"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import PinModal from "@/components/ui/pin-modal"
import { motion } from "framer-motion"
import { useRef } from "react"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

export default function ProfitPage(){
 
  const router = useRouter()

  const [repairs,setRepairs] = useState<any[]>([])
  const [filtered,setFiltered] = useState<any[]>([])
  const [shop,setShop] = useState<any>(null)
  const [loading,setLoading] = useState(true)
  const [unlocked,setUnlocked] = useState(false)

  const [range,setRange] = useState("today")
  const [month,setMonth] = useState(new Date().getMonth())
  const [year,setYear] = useState(new Date().getFullYear())
  
  const [lang,setLang] = useState("en")
  
  // =========================
  // TRANSLATION
  // =========================
  const t:any = {
    en:{
      profit:"Profit",
      fixed:"Fixed",
      notFixed:"Not Fixed",
      total:"Total",
      topDevice:"Top Device",
      mostProblem:"Most Problem",
      mostDevice:"Most Repaired Device",
      logout:"Logout",
      pdf:"PDF",
      today:"Today",
      week:"Week",
      month:"Month",
      ai:"AI Insight",
      prediction:"Prediction next month"
    },
    de:{
      profit:"Gewinn",
      fixed:"Repariert",
      notFixed:"Nicht repariert",
      total:"Gesamt",
      topDevice:"Bestes Gerät",
      mostProblem:"Häufigstes Problem",
      mostDevice:"Meist repariert",
      logout:"Abmelden",
      pdf:"PDF Export",
      today:"Heute",
      week:"Woche",
      month:"Monat",
      ai:"KI Analyse",
      prediction:"Vorhersage nächster Monat"
    }
  }

  // =========================
  // LOAD + REALTIME (FIXED)
  // =========================
useEffect(()=>{

  load()

  const channel = supabase
    .channel("realtime-repairs")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "repairs"
      },
      () => {
        load() // 🔥 يعمل refresh تلقائي
      }
    )

    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }

},[])

  const load = async ()=>{

    const { data: { session } } = await supabase.auth.getSession()

    if(!session){
      router.push("/login")
      return
    }

    const { data: shopData } = await supabase
      .from("shops")
      .select("*")
      .eq("shop_id", session.user.id)
      .maybeSingle()

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
  useEffect(()=>{
    const now = new Date()
    let result = repairs

    if(range === "today"){
      result = repairs.filter(r =>
        new Date(r.created_at).toDateString() === now.toDateString()
      )
    }

    if(range === "week"){
      const w = new Date()
      w.setDate(now.getDate()-7)
      result = repairs.filter(r => new Date(r.created_at) >= w)
    }

    if(range === "month"){
      result = repairs.filter(r =>{
        const d = new Date(r.created_at)
        return d.getMonth() === month && d.getFullYear() === year
      })
    }

    setFiltered(result)
  },[range,repairs,month,year])

  // =========================
  // STATS + AI
  // =========================
  let profit = 0
  let fixed = 0
  let notFixed = 0

  const deviceMap:any = {}
  const problemMap:any = {}

  for(const r of filtered){

    const price = Number(r.price) || 0

    if((r.fix_status||"").toLowerCase()==="fixed"){
      profit += price
      fixed++
      deviceMap[r.device] = (deviceMap[r.device]||0)+1
    } else {
      notFixed++
    }

    problemMap[r.problem] = (problemMap[r.problem]||0)+1
  }

  const bestDevice = Object.entries(deviceMap).sort((a:any,b:any)=>b[1]-a[1])[0]
  const topProblem = Object.entries(problemMap).sort((a:any,b:any)=>b[1]-a[1])[0]

  const successRate = filtered.length
    ? Math.round((fixed/filtered.length)*100)
    : 0

  // 🔥 AI Prediction
  const avgMonthly = repairs.length
    ? repairs.reduce((s,r)=> s+(Number(r.price)||0),0) / 12
    : 0

  const predicted = Math.round(avgMonthly * (1 + successRate/100))

  const aiMessage =
    lang==="de"
      ? `Erfolgsrate: ${successRate}%. Prognose: ${predicted}€`
      : `Success rate: ${successRate}%. Prediction: ${predicted}€`

  // =========================
  // CHART
  // =========================
  const chartData = Array.from({length:12}).map((_,i)=>{

    const monthRepairs = repairs.filter(r =>
      new Date(r.created_at).getMonth() === i &&
      (r.fix_status||"").toLowerCase()==="fixed"
    )

    return{
      month: new Date(0,i).toLocaleString(lang,{month:"short"}),
      profit: monthRepairs.reduce((s,r)=> s+(Number(r.price)||0),0)
    }
  })

  // =========================
  // PDF EXPORT (FIXED)
  // =========================
  const exportPDF = async () => {

  const win = window.open("", "_blank", "width=900,height=700")

  if(!win) return

  const statusText = (s:string) =>
    s?.toLowerCase() === "fixed"
      ? (lang==="en" ? "Fixed" : "Repariert")
      : (lang==="en" ? "Not fixed" : "Nicht repariert")
 
   
  const content = `
  <html>
  <head>
    <title>Report</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        background: #0f172a;
        color: #0f172a;
        padding: 30px;
      }

      .container {
        background: white;
        border-radius: 16px;
        padding: 30px;
        max-width: 800px;
        margin: auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
      }

      .title {
        font-size: 22px;
        font-weight: 700;
      }

      .date {
        font-size: 12px;
        color: #64748b;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(4,1fr);
        gap: 12px;
        margin-bottom: 25px;
      }

      .card {
        background: #f1f5f9;
        padding: 12px;
        border-radius: 10px;
      }

      .card p {
        margin:0;
        font-size:12px;
        color:#64748b;
      }

      .card h3 {
        margin:5px 0 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      th {
        text-align: left;
        font-size: 12px;
        color: #64748b;
        padding: 10px;
        border-bottom: 1px solid #e2e8f0;
      }

      td {
        padding: 10px;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
      }

      .green {
        color: #16a34a;
        font-weight: 600;
      }

      .status {
        font-weight: 500;
      }

    </style>
  </head>

  <body>

    <div class="container">

      <div class="header">
        <div class="title">💰 Profit Report</div>
        <div class="date">${new Date().toLocaleString()}</div>
      </div>

      <div class="stats">
        <div class="card">
          <p>${t[lang].profit}</p>
          <h3>${profit}€</h3>
        </div>

        <div class="card">
          <p>${t[lang].fixed}</p>
          <h3>${fixed}</h3>
        </div>

        <div class="card">
          <p>${t[lang].notFixed}</p>
          <h3>${notFixed}</h3>
        </div>

        <div class="card">
          <p>${t[lang].total}</p>
          <h3>${filtered.length}</h3>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Device</th>
            <th>Problem</th>
            <th>Status</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          ${filtered.map(r => `
            <tr>
              <td>${r.device}</td>
              <td>${r.problem}</td>
              <td class="status">${statusText(r.fix_status)}</td>
              <td class="green">
                ${
                  (r.fix_status||"").toLowerCase()==="fixed"
                  ? `${Number(r.price)||0}€`
                  : "-"
                }
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>

    </div>

  </body>
  </html>
  `

  win.document.write(content)
  win.document.close()

  setTimeout(()=>{
    win.print()
  },300)
}
  const logout = async ()=>{
    await supabase.auth.signOut()
    router.push("/login")
  }

  if(loading) return null

  return(
    <div className="min-h-screen relative overflow-hidden text-white p-6">

    {/* BACKGROUND GLOW */}
   <div className="absolute inset-0 bg-[#020617]" />

    <div className="absolute top-[-200px] left-[20%] w-[600px] h-[600px] bg-indigo-600 opacity-20 blur-[120px]" />
   <div className="absolute bottom-[-200px] right-[20%] w-[600px] h-[600px] bg-cyan-500 opacity-20 blur-[120px]" />

   <div className="relative z-10">

      {!unlocked && shop && (
        <PinModal correctPin={shop.profit_pin} onSuccess={()=>setUnlocked(true)} />
      )}

      {unlocked && (
        <motion.div 
        initial={{opacity:0,y:20}}
        animate={{opacity: unlocked ? 1 : 0, y: 
        unlocked ? 0 : 20}}
       className={`space-y-6 ${!unlocked && "pointer-events-none opacity-0"}`}>
      
          {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

         <h1 className="text-3xl font-semibold tracking-tight text-white">
        💰 Profit Dashboard
        </h1>

        <div className="flex gap-2">

       <button
       onClick={()=>setLang(lang==="en"?"de":"en")}
       className="btn-ghost"
       >
       {lang==="en"?"DE":"EN"}
       </button>

       <button
           onClick={exportPDF}
           className="btn-gradient"
            >
            PDF Export
           </button>

           <button
           onClick={logout}
           className="btn-danger"
           >
           Logout
           </button>

           </div>


           <style jsx>{`
            .btn-ghost {
           padding:6px 12px;
           border-radius:10px;
           background:rgba(255,255,255,0.05);
           transition:0.2s;
           }

           .btn-ghost:hover {
           background:rgba(255,255,255,0.1);
           }

           .btn-gradient {
           padding:6px 12px;
           border-radius:10px;
           background:linear-gradient(135deg,#6366f1,#22d3ee);
           font-weight:500;
           box-shadow:0 4px 20px rgba(99,102,241,0.4);
           }

           .btn-danger {
           padding:6px 12px;
           border-radius:10px;
           background:#ef4444;
           }
           .filter-box {
           padding:10px 14px;
           border-radius:12px;

           background: rgba(255,255,255,0.05);
           backdrop-filter: blur(12px);

           border: 1px solid rgba(255,255,255,0.1);
           box-shadow:
            0 4px 20px rgba(0,0,0,0.4),
           inset 0 1px 0 rgba(255,255,255,0.05);

           transition: 0.2s;
           }
 
           .filter-box:hover {
           border: 1px solid rgba(99,102,241,0.6);
           box-shadow:
           0 0 20px rgba(99,102,241,0.4),
           0 4px 20px rgba(0,0,0,0.4);
           }
           `}</style>
          </div>
          {/* FILTER */}
          <motion.div
          whileHover={{scale:1.02}}
          whileTap={{scale:0.97}}
          >
          <div className="flex gap-3 flex-wrap">

          {["today","week","month"].map(f=>(
          <motion.button
         key={f}
         onClick={()=>setRange(f)}
          whileTap={{scale:0.95}}
         whileHover={{scale:1.05}}
         className={`
         px-4 py-2 rounded-xl text-sm font-medium transition
         ${range===f
          ? "bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg"
          : "bg-white/5 text-slate-300 hover:bg-white/10"
          }
         `}
         >
          {t[lang][f]}
         </motion.button>
         ))}

         {range==="month" && (
           <div className="flex gap-3 items-center">

           {/* MONTH */}
            <div className="filter-box">
            <select
           value={month}
            onChange={(e)=>setMonth(Number(e.target.value))}
            className="bg-transparent outline-none text-white"
           >
           {Array.from({length:12}).map((_,i)=>(
           <option key={i} value={i} className="text-black">
            {new Date(0,i).toLocaleString(lang,{month:"short"})}
           </option>
           ))}
           </select>
           </div>

           {/* YEAR */}
           <div className="filter-box">
           <input
           type="number"
           value={year}
           onChange={(e)=>setYear(Number(e.target.value))}
           className="bg-transparent outline-none text-white w-20 text-center"
           />
           </div>

            </div>
           )}
           
 
          </div>
          </motion.div>
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card title={t[lang].profit} value={`${profit}€`} />
            <Card title={t[lang].fixed} value={fixed} />
            <Card title={t[lang].notFixed} value={notFixed} />
            <Card title={t[lang].total} value={filtered.length} />
            <Card title={t[lang].topDevice} value={bestDevice?.[0]||"-"} />
          </div>

          {/* AI */}
          <motion.div
         initial={{opacity:0,y:20}}
         animate={{opacity:1,y:0}}
         className="
         relative p-6 rounded-2xl
         bg-gradient-to-br from-indigo-500/10 to-cyan-500/10
         border border-indigo-500/20
         backdrop-blur-xl
         "
         >

         <p className="text-indigo-400 text-sm font-semibold mb-2">
         🤖 {t[lang].ai}
         </p>

          <p className="text-sm text-white/90 leading-relaxed">
         {aiMessage}
         </p>

        </motion.div>

          {/* CHART */}
          
         <div className="
         relative rounded-2xl p-6 h-80
         bg-white/5 backdrop-blur-xl
         border border-white/10
         shadow-[0_20px_80px_rgba(99,102,241,0.15)]
          ">
         <div className="w-full" style={{ height: 320 }}>
         <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>

         <defs>
         <linearGradient id="ultra" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9}/>
          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0}/>
         </linearGradient>
          </defs>

         <CartesianGrid stroke="rgba(255,255,255,0.04)" />

         <XAxis dataKey="month" stroke="#94a3b8"/>
         <YAxis stroke="#94a3b8"/>

         <Tooltip
         contentStyle={{
          background:"#020617",
          border:"1px solid #334155",
          borderRadius:"12px",
          backdropFilter:"blur(10px)"
         }}
         />

         <Area
         type="monotone"
         dataKey="profit"
         stroke="#22d3ee"
         strokeWidth={3}
         fill="url(#ultra)"
         dot={{ r:3 }}
         activeDot={{ r:6 }}
         />

         </AreaChart>
         </ResponsiveContainer>
          </div>
          </div>
          {/* TABLE */}
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-slate-400 border-b border-white/10">
                <tr>
                  <th className="p-3 text-left">Device</th>
                  <th className="p-3 text-left">Problem</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Price</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(r=>(
               <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition">

                 <td className="p-3">{r.device}</td>

                 <td className="p-3">{r.problem}</td>

                 <td className="p-3">
                 {(r.fix_status || "").toLowerCase() === "fixed"
                 ? (lang === "en" ? "Fixed" : "Repariert")
                 : (lang === "en" ? "Not fixed" : "Nicht repariert")
                 }
               </td>

                <td className="p-3 text-green-400 font-semibold">
               {(r.fix_status || "").toLowerCase() === "fixed"
               ? `${Number(r.price) || 0}€`
               : "-"
               }
               </td>

              </tr> 
                ))}
              </tbody>
            </table>
          </div>

        </motion.div>
      )}
    
    </div>
    </div>
    
  )
}

// =========================
// CARD (🔥 PLACE HERE)
// =========================
function Card({title,value}:any){
  return(
    <motion.div
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      whileHover={{scale:1.04}}
      className="
        relative p-4 rounded-2xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-[0_10px_40px_rgba(0,0,0,0.6)]
        overflow-hidden
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 opacity-0 hover:opacity-100 transition"/>
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </motion.div>
  )
}