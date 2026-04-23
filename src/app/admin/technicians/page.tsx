"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Page() {
  const [shops, setShops] = useState<any[]>([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase.from("shops").select("id, shop_name")
    setShops(data || [])
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Employees</h1>

      <div className="grid gap-4">
        {shops.map((shop) => (
          <Link
            key={shop.id}
            href={`/admin/employees/${shop.id}`}
            className="
           group
           border border-white/10
           bg-slate-900/40
           p-4 rounded-xl 
           transition-all duration-300 ease-out

            hover:bg-gradient-to-r 
           hover:from-indigo-500/10 
           hover:to-blue-500/10

           hover:border-indigo-400
           hover:shadow-xl hover:shadow-indigo-500/20
           hover:scale-[1.01]

           cursor-pointer
           "
          >
            {shop.shop_name}
          </Link>
        ))}
      </div>
    </div>
  )
}