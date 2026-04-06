"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Input from "@/components/ui/input"

type Props = {
  device: string
  setDevice: (v: string) => void
  imei: string
  setImei: (v: string) => void
}

export default function DeviceSection({
  device,
  setDevice,
  imei,
  setImei
}: Props){

  const [brands, setBrands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])

  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [model, setModel] = useState("")

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    const { data } = await supabase.from("brands").select("*")
    setBrands(data || [])
  }

  const loadCategories = async (brandId: string) => {
    const { data } = await supabase
      .from("device_categories")
      .select("*")
      .eq("brand_id", brandId)

    setCategories(data || [])
  }

  const loadModels = async (categoryId: string) => {
    const { data } = await supabase
      .from("device_models")
      .select("*")
      .eq("category_id", categoryId)

    setModels(data || [])
  }

  return (

    <div className="flex flex-col h-full">

      {/* BRAND */}
      <select
        value={brand}
        onChange={(e) => {
          setBrand(e.target.value)
          setCategory("")
          setModel("")
          setDevice("")
          loadCategories(e.target.value)
        }}
        className="w-full h-12 px-4 rounded-xl
        bg-slate-800 border border-white/10 text-white"
      >
        <option value="">Select Brand</option>

        {brands.map((b: any) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      {/* CATEGORY */}
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value)
          setModel("")
          setDevice("")
          loadModels(e.target.value)
        }}
        className="w-full h-12 px-4 rounded-xl
        bg-slate-800 border border-white/10 text-white"
      >
        <option value="">Select Category</option>

        {categories.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* MODEL */}
      <select
        value={model}
        onChange={(e) => {
          setModel(e.target.value)
          setDevice(e.target.value)
        }}
        className="w-full h-12 px-4 rounded-xl
        bg-slate-800 border border-white/10 text-white"
      >
        <option value="">Select Model</option>

        {models.map((m: any) => (
          <option key={m.id} value={m.name}>
            {m.name}
          </option>
        ))}
      </select>

      {/* IMEI */}
      <Input
        placeholder="IMEI / Serial"
        value={imei}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImei(e.target.value)}
        className="mt-auto w-full h-12 px-4 rounded-xl
        bg-slate-800 border border-white/10
        text-white placeholder-slate-400"
      />

    </div>
  )
}