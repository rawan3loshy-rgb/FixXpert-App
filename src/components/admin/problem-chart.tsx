"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import {
PieChart,
Pie,
Cell,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function ProblemChart(){

const [data,setData] = useState<any[]>([])

useEffect(()=>{
load()
},[])

async function load(){

const { data: repairs } = await supabase
.from("repairs")
.select("problem")

if(!repairs) return

const counts:any = {}

repairs.forEach((r:any)=>{

if(!counts[r.problem]) counts[r.problem] = 0

counts[r.problem]++

})

const chart = Object.keys(counts).map(p=>({
name:p,
value:counts[p]
}))

setData(chart)

}

const COLORS = [
"#3b82f6",
"#22c55e",
"#f59e0b",
"#ef4444",
"#8b5cf6"
]

return(

<div className="bg-slate-800 p-6 rounded-xl">

<h2 className="text-lg font-semibold mb-4">
Problem Distribution
</h2>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={data}
dataKey="value"
nameKey="name"
outerRadius={100}
label
>

{data.map((entry,index)=>(
<Cell
key={index}
fill={COLORS[index % COLORS.length]}
/>
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

)

}