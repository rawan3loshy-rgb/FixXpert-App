"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import PageWrapper from "@/components/ui/page-wrapper"
import Card from "@/components/ui/card"
import PinModal from "@/components/ui/pin-modal"
import { t, getLang } from "@/lib/text"

type Device = {
  id: string
  model: string
  description: string
  quantity: number
  shop_id: string
}

export default function UsedDevicesPage() {

  const [devices, setDevices] = useState<Device[]>([])
  const [search, setSearch] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [lang, setLang] = useState("en")
  const [toast, setToast] = useState<"add" | "delete" | null>(null)
  // 🔐 PIN
  const [unlocked, setUnlocked] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [adminPin, setAdminPin] = useState("")

  // ➕ form
  const [model, setModel] = useState("")
  const [description, setDescription] = useState("")
  const [qty, setQty] = useState(1)

  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [editModel, setEditModel] = useState("")
  const [editDescription, setEditDescription] = useState("")
 
  useEffect(() => {
  setLang(getLang())
  }, [])

  // 🔑 user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  // 📥 load data + PIN
  useEffect(() => {
    if (!userId) return

    const load = async () => {

      const { data } = await supabase
        .from("used_devices")
        .select("*")
        .eq("shop_id", userId)

      if (data) setDevices(data)

      // 🔐 load PIN
      const { data: settings } = await supabase
        .from("shops")
        .select("profit_pin")
        .eq("shop_id", userId)
        .single()

      if (settings) setAdminPin(settings.profit_pin)
    }

    load()
  }, [userId])

  // 🔍 filter
  const filtered = devices.filter(d =>
    d.model.toLowerCase().includes(search.toLowerCase())
  )

  // ➕ add
const addDevice = async () => {
  if (!model || !userId)
     return

  // 🔍 شوف إذا موجود
  const { data: existing } = await supabase
    .from("used_devices")
    .select("*")
    .match({
     model: model.toLowerCase(),
     description: description,
     shop_id: userId
})
    .maybeSingle()

  if (existing) {
    // ➕ زيد الكمية
    const newQty = existing.quantity + qty

    await supabase
      .from("used_devices")
      .update({ quantity: newQty })
      .eq("id", existing.id)

    // تحديث UI
    setDevices(prev =>
      prev.map(d =>
        d.id === existing.id
          ? { ...d, quantity: newQty }
          : d
      )
    )
    

  } else {
    // ➕ create جديد
    const { data } = await supabase
      .from("used_devices")
      .insert({
        model,
        description,
        quantity: qty,
        shop_id: userId
      })
      .select()
      .single()

    if (data) {
      setDevices(prev => [data, ...prev])
    }
  }

  // reset
  setModel("")
  setDescription("")
  setQty(1)
  setToast("add")

    setTimeout(() => {
    setToast(null)
    }, 2000)

}

  // 🗑 delete
  const deleteItem = async (id: string) => {
    await supabase.from("used_devices").delete().eq("id", id)
    setDevices(prev => prev.filter(i => i.id !== id))
        
    setToast("delete")

    setTimeout(() => {
    setToast(null)
    }, 2000)
  }

  // ➕➖ update qty
  const updateQty = async (item: Device, newQty: number) => {
    await supabase
      .from("used_devices")
      .update({ quantity: newQty })
      .eq("id", item.id)

    setDevices(prev =>
      prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
    )
  }
  const saveEdit = async () => {
  if (!editingDevice) return

  await supabase
    .from("used_devices")
    .update({
      model: editModel,
      description: editDescription
    })
    .eq("id", editingDevice.id)

  // تحديث UI
  setDevices(prev =>
    prev.map(d =>
      d.id === editingDevice.id
        ? { ...d, model: editModel, description: editDescription }
        : d
    )
  )

  setEditingDevice(null)
}
  
  return (
    
    <PageWrapper>

      <div className="space-y-6">

        <h1 className="text-2xl font-bold">📱 {t("usedDevices")}</h1>

        {/* 🔐 LOCK BUTTON */}
        {!unlocked ? (
          <button
            onClick={() => setShowPin(true)}
            className="px-4 py-2 bg-indigo-600 rounded-xl"
          >
            🔓 {t("unlock")}
          </button>
        ) : (
          <button
            onClick={() => setUnlocked(false)}
            className="px-4 py-2 bg-red-600 rounded-xl"
          >
            🔒 {t("lock")}
          </button>
        )}

        {/* 🔐 PIN MODAL */}
        {showPin && (
          <PinModal
            correctPin={adminPin}
            onClose={() => setShowPin(false)}
            onSuccess={() => {
              setUnlocked(true)
              setShowPin(false)
            }}
          />
        )}

        {/* ➕ ADD */}
        {unlocked && (
          <Card>
            <div className="grid md:grid-cols-3 gap-3">

              <input
                value={model}
                onChange={(e)=>setModel(e.target.value)}
                placeholder={t("model")}
                className="bg-white/5 px-4 py-3 rounded-xl"
              />

              <input
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                placeholder={t("description")}
                className="bg-white/5 px-4 py-3 rounded-xl"
              />

              <input
                type="number"
                value={qty}
                onChange={(e)=>setQty(Number(e.target.value))}
                className="bg-white/5 px-4 py-3 rounded-xl"
              />

            </div>

            <button
              onClick={addDevice}
              className="mt-3 w-full py-2 bg-green-600 rounded-xl"
            >
              {t("addDevice")}
            </button>
          </Card>
        )}

        {/* 🔍 SEARCH */}
        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder={t("search")}
          className="bg-white/5 px-4 py-3 rounded-xl w-full"
        />

        {/* 📋 LIST */}
        <Card>
          <div className="space-y-3">

            {filtered.map(item => (
              <div
                key={item.id}
                className="p-4 bg-white/5 rounded-xl flex justify-between"
              >

                <div>
                  <p className="font-bold">{item.model}</p>
                  <p className="text-sm text-slate-400">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">

                    {unlocked && (
                   <button
                     onClick={()=>{
                     setEditingDevice(item)
                     setEditModel(item.model)
                     setEditDescription(item.description)
                     }}
                      className="text-yellow-400 hover:text-yellow-600"
                     >
                      ✏️ {t("edit")}
                     </button>
                  )}

                  {unlocked && (
                    <button
                      onClick={()=>updateQty(item, item.quantity - 1)}
                      className="w-10 h-10 bg-red-600 rounded-lg text-white text-lg"
                    >
                      -
                    </button>
                  )}

                  <span className="px-3">{item.quantity}</span>

                  {unlocked && (
                    <button
                      onClick={()=>updateQty(item, item.quantity + 1)}
                      className="w-10 h-10 bg-blue-600 rounded-lg text-white text-lg"
                    >
                      +
                    </button>
                  )}

                  {unlocked && (
                    <button
                      onClick={()=>deleteItem(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  )}
                

                </div>

              </div>
            ))}

          </div>
        </Card>

      </div>
   {toast && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999999] space-y-3 pointer-events-none">

    <div className="px-6 py-3 rounded-2xl text-white text-lg font-semibold shadow-2xl animate-fadeIn
      bg-blue-600">

      {toast === "add" && `${t("usedDeviceAdded")} ✅`}
      {toast === "delete" && `${t("usedDeviceDeleted")} ❌`}

    </div>

  </div>
)}
{editingDevice && (
  <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur">

    <div className="bg-slate-900 p-6 rounded-2xl w-96 border border-white/10 shadow-2xl">

      <h2 className="text-lg font-bold mb-4 text-center">
        {t("editDevice")}
      </h2>

      <input
        value={editModel}
        onChange={(e)=>setEditModel(e.target.value)}
        placeholder={t("model")}
        className="w-full mb-3 px-3 py-2 bg-white/5 rounded-lg"
      />

      <input
        value={editDescription}
        onChange={(e)=>setEditDescription(e.target.value)}
        placeholder={t("description")}
        className="w-full mb-4 px-3 py-2 bg-white/5 rounded-lg"
      />

      <div className="flex gap-2">

        <button
          onClick={()=>setEditingDevice(null)}
          className="flex-1 py-2 bg-slate-700 rounded-xl"
        >
          {t("cancel")}
        </button>

        <button
          onClick={saveEdit}
          className="flex-1 py-2 bg-green-600 rounded-xl"
        >
          {t("save")}
        </button>

      </div>

    </div>

  </div>
)}
    </PageWrapper>
  )
}