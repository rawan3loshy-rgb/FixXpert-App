"use client"

import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/BackButton"
import { t, tStatus } from "@/lib/text"
import Card from "@/components/ui/card"
import PageWrapper from "@/components/ui/page-wrapper"
import { useToast } from "@/components/ui/toast-provider"
import { motion } from "framer-motion"
import EmptyState from "@/components/ui/empty-state"
import PinModal from "@/components/ui/pin-modal"
import { createPortal } from "react-dom"
export default function RepairsPage() {

  const router = useRouter()
  const { showToast } = useToast()

  const [repairs, setRepairs] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [openParts, setOpenParts] = useState<Record<string, boolean>>({})
  const [partsData, setPartsData] = useState<Record<string, any[]>>({})
  const [showPartsModal, setShowPartsModal] = useState(false)
  const [selectedParts, setSelectedParts] = useState<any[]>([])
  const [selectedDevice, setSelectedDevice] = useState("")
 
  // 🔐 PIN SYSTEM
  const [shop, setShop] = useState<any>(null)
  const [showPin, setShowPin] = useState(false)
  const [selectedDelete, setSelectedDelete] = useState<any>(null)

  // 🔥 NEW READY MODAL
  const [showFixModal, setShowFixModal] = useState(false)
  const [selectedRepair, setSelectedRepair] = useState<any>(null)
  const [fixStatus, setFixStatus] = useState("")
  const [noWarranty, setNoWarranty] = useState(false)
  const [stockItems, setStockItems] = useState<any[]>([])
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [partQty, setPartQty] = useState(1)
  const [parts, setParts] = useState<any[]>([])

  // =========================
  // 🔥 STATUS RULES
  // =========================
  const getAllowedStatuses = (current: string) => {
    switch (current) {
      case "received":
        return ["in-repair", "pending-parts", "pending-answer"]
      case "in-repair":
        return ["pending-parts", "pending-answer", "ready"]
      case "pending-parts":
        return ["pending-answer", "in-repair"]
      case "pending-answer":
        return ["pending-parts", "in-repair", "ready"]
      case "ready":
        return ["delivered"]
      default:
        return []
    }
  }

  useEffect(() => {
    fetchRepairs()
  }, [])
  useEffect(() => {
  if (!showFixModal) return

  const handleKey = (e: KeyboardEvent) => {

    // ESC يغلق
    if (e.key === "Escape") {
      setShowFixModal(false)
    }

    // ENTER يؤكد
    if (e.key === "Enter" && fixStatus) {
      confirmReady()
    }
  }

  window.addEventListener("keydown", handleKey)

  return () => window.removeEventListener("keydown", handleKey)

}, [showFixModal, fixStatus])
  const fetchRepairs = async () => {
    try {
      setLoading(true)

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      const user = session.user

      const { data: shopData, error: shopError } = await supabase
        .from("shops")
        .select("*")
        .eq("shop_id", user.id)
        .single()

      if (shopError || !shopData) {
        showToast("Shop not found", "error")
        router.push("/login")
        return
      }

      setShop(shopData)

      const { data, error } = await supabase
        .from("repairs")
        .select("*")
        .eq("shop_id", shopData.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setRepairs(data || [])

    } catch (err: any) {
      console.error(err)
      showToast(err.message || "Error loading repairs", "error")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
  if (!showFixModal || fixStatus !== "fixed") return

  loadStock()
}, [showFixModal, fixStatus])

const loadStock = async () => {

  if (!shop || !selectedRepair) return

 const { data, error } = await supabase
  .from("stock_items")
  .select("*")
  .eq("shop_id", shop.id)

 console.log("SHOP ID:", shop?.id)
 console.log("SELECTED DEVICE:", selectedRepair?.device)
 console.log("RAW STOCK:", data)
 console.log("ERROR:", error)

  // 🔥 فلترة بالفرونت (أذكى من ilike)
  // 🔥 normalize function
  const normalize = (str:any) =>
    str?.toLowerCase().replace(/\s+/g, " ").trim()

  const repairDevice = normalize(selectedRepair.device)

  const filtered = (data || []).filter(item =>
    normalize(item.device) === repairDevice
  )

  console.log("MATCHED STOCK:", filtered)

  setStockItems(filtered)
 }
 const loadRepairParts = async (repair: any) => {

  const { data, error } = await supabase
    .from("repair_parts")
    .select(`
      id,
      quantity,
      cost_price,
      stock_items (
        type,
        quality,
        device
      )
    `)
    .eq("repair_id", repair.id)

  if (error) {
    showToast("Error loading parts", "error")
    return
  }

  setSelectedParts(data || [])
  setSelectedDevice(repair.device)
  setShowPartsModal(true)
 } 


  // =========================
  // 🔥 ACTIONS
  // =========================

  const deleteRepair = (id: any) => {
    setSelectedDelete(id)
    setShowPin(true)
  }

  const confirmDelete = async () => {

    if (!selectedDelete) return

    const { error } = await supabase
      .from("repairs")
      .delete()
      .eq("id", selectedDelete)

    if (error) {
      showToast(error.message, "error")
      return
    }

    setRepairs(prev => prev.filter(r => r.id !== selectedDelete))
    showToast("Deleted successfully", "success")

    setSelectedDelete(null)
    setShowPin(false)
  }

  const sendWhatsApp = (repair: any) => {
    if (!repair?.phone) return

    const phone = repair.phone.replace(/\D/g, "")
    const url = `${window.location.origin}/track/${repair.order_number}`

    const msg = `Hallo ${repair.customer}
Status: *${tStatus(repair.status)}*
${url}`

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`)
  }

  // 🔥 STATUS UPDATE (UPDATED ONLY READY)
  const updateStatus = async (repair:any, newStatus:any) => {

    const allowed = getAllowedStatuses(repair.status)

    if (
      newStatus !== repair.status &&
      !allowed.includes(newStatus)
    ) {
      showToast("Invalid status transition", "error")
      return
    }

    // 🔥 READY → OPEN MODAL
    if (newStatus === "ready") {
    setSelectedRepair(repair)
    setShowFixModal(true)

  return
}
    await supabase
      .from("repairs")
      .update({ status: newStatus })
      .eq("id", repair.id)

    setRepairs(prev =>
      prev.map(r =>
        r.id === repair.id ? { ...r, status: newStatus } : r
      )
    )

    sendWhatsApp({ ...repair, status: newStatus })
  }

  // 🔥 CONFIRM READY
const confirmReady = async () => {

  if (!selectedRepair) return

  if (!fixStatus) {
    showToast("Select result", "error")
    return
  }

if (fixStatus === "fixed") {
  let totalCost = 0
  for (const p of parts) {

    const item = stockItems.find(
      s => s.type === p.type && s.quality === p.quality
    )

    

    if (!item) {
      showToast("Part not found", "error")
      return
    }

    if (item.quantity < p.quantity) {
      showToast("Not enough stock", "error")
      return
    }

    totalCost += item.cost_price * p.quantity

    // insert
    await supabase.from("repair_parts").insert({
      shop_id: shop.id,
      repair_id: selectedRepair.id,
      stock_item_id: item.id,
      quantity: p.quantity,
      cost_price: item.cost_price
    })
    
    await supabase
    .from("repairs")
    .update({
    cost_price: totalCost
    })
    .eq("id", selectedRepair.id)

    // update stock
    await supabase
      .from("stock_items")
      .update({
        quantity: item.quantity - p.quantity
      })
      .eq("id", item.id)
  }
}

  // 🔥 1. update repair
  await supabase
    .from("repairs")
    .update({
      status: "ready",
      fix_status: fixStatus,
      no_warranty: noWarranty
    })
    .eq("id", selectedRepair.id)



  // 🔥 UI update
  setRepairs(prev =>
    prev.map(r =>
      r.id === selectedRepair.id
        ? { ...r, status: "ready", fix_status: fixStatus, no_warranty: noWarranty }
        : r
    )
  )

  setShowFixModal(false)
  setFixStatus("")
  setNoWarranty(false)
  setSelectedStock(null)
  setPartQty(1)
}

  // =========================
  // 🔍 FILTER
  // =========================
  const filtered = repairs.filter(r => {

    const matchesSearch =
      r.customer?.toLowerCase().includes(search.toLowerCase()) ||
      r.device?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.imei?.includes(search)

    const matchesStatus =
      statusFilter === "all" || r.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // =========================
  // UI
  // =========================
  return (
    <PageWrapper>
      <Card>
       
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

          <h1 className="text-xl md:text-3xl font-bold">
            {t("viewRepairs")}
          </h1>

          <div className="flex flex-col md:flex-row gap-2 w-full">

            <input
              placeholder={t("searchRepair")}
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full md:w-auto flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
            />

            <select
              value={statusFilter}
              onChange={(e)=>setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">All</option>
              <option value="received">{tStatus("received")}</option>
              <option value="in-repair">{tStatus("in-repair")}</option>
              <option value="pending-answer">{tStatus("pending-answer")}</option>
              <option value="pending-parts">{tStatus("pending-parts")}</option>
              <option value="ready">{tStatus("ready")}</option>
              <option value="delivered">{tStatus("delivered")}</option>
            </select>

          </div>

        </div>

        {loading && (
          <div className="text-center text-slate-400 animate-pulse">
            {t("loading")}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <EmptyState
            title="No repairs found"
            description="Try changing search or add a new repair"
          />
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid gap-4">

            {filtered.map((r)=>{
            const createdDate = r.created_at? new Date(r.created_at).toLocaleDateString(): ""
              const profit = (Number(r.price || 0) - Number(r.cost_price || 0))
              const isLate =
                (Date.now() - new Date(r.created_at).getTime()) / (1000*60*60*24) > 2 &&
                r.status !== "delivered"

              const allowedStatuses = getAllowedStatuses(r.status)

              return (
                <motion.div key={r.id} whileHover={{ scale: 1.02 }}
                  className="bg-slate-900/60 border border-white/10 rounded-xl p-5 hover:border-indigo-500 transition">

                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">

                    <div>
                      <p className="font-bold text-xl">{r.customer}</p>

                      <span className="inline-block text-sm font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg mt-2 shadow-md">
                        #{r.order_number}
                      </span>

                      <p className="text-slate-400 mt-1">{r.device}</p>
                      {/* 📅 DATE */}
                      {createdDate && (
                        <p className="text-xs text-slate-500 
                        mt-1">
                       📅 {createdDate}
                       </p>
                       )}
                       {(r.received_by || r.created_at || r.pickup_at) && (
                        <p className="text-xs text-slate-400 mt-1 flex flex-wrap gap-2 items-center">

                          {/* 👤 الموظف */}
                          {r.received_by && (
                          <span className="text-green-400">👤 {r.received_by}</span>
                          )}

                          {/* 🕒 وقت الاستلام الفعلي */}
                         {r.created_at && (
                          <span className="text-yellow-400">
                          🕒 {new Date(r.created_at).toLocaleTimeString()}
                          </span>
                         )}

                         {/* ⏱ وقت الاستلام المتوقع */}
                         {r.pickup_at && (
                          <span className="text-red-400">
                           ⏰ {(() => {
                            const clean = r.pickup_at.replace("T", " ").replace("+00:00", "")
                            const [date, time] = clean.split(" ")

                            if (!date || !time) return "-"

                            const [y, m, d] = date.split("-")
                            const [h, min] = time.split(":")

                           return `${d}-${m}-${y} ${h}:${min}`
                           })()}
                          </span>
                          )}

                        </p>
                        )}

                      {isLate && (
                        <p className="text-red-400 text-xs mt-1">
                          ⚠️ Delayed
                        </p>
                      )}
                    </div>
                    

                    <select
                      value={r.status}
                      onChange={(e)=>updateStatus(r, e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-800 text-white border border-white/10"
                    >
                      {[r.status, ...allowedStatuses].map(s => (
                        <option key={s} value={s}>
                          {tStatus(s)}
                        </option>
                      ))}
                    </select>

                    

                  </div>

                  <div className="mt-3 text-sm text-slate-400 flex flex-col md:flex-row gap-2 md:gap-4">
                    <span>📞 {r.phone}</span>
                    <span>IMEI: {r.imei || "-"}</span>

                    <span className="text-green-400 font-semibold">
                      💰 {r.price} €
                    </span>

                    <div className="flex gap-2 mt-3 flex-wrap">

                    {/* 🔥 RESULT */}
                      {r.fix_status === "fixed" && (
                        <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full 
                        bg-green-500/10 text-green-400 border border-green-500/30 
                        backdrop-blur-md shadow-sm hover:scale-105 transition">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        ✔ {t("fixed")}
                        </span>
                        )}
                       {r.fix_status === "not-fixed" && (
                         <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full 
                         bg-red-500/10 text-red-400 border border-red-500/30 
                         backdrop-blur-md shadow-sm hover:scale-105 transition">
                         <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                          ✖ {t("notFixed")}
                         </span>
                         )}

                      {r.no_warranty && (
                          <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full 
                         bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 
                         backdrop-blur-md shadow-sm hover:scale-105 transition">
                         ⚠ {t("noWarranty")}
                         </span>
                         )}
                        </div>
                  </div>

                  <div className="grid grid-cols-2 md:flex gap-2 mt-4">

                    <button
                      onClick={() => window.open(`/print/${r.id}`, "_blank")}
                      className="px-3 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500"
                    >
                      🖨️
                    </button>

                    <button
                      onClick={()=>router.push(`/view-repair/${r.id}`)}
                      className="px-3 py-2 bg-slate-800 rounded-lg hover:bg-indigo-600"
                    >
                      {t("view")}
                    </button>

                    <button
                      onClick={()=>router.push(`/edit-repair/${r.id}`)}
                      className="px-3 py-2 bg-slate-800 rounded-lg hover:bg-indigo-600"
                    >
                      {t("edit")}
                    </button>

                    <button
                      onClick={()=>sendWhatsApp(r)}
                      className="px-3 py-2 bg-green-600 rounded-lg hover:bg-green-500"
                    >
                      WhatsApp
                    </button>

                    <button
                      onClick={()=>deleteRepair(r.id)}
                      className="px-3 py-2 bg-red-600 rounded-lg hover:bg-red-500"
                    >
                      Delete
                    </button>
                     <button
                     onClick={() => loadRepairParts(r)}
                    className="px-3 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 text-xs"
                     >
                     {t("ShowChangedParts")}
                     </button>
                     {/* 🔥 SHOW PARTS */}
                     {openParts[r.id] && partsData[r.id] && (
                     <div className="mt-4 bg-slate-800/50 p-3 rounded-lg border border-white/10">

                        <p className="text-xs text-slate-400 mb-2">
                         Changed Parts:
                        </p>

                        {partsData[r.id].map((p: any, i: number) => (
                       <div
                          key={i}
                          className="flex justify-between text-xs border-b border-white/5 py-1"
                          >
                          <span>
                           {p.stock_items?.type} - {p.stock_items?.quality}
                          </span>

                          <span className="text-red-400">
                            {p.cost_price} €
                          </span>

                          <span>
                            x{p.quantity}
                          </span>
                        </div>
                      ))}

                      </div>
                      )}
                  </div>

                </motion.div>
              )
            })}

          </div>
        )}

      </Card>

      {/* PIN */}
      {showPin && (
        <PinModal
          correctPin={shop?.profit_pin}
          onClose={() => setShowPin(false)}
          onSuccess={confirmDelete}
        />
      )}

      {/* 🔥 READY MODAL */}
{showFixModal && typeof window !== "undefined" && createPortal(

  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 999999
    }}
    className="flex items-start justify-center pt-10 md:pt-20 bg-black/70 backdrop-blur-sm"
  >

    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800 
      border border-white/10 shadow-2xl rounded-2xl w-[340px] p-6 space-y-5"
    >

      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-white">
          {t("repairResult")}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {t("selectRepairOutcome") || "Select repair outcome"}
        </p>
      </div>

      {/* OPTIONS */}
       <div className="space-y-4">
       {fixStatus === "fixed" && (
  <div className="space-y-3 mt-4">

    <p className="text-xs text-slate-400">
      Device: {selectedRepair?.device}
    </p>

    {parts.map((p, i) => (
      <div key={i} className="flex gap-2">

        {/* TYPE */}
        <select
          value={p.type}
          onChange={(e)=>{
            const newParts = [...parts]
            newParts[i].type = e.target.value
            setParts(newParts)
          }}
          className="flex-1 bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs"
        >
          <option value="">{t("type")}</option>
          {[...new Set(stockItems.map(s=>s.type))].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>

        {/* QUALITY */}
        <select
          value={p.quality}
          onChange={(e)=>{
            const newParts = [...parts]
            newParts[i].quality = e.target.value
            setParts(newParts)
          }}
          className="flex-1 bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs"
        >
          <option value="">{t("quality")}</option>
          {[...new Set(stockItems.map(s=>s.quality))].map(q => (
            <option key={q}>{q}</option>
          ))}
        </select>

        {/* QTY */}
        <input
          type="number"
          min={1}
          value={p.quantity}
          onChange={(e)=>{
            const newParts = [...parts]
            newParts[i].quantity = Number(e.target.value)
            setParts(newParts)
          }}
          className="w-16 bg-slate-800 border border-white/10 rounded px-2 text-xs"
        />

      </div>
    ))}

    {/* ADD PART */}
    <button
      onClick={() => setParts([...parts, { type:"", quality:"", quantity:1 }])}
      className="text-xs text-indigo-400"
    >
     + {t("addmorePart")}
    </button>

  </div>
)}
         {/* FIXED */}
         <motion.div
          whileHover={{ scale: 1.03 }}
         whileTap={{ scale: 0.97 }}
         onClick={()=>{
         setFixStatus("fixed")
         setParts([{ type: "", quality: "", quantity: 1 }])

         loadStock() // 🔥 الحل الحقيقي
         }}
          className={`
          cursor-pointer p-4 rounded-xl border transition
         flex justify-between items-center

          ${fixStatus === "fixed"
          ? "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_25px_rgba(34,197,94,0.3)]"
         : "bg-slate-800 border-white/10 hover:border-green-500"}
         `}
          >
         <div className="flex items-center gap-3">
         <span className="text-xl">✔</span>
         <div>
          <p className="font-semibold">{t("fixed")}</p>
         <p className="text-xs text-slate-400">Device repaired successfully</p>
         </div>
    </div>

    {fixStatus === "fixed" && (
      <span className="text-green-400 text-lg">✓</span>
    )}
  </motion.div>

  {/* NOT FIXED */}
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={()=>setFixStatus("not-fixed")}
    className={`
      cursor-pointer p-4 rounded-xl border transition
      flex justify-between items-center

      ${fixStatus === "not-fixed"
        ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.3)]"
        : "bg-slate-800 border-white/10 hover:border-red-500"}
    `}
  >
    <div className="flex items-center gap-3">
      <span className="text-xl">✖</span>
      <div>
        <p className="font-semibold">{t("notFixed")}</p>
        <p className="text-xs text-slate-400">Repair was not possible</p>
      </div>
    </div>

    {fixStatus === "not-fixed" && (
      <span className="text-red-400 text-lg">✓</span>
    )}
  </motion.div>

</div>

      {/* WARRANTY */}
      <motion.div
         whileTap={{ scale: 0.97 }}
         onClick={()=>setNoWarranty(!noWarranty)}
        className={`flex items-center justify-between cursor-pointer p-3 rounded-xl border transition
        ${noWarranty
          ? "bg-yellow-500/20 border-yellow-500 text-yellow-400 scale-105"
          : "bg-slate-800 border-white/10 hover:border-yellow-500 hover:scale-[1.02]"}`}
      >
        <span>⚠ {t("noWarranty")}</span>
        <div className={`w-5 h-5 rounded border flex items-center justify-center
          ${noWarranty ? "bg-yellow-400 text-black" : "border-white/20"}`}>
          {noWarranty && "✓"}
        </div>
      </motion.div>
      {/* BUTTON */}
      <button
        disabled={!fixStatus}
        onClick={confirmReady}
        className="w-full h-12 rounded-xl font-semibold
       bg-gradient-to-r from-indigo-600 to-indigo-500
       hover:from-indigo-500 hover:to-indigo-400
        disabled:opacity-30
       transition active:scale-95
       shadow-lg"
       >
        {t("confirm")}
      </button>

    </motion.div>

  </div>,

  document.body
)}
{showPartsModal && typeof window !== "undefined" && createPortal(

  <div className="fixed inset-0 z-[999999] flex items-center justify-center">

    {/* BACKDROP */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowPartsModal(false)}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
    />

    {/* MODAL */}
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="relative w-[92%] max-w-lg rounded-3xl 
      bg-gradient-to-br from-slate-900 to-slate-800 
      border border-white/10 shadow-2xl p-6"
    >

      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">
          {t("changedParts")}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {t("device")}: {selectedDevice}
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">

        {selectedParts.length === 0 && (
          <p className="text-sm text-slate-400 text-center">
            {t("noParts")}
          </p>
        )}

        {selectedParts.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex justify-between items-center 
            bg-slate-800/70 border border-white/5 
            rounded-xl p-3 hover:border-indigo-500 
            transition"
          >

            {/* LEFT */}
            <div>
              <p className="text-white text-sm font-medium">
                {p.stock_items?.type}
              </p>
              <p className="text-xs text-slate-400">
                {p.stock_items?.quality}
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="text-red-400 font-semibold text-sm">
                {p.cost_price} €
              </p>
              <p className="text-xs text-slate-300">
                x{p.quantity}
              </p>
            </div>

          </motion.div>
        ))}

      </div>

      {/* TOTAL */}
      <div className="mt-5 pt-4 border-t border-white/10 flex justify-between text-sm">

        <span className="text-slate-400">{t("totalCost")}</span>

        <span className="text-red-400 font-bold">
          {selectedParts.reduce((sum, p) => sum + (p.cost_price * p.quantity), 0)} €
        </span>

      </div>

      {/* BUTTON */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPartsModal(false)}
        className="mt-5 w-full h-11 rounded-xl font-semibold
        bg-gradient-to-r from-indigo-600 to-indigo-500
        hover:from-indigo-500 hover:to-indigo-400
        transition shadow-lg"
      >
        {t("close")}
      </motion.button>

    </motion.div>

  </div>,

  document.body
)}
    </PageWrapper>
  )
}