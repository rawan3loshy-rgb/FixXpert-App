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

  const channelRef = useRef<any>(null)

  useEffect(()=>{
    init()
    loadRepairs()

    return () => {
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
    const { data } = await supabase.from("shops").select("*")
    setShops(data || [])
  }

  async function loadRepairs(shopId?:string){
    let query = supabase.from("repairs").select("*")

    if(shopId){
      query = query.eq("shop_id", shopId)
    }

    const { data } = await query

    if(!shopId){
      setAllRepairs(data || [])
    }

    setRepairs(data || [])
  }

  function setupRealtime(){
    const existing = supabase.getChannels().find(c => c.topic === "realtime:repairs-max")
    if (existing) supabase.removeChannel(existing)

    const channel = supabase
      .channel("repairs-max")
      .on("postgres_changes",{ event:"*", schema:"public", table:"repairs" }, payload => {

        const updateList = (prev:any[]) => {
          let updated = [...prev]

          if(payload.eventType === "INSERT") updated.unshift(payload.new)
          if(payload.eventType === "UPDATE") {
            updated = updated.map(r => r.id === payload.new.id ? payload.new : r)
          }
          if(payload.eventType === "DELETE") {
            updated = updated.filter(r=>r.id !== payload.old.id)
          }

          return updated
        }

        setRepairs(updateList)
        setAllRepairs(updateList)
      })
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

    await supabase.from("repairs").update({ status:stage }).eq("id",dragged.id)
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

    await supabase.from("repairs").update({ priority:level }).eq("id",id)
  }

  const filtered = repairs.filter(r=>{
    const customer = r.customer || ""
    const device = r.device || ""

    const matchSearch =
      `${customer} ${device}`.toLowerCase().includes(search.toLowerCase())

    const matchPriority =
      priority === "all" || r.priority === priority

    return matchSearch && matchPriority
  })

  return(

    <div className="max-w-7xl mx-auto space-y-6 px-3 md:px-0">

      <h1 className="text-xl md:text-3xl font-bold">
        ⚡ Repairs
      </h1>

      {/* FILTER */}
      <div className="flex flex-col md:flex-row gap-3">

        <input
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="bg-slate-900 p-2 rounded w-full"
        />

        <select
          value={priority}
          onChange={(e)=>setPriority(e.target.value)}
          className="bg-slate-900 p-2 rounded"
        >
          <option value="all">All</option>
          <option value="high">🔥 High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>

      </div>

      {/* SHOPS */}
      {!selectedShop && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

          {shops.map(shop => {
            const count = allRepairs.filter(r => r.shop_id === shop.id).length

            return (
              <div
                key={shop.id}
                onClick={()=>{
                  setSelectedShop(shop)
                  loadRepairs(shop.id)
                }}
                className="bg-slate-900 p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-indigo-500/10"
              >
                <h3 className="font-semibold">{shop.shop_name}</h3>
                <p className="text-xs text-slate-400 mt-1">{count} Repairs</p>
              </div>
            )
          })}

        </div>
      )}

      {/* 📱 MOBILE LIST */}
      {selectedShop && (
        <div className="md:hidden space-y-3">

          {filtered.map(r => (
            <div key={r.id} className="bg-slate-900 p-3 rounded-xl border border-white/10">

              <p className="font-semibold">{r.customer}</p>
              <p className="text-xs text-slate-400">{r.device}</p>

              <div className="flex justify-between items-center mt-2">

                <select
                  value={r.status}
                  onChange={(e)=>onDrop(e.target.value)}
                  className="bg-slate-800 text-xs p-1 rounded"
                >
                  {stages.map(s=>(
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={r.priority || "normal"}
                  onChange={(e)=>setPriorityLevel(r.id,e.target.value)}
                  className="bg-slate-800 text-xs p-1 rounded"
                >
                  <option value="high">🔥</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>

              </div>

              <div className="flex justify-between mt-2 text-xs">
                <button onClick={()=>setView(r)} className="text-indigo-400">
                  View
                </button>
                <button onClick={()=>deleteRepair(r.id)} className="text-red-400">
                  Delete
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

      {/* 💻 DESKTOP BOARD */}
      {selectedShop && (
        <div className="hidden md:grid grid-cols-5 gap-4">

          {stages.map(stage=>{

            const items = filtered.filter(r => r.status === stage)

            return(
              <div
                key={stage}
                onDragOver={(e)=>e.preventDefault()}
                onDrop={()=>onDrop(stage)}
                className="bg-slate-900 p-4 rounded-xl min-h-[400px]"
              >

                <h3 className="mb-4 text-sm font-semibold">
                  {stage} ({items.length})
                </h3>

                <div className="space-y-2">

                  {items.map(r=>(
                    <div
                      key={r.id}
                      draggable
                      onDragStart={()=>onDragStart(r)}
                      className="bg-slate-800 p-2 rounded cursor-grab"
                    >
                      <p className="text-xs text-blue-400">{r.customer}</p>
                      <p className="text-xs text-slate-400">{r.device}</p>

                      <div className="flex justify-between mt-2 text-xs">
                        <button onClick={()=>setView(r)} className="text-indigo-400">
                          View
                        </button>
                        <button onClick={()=>deleteRepair(r.id)} className="text-red-400">
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">

          <div className="bg-slate-900 p-4 md:p-6 rounded-xl w-full max-w-md space-y-2">

            <h3 className="font-bold">Details</h3>

            <p>{view.customer}</p>
            <p>{view.phone}</p>
            <p>{view.device}</p>
            <p>{view.problem}</p>
            <p>{view.status}</p>

            <button
              onClick={()=>setView(null)}
              className="mt-3 text-slate-400"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  )
}