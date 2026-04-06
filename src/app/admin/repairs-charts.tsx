"use client"

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function RepairsChart({ data }: any){

return(

<div className="bg-slate-800 p-6 rounded-xl mt-8">

<h2 className="text-lg font-semibold mb-4">
Repairs Growth
</h2>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={data}>

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

)

}