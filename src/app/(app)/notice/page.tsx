"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import PageWrapper from "@/components/ui/page-wrapper"
import Card from "@/components/ui/card"
import { getLang } from "@/lib/text"

export default function NoticePage(){

  const [notes,setNotes] = useState<any[]>([])
  const [text,setText] = useState("")
  const [qty,setQty] = useState(1)
  const [userId,setUserId] = useState<string | null>(null)
  const [lang,setLang] = useState("en")

  // 🌍 LANG
  useEffect(()=> setLang(getLang()), [])

  // 🔑 USER
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      if(data.user) setUserId(data.user.id)
    })
  },[])

  // 📥 LOAD
  useEffect(()=>{
    if(!userId) return

    const load = async ()=>{
      const { data } = await supabase
        .from("order_notes")
        .select("*")
        .eq("shop_id", userId)
        .order("created_at",{ascending:false})

      if(data) setNotes(data)
    }

    load()
  },[userId])

  // ➕ ADD
  const addNote = async ()=>{
    if(!text.trim() || !userId) return

    const { data } = await supabase
      .from("order_notes")
      .insert({
        text,
        quantity: qty,
        shop_id: userId
      })
      .select()
      .single()

    if(data) setNotes(prev => [data, ...prev])

    setText("")
    setQty(1)
  }

  // ❌ DELETE
  const deleteNote = async (id:string)=>{
    setNotes(prev => prev.filter(n => n.id !== id))

    await supabase
      .from("order_notes")
      .delete()
      .eq("id", id)
  }
  const handleDeleteAll = async () => {

  if (notes.length === 0) return

  const confirmDelete = window.confirm(
    lang === "de"
      ? "Möchten Sie wirklich alle Einträge löschen?"
      : "Are you sure you want to delete all notes?"
  )

  if (!confirmDelete) return

  await supabase
    .from("order_notes")
    .delete()
    .eq("shop_id", userId)

  setNotes([])
}

  return(
    <PageWrapper>

      <div className="space-y-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          📝 {lang==="de"?"Notizen":"Notice"}
        </h1>

        {/* ➕ ADD */}
        <Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

            <input
              value={text}
              onChange={(e)=>setText(e.target.value)}
              placeholder={lang==="de"?"Artikel eingeben...":"Enter item..."}
              className="bg-white/5 px-3 py-2 rounded-lg md:col-span-2"
            />

            <input
              type="number"
              value={qty}
              onChange={(e)=>setQty(Number(e.target.value))}
              className="bg-white/5 px-3 py-2 rounded-lg"
            />

            <button
              onClick={addNote}
              className="bg-indigo-600 rounded-lg text-white"
            >
              {lang==="de"?"Hinzufügen":"Add"}
            </button>
            <div className="flex justify-end mt-3">
            <button
             onClick={handleDeleteAll}
             className="bg-red-600 px-7 py-1 rounded text-white hover:bg-red-700 transition"
              >
              {lang === "de" ? "Alle löschen" : "Delete All"}
          </button>
            </div>

          </div>

        </Card>

        {/* 📦 LIST */}
        <Card>

          <div className="space-y-3">

            {notes.map(n=>(
              <div key={n.id} className="p-4 bg-white/5 rounded-xl flex justify-between items-center">

                <div>
                  <p className="font-semibold">{n.text}</p>
                </div>

                <div className="flex items-center gap-3">

                  <div className="flex items-center gap-2">

                   {/* ➖ */}
                  <button
                   onClick={async ()=>{
                  const newQty = Math.max(1, n.quantity - 1)

                  setNotes(prev =>
                  prev.map(item =>
                 item.id === n.id ? { ...item, quantity: newQty } : item
                  )
                  )

                  await supabase
                  .from("order_notes")
                 .update({ quantity: newQty })
                 .eq("id", n.id)
                 }}
                 className="w-8 h-8 bg-red-600 rounded text-white"
                 >
                 -
                 </button>

                 {/* ⌨️ INPUT */}
                 <input
                  type="number"
                  value={n.quantity}
                 onChange={async (e)=>{
                  const newQty = Math.max(1, Number(e.target.value))

                  setNotes(prev =>
                  prev.map(item =>
                   item.id === n.id ? { ...item, quantity: newQty } : item
                   )
                 )

                 await supabase
                 .from("order_notes")
                 .update({ quantity: newQty })
                 .eq("id", n.id)
                 }}
                  className="w-16 text-center bg-white/5 rounded"
                 />

                 {/* ➕ */}
                 <button
                 onClick={async ()=>{
                  const newQty = n.quantity + 1

                  setNotes(prev =>
                  prev.map(item =>
                  item.id === n.id ? { ...item, quantity: newQty } : item
                  )
                 )

                  await supabase
                 .from("order_notes")
                 .update({ quantity: newQty })
                  .eq("id", n.id)
                 }}
                 className="w-8 h-8 bg-green-600 rounded text-white"
                 >
                 +
                 </button>

                </div>

                  <button
                    onClick={()=>deleteNote(n.id)}
                    className="bg-red-600 px-4 py-1 rounded text-white hover:bg-red-700 transition"
                  >
                    {lang === "de" ? "Löschen" : "Delete"}
                    
                  </button>

                </div>

              </div>
            ))}

            {notes.length === 0 && (
              <p className="text-center text-slate-500">
                {lang==="de"?"Keine Einträge":"No notes"}
              </p>
            )}

          </div>

        </Card>

      </div>

    </PageWrapper>
  )
}