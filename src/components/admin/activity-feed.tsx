"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ActivityFeed(){

const [activities,setActivities] = useState<any[]>([])

useEffect(()=>{

loadInitial()

/* realtime repairs */

const repairChannel = supabase
.channel("repairs-feed")
.on(
"postgres_changes",
{
event:"INSERT",
schema:"public",
table:"repairs"
},
(payload)=>{
addActivity({
text:`Repair created #${payload.new.order_number}`,
date:payload.new.created_at
})
}
)
.subscribe()

/* realtime shops */

const shopChannel = supabase
.channel("shops-feed")
.on(
"postgres_changes",
{
event:"INSERT",
schema:"public",
table:"shops"
},
(payload)=>{
addActivity({
text:`New shop registered: ${payload.new.shop_name}`,
date:payload.new.created_at
})
}
)
.subscribe()

return ()=>{

supabase.removeChannel(repairChannel)
supabase.removeChannel(shopChannel)

}

},[])


async function loadInitial(){

const { data: repairs } = await supabase
.from("repairs")
.select("order_number,created_at")
.order("created_at",{ascending:false})
.limit(5)

const { data: shops } = await supabase
.from("shops")
.select("shop_name,created_at")
.order("created_at",{ascending:false})
.limit(5)

const feed:any[] = []

repairs?.forEach((r:any)=>{
feed.push({
text:`Repair created #${r.order_number}`,
date:r.created_at
})
})

shops?.forEach((s:any)=>{
feed.push({
text:`New shop registered: ${s.shop_name}`,
date:s.created_at
})
})

feed.sort((a,b)=>
new Date(b.date).getTime() -
new Date(a.date).getTime()
)

setActivities(feed.slice(0,8))

}

function addActivity(activity:any){

setActivities(prev=>[
activity,
...prev
].slice(0,8))

}

return(

<div className="bg-slate-800 p-6 rounded-xl">

<h2 className="text-lg font-semibold mb-4">
Live Platform Activity
</h2>

<div className="space-y-3">

{activities.map((a,index)=>(

<div
key={index}
className="border-b border-slate-700 pb-2 text-sm"
>

<p>{a.text}</p>

<p className="text-xs text-gray-500">
{a.date.split("T")[0]}
</p>

</div>

))}

</div>

</div>

)

}