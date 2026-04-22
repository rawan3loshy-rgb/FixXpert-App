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
const [saving,setSaving] = useState(false)
const shopId =
  typeof id === "string"
    ? id.trim()
    : id?.[0]?.trim()

useEffect(() => {

  async function init(){
    await loadShop()
  }

  init()

  // 🔥 REALTIME SHOP
  const channel = supabase
    .channel("shop-live")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "shops",
      },
      (payload:any)=>{
        if(payload.new.id === shopId){
          setShop(payload.new)
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }

}, [shopId])

async function uploadLogo(e:any){

  const file = e.target.files[0]
  if(!file) return

  // ❌ لا تجيب user.id
  // const user = ...

  // ✅ استخدم shop.id
  const fileName = `${shop.id}/logo-${Date.now()}.png`

  const { error } = await supabase.storage
    .from("logos")
    .upload(fileName, file, {
      upsert: true
    })

  if(error){
    alert(error.message)
    return
  }

  const { data: publicUrl } = supabase.storage
    .from("logos")
    .getPublicUrl(fileName)

  // 🔥 خزن الرابط
  setShop({
    ...shop,
    logo_url: publicUrl.publicUrl
  })
}


async function loadShop(){

const { data: shopData } = await supabase
.from("shops")
.select("*")
.eq("shop_id", shopId)
.maybeSingle()
console.log("SHOP:", shopData)

if(!shopData){
console.log("INVALID ID")
setLoading(false)
return
}

setShop(shopData)

const { count } = await supabase
.from("repairs")
.select("*",{ count:"exact", head:true })
.eq("shop_id", shopData.id)

setRepairs(count || 0)

const { data: repairsData } = await supabase
.from("repairs")
.select("device,problem,created_at")
.eq("shop_id", shopData.id)

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

/* 🔥 SAVE */
async function save(){

setSaving(true)

const { error } = await supabase
.from("shops")
.update({
shop_name: shop.shop_name,
email: shop.email,
city: shop.city,
address: shop.address,
phone: shop.phone,
status: shop.status,
profit_pin: shop.profit_pin,
logo_url: shop.logo_url
})
.eq("id", shop.id)


if(error){
alert(error.message)
setSaving(false)
return
}

setSaving(false)
alert("Saved ✅")
}

/* 🔥 BLOCK */
async function blockShop(){

await supabase
.from("shops")
.update({ status:"disabled" })
.eq("id",shop.id)

}

/* 🔥 RESET PASSWORD (placeholder) */
async function resetPassword(){
alert("Reset password logic here (send email)")
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

{/* 🔥 EDITABLE OVERVIEW */}
<div className="grid grid-cols-2 md:grid-cols-3 gap-6">

<Input label="Shop Name" value={shop.shop_name} onChange={(v:any)=>setShop({...shop,shop_name:v})}/>
<Input label="Email" value={shop.email} onChange={(v:any)=>setShop({...shop,email:v})}/>
<Input label="City" value={shop.city} onChange={(v:any)=>setShop({...shop,city:v})}/>
<Input label="Address" value={shop.address || ""} onChange={(v:any)=>setShop({...shop,address:v})}/>
<Input label="Phone" value={shop.phone || ""} onChange={(v:any)=>setShop({...shop,phone:v})}/>
<Input label="Profit PIN" value={shop.profit_pin || ""} onChange={(v:any)=>setShop({...shop, profit_pin:v})}/>
<div>
  <p className="text-xs text-slate-400 mb-1">Logo</p>

  <input
    type="file"
    accept="image/*"
    onChange={uploadLogo}
    className="w-full text-sm"
  />

  {shop.logo_url && (
    <img
      src={shop.logo_url}
      className="mt-3 h-16 object-contain"
    />
  )}
</div>
<div>
<p className="text-xs text-slate-400 mb-1">Status</p>
<select
value={shop.status}
onChange={(e)=>setShop({...shop,status:e.target.value})}
className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
>
<option value="active">Active</option>
<option value="pending">Pending</option>
<option value="disabled">Disabled</option>
</select>
</div>

</div>

{/* ACTIONS */}
<div className="flex gap-3">

<button
onClick={save}
className="px-6 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-500"
>
{saving ? "Saving..." : "Save Changes"}
</button>

<button
onClick={blockShop}
className="px-6 py-2 bg-red-600 rounded-xl hover:bg-red-500"
>
Block Shop
</button>

<button
onClick={resetPassword}
className="px-6 py-2 bg-yellow-600 rounded-xl hover:bg-yellow-500"
>
Reset Password
</button>

</div>

{/* OVERVIEW CARDS */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">

<Card title="Total Repairs" value={repairs} highlight/>
<Card title="Created" value={shop.created_at?.split("T")[0]}/>
<Card title="Status" value={shop.status}/>
<Card title="City" value={shop.city}/>

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
<Line type="monotone" dataKey="repairs" stroke="#6366f1" strokeWidth={3} dot={false}/>
</LineChart>
</ResponsiveContainer>

</div>

{/* ANALYTICS */}
<div className="grid md:grid-cols-2 gap-6">

<div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10">
<h2 className="mb-4 font-semibold">📱 Devices</h2>
{topDevices.map((d,i)=>(
<div key={i} className="flex justify-between py-1">
<span>{d.device}</span>
<span>{d.count}</span>
</div>
))}
</div>

<div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10">
<h2 className="mb-4 font-semibold">⚠️ Problems</h2>
{topProblems.map((p,i)=>(
<div key={i} className="flex justify-between py-1">
<span>{p.problem}</span>
<span>{p.count}</span>
</div>
))}
</div>

</div>

</div>

)

}

/* INPUT */
function Input({label,value,onChange}:any){
return(
<div>
<p className="text-xs text-slate-400 mb-1">{label}</p>
<input
value={value || ""}
onChange={(e)=>onChange(e.target.value)}
className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10"
/>
</div>
)
}

/* CARD */
function Card({title,value,highlight}:any){
return(
<motion.div
whileHover={{ scale:1.05 }}
className={`
p-5 rounded-2xl border border-white/10 bg-slate-900/60
${highlight && "ring-2 ring-indigo-500"}
`}
>
<p className="text-sm text-slate-400">{title}</p>
<p className="text-xl font-bold mt-2">{value}</p>
</motion.div>
)
}