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
  const [keyVal, setKeyVal] = useState("")
  const [labelEn, setLabelEn] = useState("")
  const [labelDe, setLabelDe] = useState("")

  const load = async () => {
    let query = supabase.from(table).select("*")

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
    if (!keyVal || !labelEn) return

    await supabase.from(table).insert({
      key: keyVal,
      label_en: labelEn,
      label_de: labelDe
    })

    setKeyVal("")
    setLabelEn("")
    setLabelDe("")
    load()
  }

  const update = async (id: string, values: any) => {
    await supabase.from(table).update(values).eq("id", id)
    load()
  }

  const remove = async (id: string) => {
    await supabase.from(table).delete().eq("id", id)
    load()
  }

  return (
    <div className="space-y-4">

      {/* ADD */}
      <div className="grid grid-cols-3 gap-2">
        <input
          placeholder="key"
          value={keyVal}
          onChange={(e) => setKeyVal(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="EN"
          value={labelEn}
          onChange={(e) => setLabelEn(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="DE"
          value={labelDe}
          onChange={(e) => setLabelDe(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={add}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add
      </button>

      {/* LIST */}
      <div className="space-y-2">
        {data.map((item) => (
          <Row key={item.id} item={item} onUpdate={update} onDelete={remove} />
        ))}
      </div>

    </div>
  )
}

function Row({ item, onUpdate, onDelete }: any) {
  const [edit, setEdit] = useState(false)
  const [values, setValues] = useState({
    key: item.key,
    label_en: item.label_en,
    label_de: item.label_de
  })

  return (
    <div className="border p-3 rounded space-y-2">

      {edit ? (
        <>
          <input
            value={values.key}
            onChange={(e) =>
              setValues({ ...values, key: e.target.value })
            }
          />
          <input
            value={values.label_en}
            onChange={(e) =>
              setValues({ ...values, label_en: e.target.value })
            }
          />
          <input
            value={values.label_de}
            onChange={(e) =>
              setValues({ ...values, label_de: e.target.value })
            }
          />
        </>
      ) : (
        <>
          <div><b>{item.key}</b></div>
          <div>{item.label_en}</div>
          <div>{item.label_de}</div>
        </>
      )}

      <div className="flex gap-2">
        {edit ? (
          <button
            onClick={() => {
              onUpdate(item.id, values)
              setEdit(false)
            }}
          >
            Save
          </button>
        ) : (
          <button onClick={() => setEdit(true)}>Edit</button>
        )}

        <button onClick={() => onDelete(item.id)}>Delete</button>
      </div>

    </div>
  )
}