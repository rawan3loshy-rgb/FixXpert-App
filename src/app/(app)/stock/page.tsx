"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import Card from "@/components/ui/card"
import PageWrapper from "@/components/ui/page-wrapper"
import { useToast } from "@/components/ui/toast-provider"
import { getLang } from "@/lib/text"

// TYPES
type StockItem = {
  id: string
  device: string
  type: string
  quality: string
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
  const [type, setType] = useState("")
  const [quality, setQuality] = useState("")
  const [qty, setQty] = useState(1)

  const [filter, setFilter] = useState("")

  const [userId, setUserId] = useState<string | null>(null)
  const [lang, setLang] = useState("en")

  const firstLoad = useRef(true)
  const { showToast } = useToast()

  // 🌍 LANG
  useEffect(() => {
    setLang(getLang())
  }, [])

  // 🔑 USER
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  // 📥 LOAD (FIXED)
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

      if (t.data?.length) setType(t.data[0].key)
      if (q.data?.length) setQuality(q.data[0].key)
    }

    load()
  }, [userId])

  // 🔍 DEVICE SEARCH
  const filteredDevices = devices.filter(d =>
    `${d.brand} ${d.model}`.toLowerCase().includes(search.toLowerCase())
  )

  // 🔍 FILTER STOCK
  const filteredItems = items.filter(i =>
    `${i.device} ${i.type} ${i.quality}`.toLowerCase().includes(filter.toLowerCase())
  )

  // 🔔 NOTIFICATION
  useEffect(() => {

    if (firstLoad.current) {
      firstLoad.current = false
      return
    }

    items.forEach(item => {
      if (item.quantity === 0) showToast(`❌ ${item.device}`)
      if (item.quantity === 1) showToast(`⚠️ ${item.device}`)
    })

  }, [items])

  // ➕ ADD (FIXED 100%)
  const addItem = async () => {
    if (!selectedDevice || !userId) return

    const existing = items.find(i =>
      i.device === selectedDevice &&
      i.type === type &&
      i.quality === quality
    )

    if (existing) {
      const newQty = existing.quantity + qty

      setItems(prev =>
        prev.map(i =>
          i.id === existing.id ? { ...i, quantity: newQty } : i
        )
      )

      const { error } = await supabase
        .from("stock_items")
        .update({ quantity: newQty })
        .eq("id", existing.id)

      if (error) console.error("UPDATE ERROR ❌", error)

      return
    }

    // ✅ INSERT بدون id
    const { data, error } = await supabase
      .from("stock_items")
      .insert({
        device: selectedDevice,
        type,
        quality,
        quantity: qty,
        shop_id: userId
      })
      .select()
      .single()

    if (error) {
      console.error("INSERT ERROR ❌", error)
      return
    }

    if (data) {
      setItems(prev => [data, ...prev])
    }

    setSearch("")
    setSelectedDevice("")
    setQty(1)
  }

  // ➕➖ BUTTONS
  const increase = async (item: StockItem) => {
    const newQty = item.quantity + 1

    setItems(p =>
      p.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
    )

    const { error } = await supabase
      .from("stock_items")
      .update({ quantity: newQty })
      .eq("id", item.id)

    if (error) console.error(error)
  }

  const decrease = async (item: StockItem) => {
    const newQty = Math.max(0, item.quantity - 1)

    setItems(p =>
      p.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
    )

    const { error } = await supabase
      .from("stock_items")
      .update({ quantity: newQty })
      .eq("id", item.id)

    if (error) console.error(error)
  }

  // 🎨 LABEL HELPERS
  const getTypeLabel = (key:string) =>
    types.find(t=>t.key===key)?.[lang==="de"?"label_de":"label_en"]

  const getQualityLabel = (key:string) =>
    qualities.find(q=>q.key===key)?.[lang==="de"?"label_de":"label_en"]

  return (
    <PageWrapper>

      <div className="space-y-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          📦 {lang==="de"?"Lagerverwaltung":"Stock Management"}
        </h1>

        <Card>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

            <div className="relative md:col-span-2">
              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder={lang==="de"?"Gerät suchen":"Search device"}
                className="w-full px-3 py-2 bg-white/5 rounded-lg"
              />

              {search && (
                <div className="absolute w-full bg-slate-900 mt-2 rounded-xl max-h-60 overflow-auto z-50">
                  {filteredDevices.slice(0,20).map(d=>{
                    const label = `${d.brand} ${d.model}`
                    return (
                      <div
                        key={d.id}
                        onClick={()=>{
                          setSelectedDevice(label)
                          setSearch(label)
                        }}
                        className="p-2 hover:bg-white/10 cursor-pointer"
                      >
                        {label}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <select value={type} onChange={(e)=>setType(e.target.value)} className="bg-white/5 rounded-lg px-2">
              {types.map(t=>(
                <option key={t.key} value={t.key}>
                  {lang==="de"?t.label_de:t.label_en}
                </option>
              ))}
            </select>

            <select value={quality} onChange={(e)=>setQuality(e.target.value)} className="bg-white/5 rounded-lg px-2">
              {qualities.map(q=>(
                <option key={q.key} value={q.key}>
                  {lang==="de"?q.label_de:q.label_en}
                </option>
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
            className="mt-4 w-full py-2 bg-indigo-600 rounded-xl text-white font-semibold"
          >
            {lang==="de"?"Hinzufügen":"Add"}
          </button>

        </Card>

        <input
          value={filter}
          onChange={(e)=>setFilter(e.target.value)}
          placeholder={lang==="de"?"Filtern...":"Filter..."}
          className="w-full px-3 py-2 bg-white/5 rounded-lg"
        />

        <Card>

          <div className="space-y-3">

            {filteredItems.map(item=>(
              <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                <div>
                  <p className="font-semibold">{item.device}</p>
                  <p className="text-xs text-slate-400">
                    {getTypeLabel(item.type)} • {getQualityLabel(item.quality)}
                  </p>
                  <p className="text-xs">{item.quantity}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={()=>increase(item)} className="w-10 h-10 bg-green-600 rounded-lg text-lg">+</button>
                  <button onClick={()=>decrease(item)} className="w-10 h-10 bg-red-600 rounded-lg text-lg">-</button>
                </div>

              </div>
            ))}

          </div>

        </Card>

      </div>

    </PageWrapper>
  )
}