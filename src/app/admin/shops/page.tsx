"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AdminShops(){

  const [shops,setShops] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [search,setSearch] = useState("")

  const router = useRouter()

  useEffect(()=>{

    load()

    const channel = supabase
      .channel("shops-live")
      .on(
        "postgres_changes",
        { event:"*", schema:"public", table:"shops" },
        ()=> load()
      )
      .subscribe()

    return ()=>{
      supabase.removeChannel(channel)
    }

  },[])

  async function load(){

    setLoading(true)

    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .order("id",{ ascending:false })

    if(error){
      console.log(error)
      alert(error.message)
      return
    }

    setShops(data || [])
    setLoading(false)
  }

  async function updateStatus(id:string,status:string){

    const { error } = await supabase
      .from("shops")
      .update({ status })
      .eq("id",id)

    if(error){
      alert(error.message)
      return
    }

    load()
  }

  const filtered = shops.filter(s =>
    `${s.shop_name} ${s.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return(

    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">

        <div>
          <h1 className="text-3xl font-bold">
            🏪 Shops Control Center
          </h1>
          <p className="text-slate-400 text-sm">
            Manage all shops & permissions
          </p>
        </div>

        <div className="text-sm text-slate-400">
          {filtered.length} Shops
        </div>

      </div>

      {/* SEARCH */}
      <div className="relative">
        <input
          placeholder="Search shop..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="
            w-full bg-slate-900/60 backdrop-blur-xl
            border border-white/10
            px-4 py-3 rounded-xl
            focus:ring-2 focus:ring-indigo-500 outline-none
          "
        />
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-3 px-4 text-xs text-slate-400">
        <span>Shop</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            No shops found
          </div>
        ) : (

          filtered.map(shop=>{

            return(
              <motion.div
                key={shop.id}
                whileHover={{ scale: 1.02 }}
                className="
                  grid grid-cols-3 items-center
                  bg-slate-900/60 backdrop-blur-xl
                  border border-white/10
                  p-4 rounded-xl
                  hover:border-indigo-500
                  transition
                "
              >

                {/* INFO */}
                <div
                  onClick={()=>router.push(`/admin/shops/${shop.shop_id}`)}
                  className="cursor-pointer"
                >
                  <p className="font-semibold">
                    {shop.shop_name || "Unnamed Shop"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {shop.email}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  <StatusBadge status={shop.status} />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">

                  <button
                    onClick={()=>router.push(`/admin/shops/${shop.shop_id}`)}
                    className="px-3 py-1 text-xs bg-slate-800 rounded-lg hover:bg-indigo-600"
                  >
                    View
                  </button>

                  <select
                    value={shop.status}
                    onChange={(e)=>updateStatus(shop.id,e.target.value)}
                    className="bg-slate-800 border border-white/10 px-2 py-1 rounded text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>

                </div>

              </motion.div>
            )
          })

        )}

      </div>

    </div>
  )
}

/* STATUS BADGE */
function StatusBadge({status}:{status:string}){

  const styles:any = {
    active: "bg-green-500/20 text-green-400 border border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    disabled: "bg-red-500/20 text-red-400 border border-red-500/30"
  }

  return(
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || ""}`}>
      {status}
    </span>
  )
}