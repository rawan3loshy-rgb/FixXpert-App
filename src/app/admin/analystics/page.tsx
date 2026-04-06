"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AdminAnalytics(){

const [repairs,setRepairs] = useState(0)
const [shops,setShops] = useState(0)
const [topDevice,setTopDevice] = useState("")
const [topProblem,setTopProblem] = useState("")

useEffect(()=>{
load()
},[])

async function load(){

/* total repairs */

const { count: repairsCount } = await supabase
.from("repairs")
.select("*",{ count:"exact", head:true })

setRepairs(repairsCount || 0)

/* shops */

const { count: shopsCount } = await supabase
.from("shops")
.select("*",{ count:"exact", head:true })

setShops(shopsCount || 0)

/* top device */

const { data: devices } = await supabase
.from("repairs")
.select("device")

const deviceCount:any = {}

devices?.forEach((d:any)=>{
deviceCount[d.device] = (deviceCount[d.device] || 0) + 1
})

const topD = Object.keys(deviceCount).sort((a,b)=>deviceCount[b]-deviceCount[a])[0]

setTopDevice(topD || "-")

/* top problem */

const { data: problems } = await supabase
.from("repairs")
.select("problem")

const problemCount:any = {}

problems?.forEach((p:any)=>{
problemCount[p.problem] = (problemCount[p.problem] || 0) + 1
})

const topP = Object.keys(problemCount).sort((a,b)=>problemCount[b]-problemCount[a])[0]

setTopProblem(topP || "-")

}

return(

<div className="space-y-8">

<h1 className="text-3xl font-bold">
Platform Analytics
</h1>

<div className="grid grid-cols-4 gap-6">

<div className="bg-slate-800 p-6 rounded-xl">

<p className="text-gray-400 text-sm">
Total Repairs
</p>

<p className="text-3xl font-bold mt-2">
{repairs}
</p>

</div>

<div className="bg-slate-800 p-6 rounded-xl">

<p className="text-gray-400 text-sm">
Total Shops
</p>

<p className="text-3xl font-bold mt-2">
{shops}
</p>

</div>

<div className="bg-slate-800 p-6 rounded-xl">

<p className="text-gray-400 text-sm">
Most Repaired Device
</p>

<p className="text-xl font-bold mt-2">
{topDevice}
</p>

</div>

<div className="bg-slate-800 p-6 rounded-xl">

<p className="text-gray-400 text-sm">
Most Common Problem
</p>

<p className="text-xl font-bold mt-2">
{topProblem}
</p>

</div>

</div>

</div>

)

}