"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function ShopDetails(){

const { id } = useParams()

const [shop,setShop] = useState<any>(null)
const [repairs,setRepairs] = useState(0)
const [chartData,setChartData] = useState<any[]>([])
const [topDevices,setTopDevices] = useState<any[]>([])
const [topProblems,setTopProblems] = useState<any[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{
loadShop()
},[])

async function loadShop(){

const { data: shopData } = await supabase
.from("shops")
.select("*")
.eq("shop_id", id)
.single()

if(!shopData){
setLoading(false)
return
}

setShop(shopData)

const { count } = await supabase
.from("repairs")
.select("*",{ count:"exact", head:true })
.eq("shop_id", shopData.shop_id)

setRepairs(count || 0)

const { data: repairsData } = await supabase
.from("repairs")
.select("device,problem,created_at")
.eq("shop_id", shopData.shop_id)

const grouped:any = {}

repairsData?.forEach((r:any)=>{
const date = r.created_at.split("T")[0]
if(!grouped[date]) grouped[date] = 0
grouped[date]++
})

const chart = Object.keys(grouped).map(date=>({
date,
repairs: grouped[date]
}))

setChartData(chart)

/* devices */

const deviceCount:any = {}
repairsData?.forEach((r:any)=>{
deviceCount[r.device] = (deviceCount[r.device] || 0) + 1
})

const devices = Object.keys(deviceCount).map(device=>({
device,
count: deviceCount[device]
}))
.sort((a,b)=>b.count-a.count)
.slice(0,5)

setTopDevices(devices)

/* problems */

const problemCount:any = {}
repairsData?.forEach((r:any)=>{
problemCount[r.problem] = (problemCount[r.problem] || 0) + 1
})

const problems = Object.keys(problemCount).map(problem=>({
problem,
count: problemCount[problem]
}))
.sort((a,b)=>b.count-a.count)
.slice(0,5)

setTopProblems(problems)

setLoading(false)

}

if(loading){
return (
<div className="text-center text-slate-400 mt-20 animate-pulse">
Loading shop analytics...
</div>
)
}

if(!shop){
return <p>Shop not found</p>
}

return(

<div className="max-w-7xl mx-auto space-y-10">

{/* HEADER */}
<div>
<h1 className="text-3xl font-bold">
🏪 {shop.shop_name}
</h1>
<p className="text-slate-400 text-sm mt-1">
Shop analytics & performance overview
</p>
</div>

{/* OVERVIEW */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">

<Card title="Email" value={shop.email}/>
<Card title="Country" value={shop.country || "-"}/>
<Card title="Total Repairs" value={repairs} highlight/>
<Card title="Created" value={shop.created_at?.split("T")[0]}/>

</div>

{/* CHART */}
<div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">

<h2 className="text-lg font-semibold mb-4">
📈 Repairs Growth
</h2>

<ResponsiveContainer width="100%" height={300}>
<LineChart data={chartData}>
<XAxis dataKey="date" stroke="#94a3b8"/>
<YAxis stroke="#94a3b8"/>
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

</div>

{/* ANALYTICS */}
<div className="grid md:grid-cols-2 gap-6">

{/* DEVICES */}
<div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10">

<h2 className="text-lg font-semibold mb-4">
📱 Most Repaired Devices
</h2>

<div className="space-y-3">

{topDevices.map((d,index)=>(
<motion.div
key={index}
whileHover={{ scale: 1.03 }}
className="flex justify-between items-center bg-slate-800/60 px-4 py-2 rounded-lg"
>
<span>{d.device}</span>
<span className="text-indigo-400 font-semibold">
{d.count}
</span>
</motion.div>
))}

</div>

</div>

{/* PROBLEMS */}
<div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10">

<h2 className="text-lg font-semibold mb-4">
⚠️ Most Common Problems
</h2>

<div className="space-y-3">

{topProblems.map((p,index)=>(
<motion.div
key={index}
whileHover={{ scale: 1.03 }}
className="flex justify-between items-center bg-slate-800/60 px-4 py-2 rounded-lg"
>
<span>{p.problem}</span>
<span className="text-red-400 font-semibold">
{p.count}
</span>
</motion.div>
))}

</div>

</div>

</div>

</div>

)

}

/* CARD */
function Card({title,value,highlight}:any){
return(
<motion.div
whileHover={{ scale:1.05 }}
className={`
p-5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl
shadow-lg transition
${highlight && "ring-2 ring-indigo-500"}
`}
>
<p className="text-sm text-slate-400">{title}</p>
<p className="text-xl font-bold mt-2">{value}</p>
</motion.div>
)
}