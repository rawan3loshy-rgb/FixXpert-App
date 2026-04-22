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
            className="border p-4 rounded hover:bg-gray-100"
          >
            {shop.shop_name}
          </Link>
        ))}
      </div>
    </div>
  )
}