"use client"

import { useEffect, useMemo, useState } from "react"
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
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)

  // 🔥 LOAD
  const load = async () => {
    setLoading(true)

    let query = supabase.from(table).select("*").order("id", { ascending: true })

    if (shopId) {
      query = query.eq("shop_id", shopId)
    }

    const { data, error } = await query

    if (!error) {
      setData(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [shopId])

  // 🔍 FILTER
  const filtered = useMemo(() => {
    return data.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  // ➕ ADD
 const add = async () => {
  if (!name.trim()) return

  setLoading(true)

  const { data: inserted } = await supabase
    .from(table)
    .insert({
      name,
      ...(shopId && { shop_id: shopId })
    })
    .select()
    .single()

  // 🟢 user
  const { data: { user } } = await supabase.auth.getUser()

  // 🟢 log
  await supabase.from("admin_logs").insert({
    action: "create",
    table_name: table,
    record_id: inserted?.id,
    user_id: user?.id,
    user_email: user?.email,
    details: {
      created: inserted
    }
  })

  setName("")
  await load()
  setLoading(false)
}

  return (
    <div className="space-y-6">

      {/* 🔝 HEADER */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-3">

        {/* ADD */}
        <div className="flex flex-col md:flex-row gap-2">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") add()
            }}
            placeholder="Add new..."
            className="flex-1 bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500"
          />

          <button
            onClick={add}
            disabled={adding}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-white transition disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add"}
          </button>

        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500 text-sm"
        />

      </div>

      {/* 📦 LIST */}
      <div className="space-y-2">

        {loading && (
          <div className="text-center text-slate-400 py-6 animate-pulse">
            Loading...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-slate-400 py-10 text-sm">
            No results
          </div>
        )}

        {filtered.map((item) => (
          <Row
            key={item.id}
            item={item}
            table={table}
            setData={setData}
          />
        ))}

      </div>

    </div>
  )
}

// ================= ROW =================

function Row({ item, table, setData }: any) {

  const [edit, setEdit] = useState(false)
  const [value, setValue] = useState(item.name)
  const [loading, setLoading] = useState(false)

  // 💾 SAVE
  const save = async () => {
  if (!value.trim()) return

  setLoading(true)

  await supabase
    .from(table)
    .update({ name: value })
    .eq("id", item.id)

  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from("admin_logs").insert({
    action: "update",
    table_name: table,
    record_id: item.id,
    user_id: user?.id,
    user_email: user?.email,
    details: {
      old: item.name,
      new: value
    }
  })

  setEdit(false)
  setLoading(false)
  
}

  // ❌ DELETE
 const remove = async () => {
  if (!confirm("Delete item?")) return

  // 🟢 حذف
  await supabase
    .from(table)
    .delete()
    .eq("id", item.id)

  // 🟢 جيب المستخدم
  const { data: { user } } = await supabase.auth.getUser()

  // 🟢 سجل log
  await supabase.from("admin_logs").insert({
    action: "delete",
    table_name: table,
    record_id: item.id,
    user_id: user?.id,
    user_email: user?.email,
    details: {
      deleted: item
    }
  })

  // 🟢 تحديث الواجهة
  setData((prev: any[]) =>
    prev.filter((i) => i.id !== item.id)
  )
}

  return (
    <div className="
      group
      bg-slate-900/40
      border border-white/10
      rounded-xl
      px-4 py-3
      flex flex-col md:flex-row md:items-center justify-between gap-3
      hover:border-indigo-500
      hover:bg-indigo-500/5
      transition
    ">

      {/* TEXT */}
      <div className="flex-1">

        {edit ? (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save()
              if (e.key === "Escape") setEdit(false)
            }}
            className="w-full bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500"
            autoFocus
          />
        ) : (
          <span className="font-medium text-slate-200 group-hover:text-white transition">
            {item.name}
          </span>
        )}

      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">

        {edit ? (
          <>
            <button
              onClick={save}
              disabled={loading}
              className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm transition"
            >
              Save
            </button>

            <button
              onClick={() => setEdit(false)}
              className="bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded text-sm transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-sm transition"
          >
            Edit
          </button>
        )}

        <button
          onClick={remove}
          className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm transition"
        >
          Delete
        </button>

      </div>

    </div>
  )
}