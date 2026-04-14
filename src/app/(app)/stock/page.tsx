"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import Card from "@/components/ui/card"
import PageWrapper from "@/components/ui/page-wrapper"
import { getLang } from "@/lib/text"

type StockItem = {
  id: string
  device: string
  type: string
  quality: string
  capacity: string // ✅ NEW
  quantity: number
  shop_id: string
}

type Device = {
  id: string
  brand: string
  model: string
}

type PartType = {
  key: string
  label_en: string
  label_de: string
}

type PartQuality = {
  key: string
  label_en: string
  label_de: string
}

export default function StockPage() {

  const [items, setItems] = useState<StockItem[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [types, setTypes] = useState<PartType[]>([])
  const [qualities, setQualities] = useState<PartQuality[]>([])

  const [search, setSearch] = useState("")
  const [selectedDevice, setSelectedDevice] = useState("")
  const [highlight, setHighlight] = useState(0)
  const [open, setOpen] = useState(false)

  const [type, setType] = useState("")
  const [quality, setQuality] = useState("")
  const [capacity, setCapacity] = useState("") // ✅ NEW
  const [qty, setQty] = useState(1)

  // ✅ FILTER STATES
  const [fDevice, setFDevice] = useState("")
  const [fType, setFType] = useState("")
  const [fQuality, setFQuality] = useState("")
  const [fCapacity, setFCapacity] = useState("")
  const [fQty, setFQty] = useState("")

  const [userId, setUserId] = useState<string | null>(null)
  const [lang, setLang] = useState("en")

  const wrapperRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [draftItems, setDraftItems] = useState<StockItem[]>([])
  const firstLoad = useRef(true)
  

  // ✅ CAPACITY OPTIONS
  const capacities = [
    "32GB","64GB","128GB","256GB","512GB","1TB","2TB"
  ]

  // 🌍 LANG
  useEffect(() => setLang(getLang()), [])

  // 🔑 USER
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  // 📥 LOAD
  useEffect(() => {
    if (!userId) return

    const load = async () => {
      const [s, d, t, q] = await Promise.all([
        supabase.from("stock_items").select("*").eq("shop_id", userId),
        supabase.from("devices").select("*"),
        supabase.from("part_types").select("*"),
        supabase.from("part_quality").select("*")
      ])

      if (s.data) setItems(s.data)
      if (d.data) setDevices(d.data)
      if (t.data) setTypes(t.data)
      if (q.data) setQualities(q.data)

     
    }

    load()
  }, [userId])

  // 🔍 SEARCH
  const filteredDevices = devices.filter(d =>
    `${d.brand} ${d.model}`.toLowerCase().includes(search.toLowerCase())
  )

  // ✅ FILTER LOGIC (NEW)
  const filteredItems = items.filter(i => {

    return (
      (!fDevice || i.device.toLowerCase().includes(fDevice.toLowerCase())) &&
      (!fType || i.type === fType) &&
      (!fQuality || i.quality === fQuality) &&
      (!fCapacity || i.capacity === fCapacity) &&
      (!fQty || i.quantity === Number(fQty))
    )
  })

  // 🔥 CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e: any) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // 🔥 KEYBOARD
  const handleKeyDown = (e: any) => {

    if (!open) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlight(h => Math.min(h + 1, filteredDevices.length - 1))
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlight(h => Math.max(h - 1, 0))
    }

    if (e.key === "Enter") {
      e.preventDefault()

      const d = filteredDevices[highlight]
      if (!d) return

      const label = `${d.brand} ${d.model}`
      setSelectedDevice(label)
      setSearch(label)
      setOpen(false)
    }
  }

  // 🔥 AUTO SCROLL
  useEffect(() => {
    const el = itemRefs.current[highlight]
    if (el) el.scrollIntoView({ block: "nearest" })
  }, [highlight])


  // ➕ ADD
  const addItem = () => {
  if (!selectedDevice) return

  const newItem: StockItem = {
    id: Math.random().toString(),
    device: selectedDevice,
    type,
    quality,
    capacity,
    quantity: qty,
    shop_id: userId || ""
  }

  setDraftItems(prev => [...prev, newItem])

  // reset
  setSearch("")
  setSelectedDevice("")
  setType("")
  setQuality("")
  setCapacity("")
  setQty(1)
  }

  const increase = async (item: StockItem) => {
    const newQty = item.quantity + 1
    setItems(p => p.map(i => i.id === item.id ? { ...i, quantity: newQty } : i))
    await supabase.from("stock_items").update({ quantity: newQty }).eq("id", item.id)
  }

  const decrease = async (item: StockItem) => {
    const newQty = Math.max(0, item.quantity - 1)
    setItems(p => p.map(i => i.id === item.id ? { ...i, quantity: newQty } : i))
    await supabase.from("stock_items").update({ quantity: newQty }).eq("id", item.id)
  }

  const getTypeLabel = (key:string) =>
    types.find(t=>t.key===key)?.[lang==="de"?"label_de":"label_en"]

  const getQualityLabel = (key:string) =>
    qualities.find(q=>q.key===key)?.[lang==="de"?"label_de":"label_en"]

    const getQtyColor = (qty:number) => {
  if (qty === 0) return "!bg-red-500/80 text-white backdrop-blur"
  if (qty === 1) return "!bg-yellow-400/80 text-black backdrop-blur"
  return "!bg-green-500/80 text-white backdrop-blur"
}
  return (
    <PageWrapper>

      <div className="space-y-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          📦 {lang==="de"?"Lagerverwaltung":"Stock Management"}
        </h1>

        {/* ================= ADD ================= */}
        <Card>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">

            {/* SEARCH */}
            <div ref={wrapperRef} className="relative md:col-span-2">

              <input
                value={search}
                onFocus={()=>setOpen(true)}
                onKeyDown={handleKeyDown}
                onChange={(e)=>{
                  setSearch(e.target.value)
                  setOpen(true)
                  setHighlight(0)
                }}
                placeholder={lang==="de"?"Gerät suchen":"Search device"}
                className="w-full px-3 py-2 bg-white/5 rounded-lg"
              />

              {open && search && (
                <div className="absolute w-full bg-slate-900 mt-2 rounded-xl max-h-60 overflow-auto z-50">
                  {filteredDevices.slice(0,20).map((d,i)=>{
                    const label = `${d.brand} ${d.model}`

                    return (
                      <div
                        ref={(el) => {itemRefs.current[i] = el}}
                        key={d.id}
                        onClick={()=>{
                          setSelectedDevice(label)
                          setSearch(label)
                          setOpen(false)
                        }}
                        className={`p-2 cursor-pointer ${
                          i===highlight
                            ? "bg-indigo-600 text-white"
                            : "hover:bg-white/10"
                        }`}
                      >
                        {label}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <select
            value={type}
            onChange={(e)=>setType(e.target.value)}
            className="bg-white/5 rounded-lg px-3 text-slate-300"
           > 
           <option value="" disabled hidden>
           {lang==="de" ? "Typ auswählen" : "Select type"}
           
           </option>

           {types.map(t=>(
            <option key={t.key} value={t.key}>
           {lang==="de"?t.label_de:t.label_en}
           </option>
           ))}
          </select>

            <select value={quality} onChange={(e)=>setQuality(e.target.value)} className="bg-white/5 rounded-lg px-2">
              <option value="" disabled hidden>
                {lang==="de" ? "Qualität auswählen" : "Select quality"}
              </option>
              {qualities.map(q=>(
                <option key={q.key} value={q.key}>
                  {lang==="de"?q.label_de:q.label_en}
                </option>
              ))}
            </select>

            {/* ✅ CAPACITY */}
            <select value={capacity} 
             onChange={(e)=>setCapacity(e.target.value)}
             className="bg-white/5 px-2 rounded-lg">
              <option value="" disabled hidden>
               {lang==="de" ? "Speicher auswählen" : "Select capacity"}
              </option>
              {capacities.map(c=>(
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              type="number"
              value={qty}
              onChange={(e)=>setQty(Number(e.target.value))}
              className="bg-white/5 rounded-lg px-2"
            />

          </div>

          <button
           onClick={addItem}
            disabled={!selectedDevice || !type || !quality}
            className={`mt-4 w-full py-2 rounded-xl text-white font-semibold ${
            (!selectedDevice || !type || !quality)
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-indigo-600"
            }`}
           >
            {lang==="de"?"Hinzufügen":"Add"}
          </button>
          {draftItems.length > 0 && (
          <div className="mt-4 space-y-2">

          {draftItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-white/5 p-2 rounded-lg">

         <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.7fr_0.3fr] gap-2 w-full items-center">

           {/* DEVICE */}
           <div className="text-sm bg-white/5 px-2 py-1 rounded">
           {item.device}
            </div>

         {/* TYPE */}
          <select
          value={item.type}
         onChange={(e)=>{
          const value = e.target.value
          setDraftItems(prev =>
          prev.map((d,i)=> i===index ? {...d, type:value} : d)
          )
         }}
         className="bg-white/5 px-2 py-1 rounded"
          >
          {types.map(t=>(
         <option key={t.key} value={t.key}>
         {lang==="de"?t.label_de:t.label_en}
          </option>
         ))}
          </select>

          {/* QUALITY */}
         <select
         value={item.quality}
          onChange={(e)=>{
         const value = e.target.value
         setDraftItems(prev =>
          prev.map((d,i)=> i===index ? {...d, quality:value} : d)
         )
         }}
         className="bg-white/5 px-2 py-1 rounded"
         >
          {qualities.map(q=>(
          <option key={q.key} value={q.key}>
          {lang==="de"?q.label_de:q.label_en}
          </option>
         ))}
         </select>

         {/* CAPACITY */}
         <select
         value={item.capacity}
          onChange={(e)=>{
          const value = e.target.value
          setDraftItems(prev =>
          prev.map((d,i)=> i===index ? {...d, capacity:value} : d)
          )
          }}
          className="bg-white/5 px-2 py-1 rounded"
          >
          {capacities.map(c=>(
         <option key={c}>{c}</option>
          ))}
         </select>

         {/* QTY */}
         <input
          type="number"
          value={item.quantity}
          onChange={(e)=>{
          const value = Number(e.target.value)
          setDraftItems(prev =>
          prev.map((d,i)=> i===index ? {...d, quantity:value} : d)
          )
         }}
         className="bg-white/5 px-2 py-1 rounded text-center"
         />



         </div>

          {/* ❌ DELETE */}
          <button
          onClick={() => {
            setDraftItems(prev => prev.filter((_, i) => i !== index))
          }}
          className="text-red-400 hover:text-red-600"
         >
          ✕
          </button>

          </div>
           ))}

           </div>
           )}
           {draftItems.length > 0 && (
          <button
           onClick={async () => {

            if (!userId) return

           for (const item of draftItems) {

            const { data: existing } = await supabase
           .from("stock_items")
           .select("*")
           .match({
            device: item.device,
            type: item.type,
            quality: item.quality,
            capacity: item.capacity,
            shop_id: userId
           })
           .maybeSingle()

           if (existing) {

           const newQty = existing.quantity + item.quantity

           await supabase
            .from("stock_items")
            .update({ quantity: newQty })
            .eq("id", existing.id)

           // تحديث UI
           setItems(prev =>
            prev.map(i =>
              i.id === existing.id ? { ...i, quantity: newQty } : i
            )
           )

           } else {

           const { data } = await supabase
            .from("stock_items")
            .insert({
              device: item.device,
              type: item.type,
              quality: item.quality,
              capacity: item.capacity,
              quantity: item.quantity,
              shop_id: userId
            })
            .select()
            .single()

           if (data) {
            setItems(prev => [data, ...prev])
           }
           }
           }

            // تنظيف draft
            setDraftItems([])

           }}
           className="mt-3 w-full py-2 bg-green-600 rounded-xl text-white font-semibold"
           >
           {lang==="de" ? "Alle Hinzufügen" : "Add All"}
          </button>
          )}
        </Card>

        {/* ================= FILTER ================= */}
        <Card>

          <h2 className="text-sm mb-3 text-slate-400">
            {lang==="de"?"Filter":"Filter"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

            <input value={fDevice} onChange={(e)=>setFDevice(e.target.value)} placeholder={lang==="de"?"Gerät suchen":"Search device"} className="bg-white/5 px-2 rounded-lg"/>

            <select value={fType} onChange={(e)=>setFType(e.target.value)} className="bg-white/5 rounded-lg px-2">
              <option value="">All</option>
              {types.map(t=>(
                <option key={t.key} value={t.key}>
                  {lang==="de"?t.label_de:t.label_en}
                </option>
              ))}
            </select>

            <select value={fQuality} onChange={(e)=>setFQuality(e.target.value)} className="bg-white/5 rounded-lg px-2">
              <option value="">All</option>
              {qualities.map(q=>(
                <option key={q.key} value={q.key}>
                  {lang==="de"?q.label_de:q.label_en}
                </option>
              ))}
            </select>

            <select value={fCapacity} onChange={(e)=>setFCapacity(e.target.value)} 
             className="bg-white/5 rounded-lg px-2">
              <option value="">All</option>
              {capacities.map(c=>(
                <option key={c}>{c}</option>
              ))}
            </select>

            <input type="number" value={fQty} onChange={(e)=>setFQty(e.target.value)} placeholder="Qty" className="bg-white/5 px-2 rounded-lg"/>

          </div>

        </Card>

        {/* ================= LIST ================= */}
        <Card>
          <div className="hidden md:grid grid-cols-12 gap-2 px-2 text-xs text-slate-400 mb-2 border-b border-white/10 pb-2">

            <div className="md:col-span-4">
             {lang === "de" ? "Gerät" : "Device"}
            </div>

            <div className="md:col-span-2">
              {lang === "de" ? "Typ" : "Type"}
            </div>

            <div className="md:col-span-2">
             {lang === "de" ? "Qualität" : "Quality"}
            </div>

            <div className="md:col-span-2">
             {lang === "de" ? "Speicher" : "Capacity"}
            </div>
 
            <div className="md:col-span-2 text-right">
             {lang === "de" ? "Menge" : "Qty"}
            </div>

          </div>

          <div className="space-y-3">

            {filteredItems.map(item=>(
              <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center gap-4">

                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-2 w-full items-center">

               {/* DEVICE */}
               <div className="bg-white/5 px-3 py-2 rounded-lg text-sm font-semibold">
                 <p className="text-xs text-slate-400 md:hidden">
                  {lang === "de" ? "Gerät" : "Device"}
                 </p>
               {item.device}
               </div>

                {/* TYPE */}
               <div className="bg-white/5 px-3 py-2 rounded-lg text-sm text-slate-300">
               <p className="text-xs text-slate-400 md:hidden">
                  {lang === "de" ? "Typ" : "Type"}
                </p>
               {getTypeLabel(item.type)}
               </div>

               {/* QUALITY */}
               <div className="bg-white/5 px-3 py-2 rounded-lg text-sm text-slate-300">
               <p className="text-xs text-slate-400 md:hidden">
                  {lang === "de" ? "Qualität" : "Quality"}
                </p>
               {getQualityLabel(item.quality)}
               </div>

               {/* CAPACITY */}
               <div className="bg-white/5 px-3 py-2 rounded-lg text-sm text-slate-300">
               <p className="text-xs text-slate-400 md:hidden">
                  {lang === "de" ? "Speicher" : "Capacity"}
               </p>
               {item.capacity ? item.capacity : <span className="text-slate-500 italic">-</span>}
               </div>

               </div>

                <div className="flex gap-2">
                 <div className="flex items-center gap-2">

                  {/* ➖ */}
                 <button
                 onClick={()=>decrease(item)}
                 className="w-10 h-10 bg-red-600 rounded-lg text-white text-lg"
                 >
                 -
                 </button>

                 {/* ⌨️ INPUT */}
                 <input
                 type="number"
                 value={item.quantity}
                 onChange={async (e)=>{
                 const newQty = Math.max(0, Number(e.target.value))

                 setItems(prev =>
                 prev.map(i =>
                  i.id === item.id ? { ...i, quantity: newQty } : i
                 )
                 )

                 await supabase
                 .from("stock_items")
                 .update({ quantity: newQty })
                 .eq("id", item.id)
                 }}
                 className={`w-16 text-center rounded-lg font-bold px-2 py-1 border transition ${getQtyColor(item.quantity)}`}
                 />

                 {/* ➕ */}
                 <button
                   onClick={()=>increase(item)}
                   className="w-10 h-10 bg-blue-600 rounded-lg text-white text-lg"
                   >
                   +
                  </button>

                </div>
                </div>

              </div>
            ))}

          </div>

        </Card>

      </div>

    </PageWrapper>
  )
}