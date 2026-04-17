"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"

const stages = [
  "received",
  "pending-answer",
  "pending-parts",
  "ready",
  "delivered"
]

export default function AdminRepairs(){

  const [shops,setShops] = useState<any[]>([])
  const [selectedShop,setSelectedShop] = useState<any>(null)

  const [repairs,setRepairs] = useState<any[]>([])
  const [allRepairs,setAllRepairs] = useState<any[]>([])

  const [search,setSearch] = useState("")
  const [priority,setPriority] = useState("all")

  const [dragged,setDragged] = useState<any>(null)
  const [view,setView] = useState<any>(null)

  // ✅ FIX: منع تكرار realtime
  const channelRef = useRef<any>(null)

  useEffect(()=>{
    init()
    loadRepairs()

    return () => {
      // ✅ CLEANUP
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }

  },[])

  async function init(){
    await loadShops()
    setupRealtime()
  }

  async function loadShops(){
    const { data } = await supabase
      .from("shops")
      .select("*")

    setShops(data || [])
  }

  async function loadRepairs(shopId?:string){

    let query = supabase
      .from("repairs")
      .select("*")

    if(shopId){
      query = query.eq("shop_id", shopId)
    }

    const { data } = await query

    if(!shopId){
      setAllRepairs(data || [])
    }

    setRepairs(data || [])
  }

  // ✅ REALTIME (FIXED)
  function setupRealtime(){

  // ✅ احذف أي channel قديم بنفس الاسم
  const existing = supabase.getChannels().find(c => c.topic === "realtime:repairs-max")

  if (existing) {
    supabase.removeChannel(existing)
  }

  const channel = supabase
    .channel("repairs-max")
    .on(
      "postgres_changes",
      { event:"*", schema:"public", table:"repairs" },
      payload => {

        setRepairs(prev => {
          let updated = [...prev]

          if(payload.eventType === "INSERT"){
            updated.unshift(payload.new)
          }

          if(payload.eventType === "UPDATE"){
            updated = updated.map(r =>
              r.id === payload.new.id ? payload.new : r
            )
          }

          if(payload.eventType === "DELETE"){
            updated = updated.filter(r=>r.id !== payload.old.id)
          }

          return updated
        })

        setAllRepairs(prev => {
          let updated = [...prev]

          if(payload.eventType === "INSERT"){
            updated.unshift(payload.new)
          }

          if(payload.eventType === "UPDATE"){
            updated = updated.map(r =>
              r.id === payload.new.id ? payload.new : r
            )
          }

          if(payload.eventType === "DELETE"){
            updated = updated.filter(r=>r.id !== payload.old.id)
          }

          return updated
        })
      }
    )
    .subscribe()

  channelRef.current = channel
}

  function onDragStart(repair:any){
    setDragged(repair)
  }

  async function onDrop(stage:string){

    if(!dragged) return

    setRepairs(prev =>
      prev.map(r =>
        r.id === dragged.id ? {...r, status:stage} : r
      )
    )

    await supabase
      .from("repairs")
      .update({ status:stage })
      .eq("id",dragged.id)

    setDragged(null)
  }

  async function deleteRepair(id:string){

    if(!confirm("Delete?")) return

    setRepairs(prev => prev.filter(r=>r.id !== id))
    setAllRepairs(prev => prev.filter(r=>r.id !== id))

    await supabase.from("repairs").delete().eq("id",id)
  }

  async function setPriorityLevel(id:string, level:string){

    setRepairs(prev =>
      prev.map(r =>
        r.id === id ? {...r, priority:level} : r
      )
    )

    await supabase
      .from("repairs")
      .update({ priority:level })
      .eq("id",id)
  }

  const filtered = repairs.filter(r=>{

    const customer = r.customer || r.customer_name || ""
    const device = r.device || r.device_model || ""

    const matchSearch =
      `${customer} ${device}`
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchPriority =
      priority === "all" || r.priority === priority

    return matchSearch && matchPriority
  })

  return(

    <div className="max-w-7xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">
        ⚡ Repairs Command Center
      </h1>

      {selectedShop && (
        <p className="text-sm text-gray-400">
          Showing: {selectedShop.shop_name}
        </p>
      )}

      {/* FILTER */}
      <div className="flex gap-4 flex-wrap">

        <input
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="bg-black/40 px-3 py-2 rounded"
        />

        <select
          value={priority}
          onChange={(e)=>setPriority(e.target.value)}
          className="bg-black/40 px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>

      </div>

      {/* SHOPS */}
      {!selectedShop && (

        <div className="grid md:grid-cols-3 gap-4">

          {shops.map(shop => {

            const count = allRepairs.filter(
              r => r.shop_id === shop.id
            ).length

            return (
              <div
                key={shop.id}
                onClick={()=>{
                  setSelectedShop(shop)
                  loadRepairs(shop.id)
                }}
                className="bg-[#020617] p-6 rounded-xl border border-white/10 cursor-pointer hover:bg-black/40 transition"
              >

                <h3 className="text-lg font-semibold">
                  {shop.shop_name}
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  {count} Repairs
                </p>

              </div>
            )
          })}

        </div>

      )}

      {/* BOARD */}
      {selectedShop && (
        <div className="grid grid-cols-5 gap-4">

          {stages.map(stage=>{

            const items = filtered.filter(
              r =>
                r.status
                  ?.toLowerCase()
                  .replace(/\s/g, "-")
                  .trim() === stage
            )

            return(

              <div
                key={stage}
                onDragOver={(e)=>e.preventDefault()}
                onDrop={()=>onDrop(stage)}
                className="bg-[#020617] p-4 rounded-xl min-h-[400px]"
              >

                <h3 className="mb-4 font-semibold">
                  {stage.replace("-", " ")} ({items.length})
                </h3>

                <div className="space-y-3">

                  {items.map(r=>(
                    <div
                      key={r.id}
                      draggable
                      onDragStart={()=>onDragStart(r)}
                      className="bg-black/40 p-3 rounded cursor-grab"
                    >

                      <p className="text-xs text-blue-400">
                        {r.customer}
                      </p>

                      <p className="text-xs text-gray-400">
                        {r.device}
                      </p>

                      <select
                        value={r.priority || "normal"}
                        onChange={(e)=>setPriorityLevel(r.id,e.target.value)}
                        className="mt-2 w-full text-xs bg-black/60"
                      >
                        <option value="high">🔥 High</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                      </select>

                      <div className="flex justify-between mt-2 text-xs">

                        <button
                          onClick={()=>setView(r)}
                          className="text-indigo-400"
                        >
                          View
                        </button>

                        <button
                          onClick={()=>deleteRepair(r.id)}
                          className="text-red-400"
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

            )
          })}

        </div>
      )}

      {/* MODAL */}
      {view && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-[#020617] p-6 rounded-xl w-[500px] space-y-2">

            <h3 className="font-bold">Details</h3>

            <p>{view.customer}</p>
            <p>{view.phone}</p>
            <p>{view.device}</p>
            <p>{view.problem}</p>
            <p>{view.status}</p>

            <button
              onClick={()=>setView(null)}
              className="mt-3 text-gray-400"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  )
}