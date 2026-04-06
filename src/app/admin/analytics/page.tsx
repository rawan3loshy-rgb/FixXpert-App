"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function AdminAnalytics(){

const [repairChart,setRepairChart] = useState<any[]>([])
const [shopChart,setShopChart] = useState<any[]>([])
const [topDevices,setTopDevices] = useState<any[]>([])
const [topProblems,setTopProblems] = useState<any[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{
loadAnalytics()
},[])

async function loadAnalytics(){

/* Repairs */

const { data: repairs } = await supabase
.from("repairs")
.select("device,problem,created_at")

/* Shops */

const { data: shops } = await supabase
.from("shops")
.select("created_at")


/* Repairs Growth */

const repairGrouped:any = {}

repairs?.forEach((r:any)=>{

const date = r.created_at.split("T")[0]

if(!repairGrouped[date]) repairGrouped[date] = 0

repairGrouped[date]++

})

const repairsChart = Object.keys(repairGrouped).map(date=>({
date,
repairs: repairGrouped[date]
}))

setRepairChart(repairsChart)


/* Shops Growth */

const shopGrouped:any = {}

shops?.forEach((s:any)=>{

const date = s.created_at.split("T")[0]

if(!shopGrouped[date]) shopGrouped[date] = 0

shopGrouped[date]++

})

const shopsChart = Object.keys(shopGrouped).map(date=>({
date,
shops: shopGrouped[date]
}))

setShopChart(shopsChart)


/* Top Devices */

const deviceCount:any = {}

repairs?.forEach((r:any)=>{
deviceCount[r.device] = (deviceCount[r.device] || 0) + 1
})

const devices = Object.keys(deviceCount).map(device=>({
device,
count: deviceCount[device]
}))
.sort((a,b)=>b.count-a.count)
.slice(0,5)

setTopDevices(devices)


/* Top Problems */

const problemCount:any = {}

repairs?.forEach((r:any)=>{
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
return <p>Loading analytics...</p>
}

return(

<div className="space-y-10">

<h1 className="text-3xl font-bold">
Platform Analytics
</h1>


{/* CHARTS */}

<div className="grid grid-cols-2 gap-6">

{/* Repairs Growth */}

<div className="bg-slate-800 p-6 rounded-xl">

<h2 className="text-lg font-semibold mb-4">
Repairs Growth
</h2>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={repairChart}>

<XAxis dataKey="date" stroke="#888"/>

<YAxis stroke="#888"/>

<Tooltip />

<Line
type="monotone"
dataKey="repairs"
stroke="#3b82f6"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>


{/* Shops Growth */}

<div className="bg-slate-800 p-6 rounded-xl">

<h2 className="text-lg font-semibold mb-4">
Shops Growth
</h2>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={shopChart}>

<XAxis dataKey="date" stroke="#888"/>

<YAxis stroke="#888"/>

<Tooltip />

<Line
type="monotone"
dataKey="shops"
stroke="#22c55e"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>


{/* TOP DATA */}

<div className="grid grid-cols-2 gap-6">


{/* Devices */}

<div className="bg-slate-800 p-6 rounded-xl">

<h2 className="text-lg font-semibold mb-4">
Most Repaired Devices
</h2>

<div className="space-y-2">

{topDevices.map((d,index)=>(
<div key={index} className="flex justify-between">

<span>{d.device}</span>

<span className="text-blue-400">
{d.count}
</span>

</div>
))}

</div>

</div>


{/* Problems */}

<div className="bg-slate-800 p-6 rounded-xl">

<h2 className="text-lg font-semibold mb-4">
Most Common Problems
</h2>

<div className="space-y-2">

{topProblems.map((p,index)=>(
<div key={index} className="flex justify-between">

<span>{p.problem}</span>

<span className="text-red-400">
{p.count}
</span>

</div>
))}

</div>

</div>

</div>

</div>

)

}