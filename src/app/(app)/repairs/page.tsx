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
 
  // 🔐 PIN SYSTEM
  const [shop, setShop] = useState<any>(null)
  const [showPin, setShowPin] = useState(false)
  const [selectedDelete, setSelectedDelete] = useState<any>(null)

  // 🔥 NEW READY MODAL
  const [showFixModal, setShowFixModal] = useState(false)
  const [selectedRepair, setSelectedRepair] = useState<any>(null)
  const [fixStatus, setFixStatus] = useState("")
  const [noWarranty, setNoWarranty] = useState(false)

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

    await supabase
      .from("repairs")
      .update({
        status: "ready",
        fix_status: fixStatus,
        no_warranty: noWarranty
      })
      .eq("id", selectedRepair.id)

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
       
        <BackButton />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

          <h1 className="text-3xl font-bold">
            {t("viewRepairs")}
          </h1>

          <div className="flex gap-2">

            <input
              placeholder={t("searchRepair")}
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
            />

            <select
              value={statusFilter}
              onChange={(e)=>setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
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
              const profit = (Number(r.price || 0) - Number(r.cost || 0))
              const isLate =
                (Date.now() - new Date(r.created_at).getTime()) / (1000*60*60*24) > 2 &&
                r.status !== "delivered"

              const allowedStatuses = getAllowedStatuses(r.status)

              return (
                <motion.div key={r.id} whileHover={{ scale: 1.02 }}
                  className="bg-slate-900/60 border border-white/10 rounded-xl p-5 hover:border-indigo-500 transition">

                  <div className="flex justify-between items-start gap-4">

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

                  <div className="mt-3 text-sm text-slate-400 flex flex-wrap gap-4">
                    <span>📞 {r.phone}</span>
                    <span>IMEI: {r.imei || "-"}</span>

                    <span className="text-green-400 font-semibold">
                      💰 {profit} €
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

                  <div className="flex flex-wrap gap-2 mt-4">

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

         {/* FIXED */}
         <motion.div
          whileHover={{ scale: 1.03 }}
         whileTap={{ scale: 0.97 }}
         onClick={()=>setFixStatus("fixed")}
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
    </PageWrapper>
  )
}