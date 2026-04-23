"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function CrudTableAdv({
  table,
  shopId
}: {
  table: string
  shopId?: string
}) {
  const [data, setData] = useState<any[]>([])
  const [keyVal, setKeyVal] = useState("")
  const [labelEn, setLabelEn] = useState("")
  const [labelDe, setLabelDe] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)

  // 🔥 LOAD
  const load = async () => {
    setLoading(true)

    let query = supabase.from(table).select("*")

    if (shopId) {
      query = query.eq("shop_id", shopId)
    }

    const { data } = await query
    setData(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [shopId])

  // 🔍 SEARCH
  const filtered = useMemo(() => {
    return data
      .filter((item) =>
        `${item.key} ${item.label_en} ${item.label_de}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => (a.key || "").localeCompare(b.key || ""))
  }, [data, search])

  // ➕ ADD
  const add = async () => {
    if (!keyVal.trim() || !labelEn.trim()) return

    setAdding(true)

    const { data: inserted, error } = await supabase
      .from(table)
      .insert({
        key: keyVal,
        label_en: labelEn,
        label_de: labelDe,
        ...(shopId && { shop_id: shopId })
      })
      .select()
      .single()

    if (!error && inserted) {
      // 🔥 optimistic
      setData((prev) => [...prev, inserted])

      // 🟢 LOG
      const { data: { user } } = await supabase.auth.getUser()

      await supabase.from("admin_logs").insert({
        action: "create",
        table_name: table,
        record_id: inserted.id ?? inserted.key,
        user_id: user?.id,
        user_email: user?.email,
        details: {
          created: inserted
        }
      })

      setKeyVal("")
      setLabelEn("")
      setLabelDe("")
    }

    setAdding(false)
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-3">

        {/* ADD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

          <input
            placeholder="Key"
            value={keyVal}
            onChange={(e) => setKeyVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500"
          />

          <input
            placeholder="English"
            value={labelEn}
            onChange={(e) => setLabelEn(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500"
          />

          <input
            placeholder="Deutsch"
            value={labelDe}
            onChange={(e) => setLabelDe(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500"
          />

        </div>

        <button
          onClick={add}
          disabled={adding}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-white transition disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add"}
        </button>

        {/* SEARCH */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500 text-sm"
        />

      </div>

      {/* LIST */}
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
            key={item.id ?? item.key}
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
  const [values, setValues] = useState({
    key: item.key,
    label_en: item.label_en,
    label_de: item.label_de
  })

  const [loading, setLoading] = useState(false)

  const identifier = item.id ?? item.key
  const column = item.id ? "id" : "key"

  // ✏️ UPDATE
  const save = async () => {
    if (!values.key.trim() || !values.label_en.trim()) return

    setLoading(true)

    const { error } = await supabase
      .from(table)
      .update(values)
      .eq(column, identifier)

    if (!error) {
      // UI update
      setData((prev: any[]) =>
        prev.map((i) =>
          (i.id ?? i.key) === identifier ? { ...i, ...values } : i
        )
      )

      // 🟢 LOG
      const { data: { user } } = await supabase.auth.getUser()

      await supabase.from("admin_logs").insert({
        action: "update",
        table_name: table,
        record_id: identifier,
        user_id: user?.id,
        user_email: user?.email,
        details: {
          old: item,
          new: values
        }
      })

      setEdit(false)
    }

    setLoading(false)
  }

  // ❌ DELETE
  const remove = async () => {
    if (!confirm("Delete item?")) return

    await supabase
      .from(table)
      .delete()
      .eq(column, identifier)

    // 🟢 LOG
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from("admin_logs").insert({
      action: "delete",
      table_name: table,
      record_id: identifier,
      user_id: user?.id,
      user_email: user?.email,
      details: {
        deleted: item
      }
    })

    // UI update
    setData((prev: any[]) =>
      prev.filter((i) => (i.id ?? i.key) !== identifier)
    )
  }

  return (
    <div className="
      group
      bg-slate-900/40
      border border-white/10
      rounded-xl
      p-4
      hover:border-indigo-500
      hover:bg-indigo-500/5
      transition
    ">

      {edit ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

          <input
            value={values.key}
            onChange={(e) =>
              setValues({ ...values, key: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") save()
              if (e.key === "Escape") setEdit(false)
            }}
            className="bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500"
          />

          <input
            value={values.label_en}
            onChange={(e) =>
              setValues({ ...values, label_en: e.target.value })
            }
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500"
          />

          <input
            value={values.label_de}
            onChange={(e) =>
              setValues({ ...values, label_de: e.target.value })
            }
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500"
          />

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="font-semibold text-white">{item.key}</div>
          <div>{item.label_en}</div>
          <div className="text-slate-400">{item.label_de}</div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3">

        {edit ? (
          <>
            <button
              onClick={save}
              disabled={loading}
              className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm"
            >
              Save
            </button>

            <button
              onClick={() => setEdit(false)}
              className="bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
        )}

        <button
          onClick={remove}
          className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm"
        >
          Delete
        </button>

      </div>

    </div>
  )
}