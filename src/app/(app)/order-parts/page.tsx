"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import PageWrapper from "@/components/ui/page-wrapper"
import Card from "@/components/ui/card"
import { getLang } from "@/lib/text"

export default function OrderPartsPage(){

  const [items,setItems] = useState<any[]>([])
  const [types,setTypes] = useState<any[]>([])
  const [qualities,setQualities] = useState<any[]>([])

  const [userId,setUserId] = useState<string | null>(null)
  const [lang,setLang] = useState("en")

  // 🔎 FILTER
  const [fDevice,setFDevice] = useState("")
  const [fType,setFType] = useState("")
  const [fQuality,setFQuality] = useState("")
  const [fCapacity,setFCapacity] = useState("")

  // 🌍 LANG
  useEffect(()=> setLang(getLang()), [])

  // 🔑 USER
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      if(data.user) setUserId(data.user.id)
    })
  },[])

  // 📥 LOAD
  useEffect(()=>{
    if(!userId) return

    const load = async ()=>{
      const [s,t,q] = await Promise.all([
        supabase.from("stock_items").select("*").eq("shop_id", userId),
        supabase.from("part_types").select("*"),
        supabase.from("part_quality").select("*")
      ])

      if(s.data) setItems(s.data)
      if(t.data) setTypes(t.data)
      if(q.data) setQualities(q.data)
    }

    load()
  },[userId])

  // 🎯 فقط 0 و 1
  const lowStock = items.filter(i => i.quantity <= 1)

  // 🔎 FILTER LOGIC
  const filtered = lowStock.filter(i=>{
    return (
      (!fDevice || i.device.toLowerCase().includes(fDevice.toLowerCase())) &&
      (!fType || i.type === fType) &&
      (!fQuality || i.quality === fQuality) &&
      (!fCapacity || i.capacity === fCapacity)
    )
  })

  const getTypeLabel = (key:string)=>
    types.find(t=>t.key===key)?.[lang==="de"?"label_de":"label_en"]

  const getQualityLabel = (key:string)=>
    qualities.find(q=>q.key===key)?.[lang==="de"?"label_de":"label_en"]

  return(
    <PageWrapper>

      <div className="space-y-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          📥 {lang==="de"?"Nachbestellung":"Order Parts"}
        </h1>

        {/* 🔎 FILTER */}
        <Card>
          <p className="mb-3 text-sm text-slate-400">
            {lang==="de"?"Filter":"Filter"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

            <input
              placeholder={lang==="de"?"Gerät suchen":"Device"}
              value={fDevice}
              onChange={(e)=>setFDevice(e.target.value)}
              className="bg-white/5 px-2 py-2 rounded-lg"
            />

            <select value={fType} onChange={(e)=>setFType(e.target.value)} className="bg-white/5 px-2 rounded-lg">
              <option value="">All</option>
              {types.map(t=>(
                <option key={t.key} value={t.key}>
                  {lang==="de"?t.label_de:t.label_en}
                </option>
              ))}
            </select>

            <select value={fQuality} onChange={(e)=>setFQuality(e.target.value)} className="bg-white/5 px-2 rounded-lg">
              <option value="">All</option>
              {qualities.map(q=>(
                <option key={q.key} value={q.key}>
                  {lang==="de"?q.label_de:q.label_en}
                </option>
              ))}
            </select>

            <select value={fCapacity} onChange={(e)=>setFCapacity(e.target.value)} className="bg-white/5 px-2 rounded-lg">
              <option value="">All</option>
              {["32GB","64GB","128GB","256GB","512GB","1TB","2TB"].map(c=>(
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

          </div>
        </Card>

        {/* 📦 LIST */}
        <Card>

          <div className="space-y-3">

            {filtered.map(item=>{

              const color =
                item.quantity === 0
                  ? "bg-red-600"
                  : "bg-yellow-500"

              return(
                <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">

                  <div>
                    <p className="font-semibold">{item.device}</p>

                    <p className="text-xs text-slate-400">
                      {getTypeLabel(item.type)} • {getQualityLabel(item.quality)} • {item.capacity}
                    </p>
                  </div>

                  <div className={`px-3 py-1 rounded ${color}`}>
                    {lang==="de"?"Menge":"Qty"}: {item.quantity}
                  </div>

                </div>
              )
            })}

            {filtered.length === 0 && (
              <p className="text-center text-slate-500">
                {lang==="de"?"Alles verfügbar":"All good"}
              </p>
            )}

          </div>

        </Card>

      </div>

    </PageWrapper>
  )
}