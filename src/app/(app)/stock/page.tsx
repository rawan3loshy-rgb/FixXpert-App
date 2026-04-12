"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Card from "@/components/ui/card"
import PageWrapper from "@/components/ui/page-wrapper"

export default function StockPage() {

  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState("")
  const [qty, setQty] = useState(0)
  const [user, setUser] = useState<any>(null)

  // 🔑 get user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  // 📥 load stock
  const load = async () => {
    const { data } = await supabase
      .from("stock_items")
      .select("*")
      .order("created_at", { ascending: false })

    setItems(data || [])
  }

  useEffect(() => {
    if (user) load()
  }, [user])

  // ➕ add
  const addItem = async () => {
    if (!name || !user) return

    await supabase.from("stock_items").insert({
      name,
      quantity: qty,
      shop_id: user.id
    })

    setName("")
    setQty(0)
    load()
  }

  // ➕ increase
  const increase = async (item:any) => {
    await supabase
      .from("stock_items")
      .update({ quantity: item.quantity + 1 })
      .eq("id", item.id)

    load()
  }

  // ➖ decrease
  const decrease = async (item:any) => {
    await supabase
      .from("stock_items")
      .update({ quantity: Math.max(0, item.quantity - 1) })
      .eq("id", item.id)

    load()
  }

  return (
    <PageWrapper>

      <div className="space-y-8">

        <h1 className="text-3xl font-bold">📦 Stock Management</h1>

        {/* ADD */}
        <Card>
          <div className="flex gap-3">

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Item name"
              className="px-3 py-2 bg-white/5 rounded-lg flex-1"
            />

            <input
              type="number"
              value={qty}
              onChange={(e)=>setQty(Number(e.target.value))}
              className="w-24 px-3 py-2 bg-white/5 rounded-lg"
            />

            <button
              onClick={addItem}
              className="px-4 py-2 bg-indigo-600 rounded-xl"
            >
              Add
            </button>

          </div>
        </Card>

        {/* LIST */}
        <Card>

          <div className="space-y-3">

            {items.map(item => {

              const status =
                item.quantity === 0
                  ? "out"
                  : item.quantity <= item.min
                  ? "low"
                  : "ok"

              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 rounded-xl bg-slate-900/50 border border-white/10"
                >

                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-400">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`
                        text-xs px-2 py-1 rounded
                        ${
                          status === "ok"
                            ? "bg-green-500/20 text-green-400"
                            : status === "low"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }
                      `}
                    >
                      {status}
                    </span>

                    <button
                      onClick={()=>increase(item)}
                      className="px-2 py-1 bg-indigo-600 rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={()=>decrease(item)}
                      className="px-2 py-1 bg-red-500 rounded"
                    >
                      -
                    </button>

                  </div>

                </div>
              )
            })}

          </div>

        </Card>

      </div>

    </PageWrapper>
  )
}