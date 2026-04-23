"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function AdminSubscriptions(){

  const [subs,setSubs] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [search,setSearch] = useState("")

  useEffect(() => {

    const init = async () => {
      await load()
      await checkExpired()
    }

    init()

    const channel = supabase
      .channel("subscriptions-live")
      .on("postgres_changes",{ event:"*", schema:"public", table:"subscriptions" }, load)
      .on("postgres_changes",{ event:"*", schema:"public", table:"shops" }, load)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [])

  async function load(){
    setLoading(true)

    const { data } = await supabase
      .from("subscriptions")
      .select(`
        *,
        shops!fk_sub_shop (
          email,
          shop_name
        )
      `)
      .order("created_at", { ascending: false })

    setSubs(data || [])
    setLoading(false)
  }

  async function checkExpired(){
    const now = new Date().toISOString()

    const { data } = await supabase.from("subscriptions").select("*")

    for(const s of data || []){
      if(s.end_date && s.end_date < now && s.status !== "expired"){
        await supabase.from("subscriptions").update({ status:"expired" }).eq("id",s.id)
        await supabase.from("shops").update({ status:"disabled" }).eq("id",s.shop_id)
      }
    }
  }

  async function changeStatus(id:string, status:string, shop_id:string){

    await supabase.from("subscriptions").update({ status }).eq("id",id)

    setSubs(prev =>
      prev.map(s => s.id === id ? { ...s, status } : s)
    )

    let shopStatus = "disabled"
    if (status === "active") shopStatus = "active"
    if (status === "pending") shopStatus = "pending"

    await supabase.from("shops").update({ status: shopStatus }).eq("id",shop_id)
  }

  async function extend(sub:any){

    const newDate = new Date(sub.end_date || new Date())
    newDate.setMonth(newDate.getMonth() + 1)

    await supabase.from("subscriptions").update({
      end_date: newDate.toISOString(),
      status:"active"
    }).eq("id",sub.id)

    setSubs(prev =>
      prev.map(s =>
        s.id === sub.id
          ? { ...s, status:"active", end_date:newDate.toISOString() }
          : s
      )
    )

    await supabase.from("shops").update({ status:"active" }).eq("id",sub.shop_id)
  }

  // 🔥 FORMAT DATE
  const formatDate = (date:any) => {
    if(!date) return "-"
    return new Date(date).toLocaleDateString("en-GB", {
      year:"numeric",
      month:"short",
      day:"numeric"
    })
  }

  const filtered = subs.filter(s =>
    (s.shops?.shop_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.shops?.email || "").toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = subs.reduce((sum,s)=>sum + (Number(s.price)||0),0)
  const active = subs.filter(s=>s.status==="active").length
  const expired = subs.filter(s=>s.status==="expired").length

  return(

    <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 px-3 md:px-0">

      {/* HEADER */}
      <div>
        <h1 className="text-xl md:text-3xl font-bold">
          💰 Subscriptions
        </h1>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Stat title="Revenue" value={`€${totalRevenue}`} />
        <Stat title="Active" value={active} highlight/>
        <Stat title="Expired" value={expired} danger/>
      </div>

       {/* TABLE HEADER (desktop only) */}
      <div className="hidden md:grid grid-cols-6 text-xs text-slate-400 px-4">
        <span>Shop</span>
        <span>Email</span>
        <span>Plan</span>
        <span>Start Date</span>
        <span>End Date</span>
        <span className="text-right">Actions</span>
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {filtered.map(s=>(
          <motion.div
            key={s.id}
            className="bg-slate-900/60 border border-white/10 p-4 rounded-xl"
          >

            {/* MOBILE */}
            <div className="md:hidden space-y-2 text-sm">

              <div className="font-semibold">
                {s.shops?.shop_name}
              </div>

              <div className="text-xs text-slate-400">
                {s.shops?.email}
              </div>

              <div className="flex justify-between text-xs">
                <span>{s.plan}</span>
                <StatusBadge status={s.status}/>
              </div>

              {/* 🔥 DATE */}
              <div className="text-xs text-slate-400">
                {formatDate(s.start_date)} → {formatDate(s.end_date)}
              </div>

              <div className="flex gap-2 pt-2">
                <select
                  value={s.status}
                  onChange={(e)=>changeStatus(s.id,e.target.value,s.shop_id)}
                  className="flex-1 bg-slate-800 p-1 rounded text-xs"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>

                <button
                  onClick={()=>extend(s)}
                  className="px-3 py-1 text-xs bg-green-600 rounded-lg"
                >
                  +1
                </button>
              </div>

            </div>

            {/* DESKTOP */}
            <div className="hidden md:grid grid-cols-6 items-center gap-4">

              <div>
                <p className="font-semibold">{s.shops?.shop_name}</p>
                <p className="text-xs text-slate-400">€{s.price}</p>
              </div>

              <div className="text-xs text-slate-400">
                {s.shops?.email}
              </div>

              <div>{s.plan}</div>

              <div className="text-xs text-slate-400">
                {formatDate(s.start_date)}
              </div>

              <div className="text-xs text-slate-400">
                {formatDate(s.end_date)}
              </div>

              <div className="flex gap-2">
                <select
                  value={s.status}
                  onChange={(e)=>changeStatus(s.id,e.target.value,s.shop_id)}
                  className="bg-slate-800 px-2 py-1 rounded text-xs"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>

                <button
                  onClick={()=>extend(s)}
                  className="px-3 py-1 text-xs bg-green-600 rounded-lg"
                >
                  +1
                </button>
              </div>

            </div>

          </motion.div>
        ))}

      </div>

    </div>
  )
}

/* STAT */
function Stat({title,value,highlight,danger}:any){
  return(
    <div className={`p-4 rounded-xl bg-slate-900 border ${highlight?"ring-2 ring-indigo-500":""} ${danger?"ring-2 ring-red-500":""}`}>
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}

/* STATUS */
function StatusBadge({status}:{status:string}){
  const styles:any = {
    active:"bg-green-500/20 text-green-400",
    pending:"bg-yellow-500/20 text-yellow-400",
    expired:"bg-red-500/20 text-red-400"
  }
  return(
    <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>
      {status}
    </span>
  )
}