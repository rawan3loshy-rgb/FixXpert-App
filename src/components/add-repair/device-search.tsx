"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Input from "@/components/ui/input"
import { t } from "@/lib/text"

type Props = {
  device: string
  setDevice: (v: string) => void
}

export default function DeviceSearch({ device, setDevice }: Props){

  const [query, setQuery] = useState(device || "")
  const [results, setResults] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false) // 🔥 الجديد

  // ✅ sync مع edit
  useEffect(() => {
    setQuery(device || "")
    setOpen(false) // 🔥 مهم
  }, [device])

  useEffect(() => {

    const search = async () => {

      // ❌ لا تبحث إذا مو typing
      if (!isTyping || query.length < 2) {
        setResults([])
        return
      }

      const { data } = await supabase
        .from("devices")
        .select("*")
        .or(`model.ilike.%${query}%,brand.ilike.%${query}%`)
        .limit(20)

      setResults(data || [])
      setOpen(true)
    }

    search()

  }, [query, isTyping])

  return (

    <div className="relative">

      <Input
        placeholder={t("searchDevice")}
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value

          setQuery(value)
          setDevice(value)
          setIsTyping(true) // 🔥 المستخدم عم يكتب
        }}
        onFocus={() => {
          if (results.length > 0) setOpen(true)
        }}
        className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-white/10 text-white"
      />

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-slate-900 border border-white/10 rounded-xl shadow-xl">

          {results.map((d) => (
            <div
              key={d.id}
              onClick={() => {
                const full = d.brand + " " + d.model

                setDevice(full)
                setQuery(full)

                setResults([])
                setOpen(false)
                setIsTyping(false) // 🔥 توقف البحث
              }}
              className="px-4 py-3 cursor-pointer hover:bg-indigo-600/20"
            >
              {d.brand} {d.model}
            </div>
          ))}

        </div>
      )}

    </div>
  )
}