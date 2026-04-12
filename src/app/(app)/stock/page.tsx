"use client"

import { useEffect, useState } from "react"
import PageWrapper from "@/components/ui/page-wrapper"
import Card from "@/components/ui/card"
import { db, StockItem } from "@/lib/db"

export default function StockPage() {

  const [items, setItems] = useState<StockItem[]>([])
  const [name, setName] = useState("")
  const [qty, setQty] = useState(0)

  // 📥 تحميل البيانات
  const load = async () => {
    const data = await db.stock.toArray()
    setItems(data)
  }

  useEffect(() => {
    load()
  }, [])

  // ➕ إضافة
  const addItem = async () => {
    if (!name) return

    await db.stock.add({
      name,
      quantity: qty,
      min: 1,
      created_at: new Date().toISOString()
    })

    setName("")
    setQty(0)
    load()
  }

  // ➕ زيادة
  const increase = async (id?: number) => {
    if (!id) return

    const item = await db.stock.get(id)
    if (!item) return

    await db.stock.update(id, {
      quantity: item.quantity + 1
    })

    load()
  }

  // ➖ نقصان
  const decrease = async (id?: number) => {
    if (!id) return

    const item = await db.stock.get(id)
    if (!item) return

    await db.stock.update(id, {
      quantity: Math.max(0, item.quantity - 1)
    })

    load()
  }

  return (
    <PageWrapper>

      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">📦 Stock Management</h1>
        </div>

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
                      onClick={()=>increase(item.id)}
                      className="px-2 py-1 bg-indigo-600 rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={()=>decrease(item.id)}
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