"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function CrudTable({
  table,
  shopId
}: {
  table: string
  shopId?: string
}) {
  const [data, setData] = useState<any[]>([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const load = async () => {
    let query = supabase.from(table).select("*").order("id")

    if (shopId) {
      query = query.eq("shop_id", shopId)
    }

    const { data } = await query
    setData(data || [])
  }

  useEffect(() => {
    load()
  }, [shopId])

  const add = async () => {
    if (!name.trim()) return

    setLoading(true)

    await supabase.from(table).insert({
      name,
      ...(shopId && { shop_id: shopId })
    })

    setName("")
    await load()
    setLoading(false)
  }

  const update = async (id: string, newName: string) => {
    await supabase.from(table).update({ name: newName }).eq("id", id)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return
    await supabase.from(table).delete().eq("id", id)
    load()
  }

  return (
    <div className="space-y-4">

      {/* ADD */}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name..."
          className="border p-2 rounded w-full"
        />
        <button
          onClick={add}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* TABLE */}
      <div className="border rounded">
        {data.map((item) => (
          <Row
            key={item.id}
            item={item}
            onUpdate={update}
            onDelete={remove}
          />
        ))}
      </div>
    </div>
  )
}

function Row({ item, onUpdate, onDelete }: any) {
  const [edit, setEdit] = useState(false)
  const [value, setValue] = useState(item.name)

  return (
    <div className="flex justify-between items-center p-3 border-b">

      {edit ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border p-1 rounded w-full mr-2"
        />
      ) : (
        <span>{item.name}</span>
      )}

      <div className="flex gap-2">

        {edit ? (
          <button
            onClick={() => {
              onUpdate(item.id, value)
              setEdit(false)
            }}
            className="text-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="text-blue-600"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => onDelete(item.id)}
          className="text-red-600"
        >
          Delete
        </button>

      </div>
    </div>
  )
}