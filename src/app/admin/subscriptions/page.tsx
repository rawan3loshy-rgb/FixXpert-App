"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function AdminSubscriptions(){

  const [subs,setSubs] = useState<any[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    load()
    checkExpired()
  },[])

  async function load(){

    setLoading(true)

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at",{ascending:false})

    if(error){
      console.log(error)
      alert(error.message)
      return
    }

    setSubs(data || [])
    setLoading(false)
  }

  async function checkExpired(){

    const now = new Date().toISOString()

    const { data } = await supabase
      .from("subscriptions")
      .select("*")

    for(const s of data || []){

      if(s.end_date && s.end_date < now && s.status !== "expired"){

        await supabase
          .from("subscriptions")
          .update({ status:"expired" })
          .eq("id",s.id)

        await supabase
          .from("shops")
          .update({ status:"disabled" })
          .eq("id",s.shop_id)
      }
    }
  }

  async function changeStatus(id:string, status:string, shop_id:string){

    const { error } = await supabase
      .from("subscriptions")
      .update({ status })
      .eq("id",id)

    if(error){
      alert(error.message)
      return
    }

    await supabase
      .from("shops")
      .update({
        status: status === "active" ? "active" : "disabled"
      })
      .eq("id",shop_id)

    load()
  }

  async function extend(sub:any){

    const newDate = new Date(sub.end_date || new Date())
    newDate.setMonth(newDate.getMonth() + 1)

    const { error } = await supabase
      .from("subscriptions")
      .update({
        end_date: newDate.toISOString(),
        status:"active"
      })
      .eq("id",sub.id)

    if(error){
      alert(error.message)
      return
    }

    await supabase
      .from("shops")
      .update({ status:"active" })
      .eq("id",sub.shop_id)

    load()
  }

  // 🔥 KPIs
  const totalRevenue = subs.reduce((sum,s)=>sum + (Number(s.price)||0),0)
  const active = subs.filter(s=>s.status==="active").length
  const expired = subs.filter(s=>s.status==="expired").length

  return(

    <div className="max-w-7xl mx-auto space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          💰 Subscriptions Control Center
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Billing system & revenue management
        </p>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-3 gap-6">

        <Stat title="Revenue" value={`€${totalRevenue}`} />
        <Stat title="Active Plans" value={active} highlight/>
        <Stat title="Expired" value={expired} danger/>

      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-4 text-xs text-slate-400 px-4">
        <span>Shop</span>
        <span>Plan</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading...</p>
        ) : subs.length === 0 ? (
          <p className="text-slate-500 text-center py-10">
            No subscriptions
          </p>
        ) : (

          subs.map(s=>{

            return(
              <motion.div
                key={s.id}
                whileHover={{ scale:1.02 }}
                className="
                  grid grid-cols-4 items-center
                  bg-slate-900/60 backdrop-blur-xl
                  border border-white/10
                  p-4 rounded-xl
                  hover:border-indigo-500
                  transition
                "
              >

                {/* INFO */}
                <div>
                  <p className="font-semibold">
                    {s.shop_name || "Unknown Shop"}
                  </p>
                  <p className="text-xs text-slate-400">
                    €{s.price}
                  </p>
                </div>

                {/* PLAN */}
                <div className="text-sm text-slate-300">
                  {s.plan}
                </div>

                {/* STATUS */}
                <div>
                  <StatusBadge status={s.status} />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">

                  <select
                    value={s.status}
                    onChange={(e)=>changeStatus(s.id,e.target.value,s.shop_id)}
                    className="bg-slate-800 border border-white/10 px-2 py-1 rounded text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                  </select>

                  <button
                    onClick={()=>extend(s)}
                    className="px-3 py-1 text-xs bg-green-600 rounded-lg hover:bg-green-500"
                  >
                    +1 Month
                  </button>

                </div>

              </motion.div>
            )
          })

        )}

      </div>

    </div>
  )
}

/* STAT */
function Stat({title,value,highlight,danger}:any){
  return(
    <motion.div
      whileHover={{ scale:1.05 }}
      className={`
        p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl
        border border-white/10 shadow-lg
        ${highlight && "ring-2 ring-indigo-500"}
        ${danger && "ring-2 ring-red-500"}
      `}
    >
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </motion.div>
  )
}

/* STATUS BADGE */
function StatusBadge({status}:{status:string}){

  const styles:any = {
    active:"bg-green-500/20 text-green-400 border border-green-500/30",
    pending:"bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    expired:"bg-red-500/20 text-red-400 border border-red-500/30"
  }

  return(
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  )
}