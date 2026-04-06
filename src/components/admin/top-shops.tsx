"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function TopShops(){

const [shops,setShops] = useState<any[]>([])

useEffect(()=>{
load()
},[])

async function load(){

const { data } = await supabase
.from("top_shops")
.select("*")
.limit(5)

setShops(data || [])

}

return(

<div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

<h2 className="text-lg font-semibold mb-4">
Top Shops
</h2>

<div className="space-y-3">

{shops.map((s:any,index)=>(
<Link key={index} href={`/admin/shops/${s.shop_id}`}>

<div className="flex justify-between items-center border-b border-slate-700 pb-2 hover:bg-slate-700 p-2 rounded cursor-pointer transition">

<span className="font-medium">
{s.shop_name}
</span>

<span className="text-blue-400 text-sm">
{s.repairs} repairs
</span>

</div>

</Link>
))}

</div>

</div>

)

}