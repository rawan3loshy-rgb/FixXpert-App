"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import { validateStatus } from "@/lib/repairs/status"
import { t, tStatus } from "@/lib/text"

import Card from "@/components/ui/card"
import PageWrapper from "@/components/ui/page-wrapper"
import { motion } from "framer-motion" // ✅ جديد

export default function ViewRepair(){

  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [repair,setRepair] = useState<any>(null)
  const [history,setHistory] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  // 🔥 NEW STATE (modal)
  const [showFixModal,setShowFixModal] = useState(false)
  const [fixStatus,setFixStatus] = useState("")
  const [noWarranty,setNoWarranty] = useState(false)
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

  useEffect(()=>{
    if(!id) return
    fetchData()
    fetchHistory()
  },[id])
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
  const fetchData = async ()=>{
    const { data } = await supabase
      .from("repairs")
      .select("*")
      .eq("id", id)
      .single()

    setRepair(data)
    setLoading(false)
  }

  const fetchHistory = async ()=>{
    const { data } = await supabase
      .from("repair_logs")
      .select("*")
      .eq("repair_id", id)
      .order("created_at", { ascending: false })

    setHistory(data || [])
  }

  // 🔥 UPDATED FUNCTION (بدون حذف القديم)
  const updateStatus = async (newStatus: string) => {

    if(!repair) return

    const allowed = getAllowedStatuses(repair.status)
    // ❌ منع القفز
    if (
      newStatus !== repair.status &&
      !allowed.includes(newStatus)
    ) {
      alert("Invalid status transition")
      return
    }

    // 🔥 READY → MODAL
    if (newStatus === "ready") {
      setShowFixModal(true)
      return
    }

    const currentStatus = repair.status

    await supabase
      .from("repairs")
      .update({ status: newStatus })
      .eq("id", repair.id)

    setRepair((prev:any) => ({
      ...prev,
      status: newStatus
    }))

    await supabase.from("repair_logs").insert({
      repair_id: repair.id,
      action: "status",
      old_value: currentStatus,
      new_value: newStatus
    })
  }

  // 🔥 CONFIRM READY
  const confirmReady = async () => {

    if (!fixStatus) {
      alert("Select result")
      return
    }

    const currentStatus = repair.status

    await supabase
      .from("repairs")
      .update({
        status: "ready",
        fix_status: fixStatus,
        no_warranty: noWarranty
      })
      .eq("id", repair.id)

    setRepair((prev:any)=>({
      ...prev,
      status:"ready",
      fix_status:fixStatus,
      no_warranty:noWarranty
    }))

    await supabase.from("repair_logs").insert({
      repair_id: repair.id,
      action: "status",
      old_value: currentStatus,
      new_value: "ready"
    })

    setShowFixModal(false)
    setFixStatus("")
    setNoWarranty(false)
  }

  // 🔥 KEYBOARD SUPPORT
  useEffect(() => {
    if (!showFixModal) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFixModal(false)
      if (e.key === "Enter" && fixStatus) confirmReady()
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)

  }, [showFixModal, fixStatus])

  const timeAgo = (date:any)=>{
    const seconds = Math.floor((Date.now() - new Date(date).getTime())/1000)

    if(seconds < 60) return t("justNow") || "just now"
    if(seconds < 3600) return Math.floor(seconds/60)+"m"
    if(seconds < 86400) return Math.floor(seconds/3600)+"h"
    return Math.floor(seconds/86400)+"d"
  }

  if(loading) return <p className="p-10 text-white">{t("loading")}</p>
  if(!repair) return <p className="p-10 text-white">{t("repairNotFound")}</p>

  const steps = [
    "received",
    "in-repair",
    "pending-answer",
    "pending-parts",
    "ready",
    "delivered"
  ]

  const currentIndex = steps.indexOf(repair.status)
  const allowedStatuses = getAllowedStatuses(repair.status)
  const createdDate = repair.created_at? new Date(repair.created_at).toLocaleDateString(): ""
  return(
   <PageWrapper>
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => router.push("/repairs")}
          className="mb-6 px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 transition text-sm"
        >
          ← {t("backToRepairs")}
        </button>

        <h1 className="text-3xl font-bold mb-6">
          {t("repairReceipt")} #{repair.order_number}
        </h1>

        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 mb-6 space-y-2">

          <p><b>{t("customerLabel")}:</b> {repair.customer}</p>
          <p><b>{t("phone")}:</b> {repair.phone}</p>
          <p><b>{t("deviceLabel")}:</b> {repair.device}</p>
          <p><b>{t("problemLabel")}:</b> {repair.problem}</p>
          {/* 📅 CREATED DATE */}
          {createdDate && (
            <p className="text-xs text-slate-400
            mt-2"> 
            📅 {createdDate}</p>
          )}

          {/* 🔥 NEW INFO */}
          <div className="flex gap-2 mt-2 flex-wrap">

         {/* FIX STATUS */}
         {repair.fix_status === "fixed" && (
         <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full 
          bg-green-500/10 text-green-400 border border-green-500/30 
          backdrop-blur-md shadow-sm hover:scale-105 transition">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          ✔ {t("fixed")}
          </span>
          )}

         {repair.fix_status === "not-fixed" && (
         <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full 
         bg-red-500/10 text-red-400 border border-red-500/30 
         backdrop-blur-md shadow-sm hover:scale-105 transition">
         <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
         ✖ {t("notFixed")}
         </span>
          )}

          {/* WARRANTY */}
          {repair.no_warranty && (
           <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full 
            bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 
           backdrop-blur-md shadow-sm hover:scale-105 transition">
           ⚠ {t("noWarranty")}
          </span>
         )}
  
         </div>
          <div className="mt-4">
            <select
              value={repair.status}
              onChange={(e)=>updateStatus(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
            >
              {[repair.status, ...allowedStatuses].map(s=>(
                <option key={s} value={s}>
                  {tStatus(s)}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* TIMELINE */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-6">
            🕒 {t("timeline")}
          </h2>

          {history.length === 0 && (
            <p className="text-slate-400">
              {t("noHistory")}
            </p>
          )}

          <div className="border-l border-white/10 pl-6">

            {history.map((h)=>(
              <div key={h.id} className="mb-6 relative">

                <div className="absolute -left-3 top-2 w-3 h-3 bg-indigo-500 rounded-full"/>

                <Card>
                  <p className="font-medium">
                    {t("statusLabel")} → {tStatus(h.new_value)}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {timeAgo(h.created_at)}
                  </p>

                </Card>

              </div>
            ))}

          </div>

        </div>

        {/* PROGRESS */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 mt-6">

          <h2 className="text-lg font-semibold mb-6">
            {t("repairPipeline")}
          </h2>

          <div className="flex justify-between items-center relative">

            {steps.map((step, i)=>{

              const active = i <= currentIndex

              return (
                <div key={step} className="text-center flex-1">

                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold
                    ${active ? "bg-indigo-600" : "bg-slate-700"}`}>
                    {i+1}
                  </div>

                  <p className={`mt-2 text-xs ${active ? "text-white" : "text-slate-500"}`}>
                    {tStatus(step)}
                  </p>

                </div>
              )
            })}
  
            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-700 -z-10"/>
            <div
              className="absolute top-5 left-0 h-1 bg-indigo-600 -z-10 transition-all"
              style={{ width: `${(currentIndex/(steps.length-1))*100}%` }}
            />

          </div>

        </div>

      </div>

      {/* 🔥 MODAL */}
{showFixModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

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
      <div className="space-y-3">

        <div
          onClick={()=>setFixStatus("fixed")}
          className={`cursor-pointer p-3 rounded-xl border transition flex justify-between items-center
          ${fixStatus === "fixed"
            ? "bg-green-500/20 border-green-500 text-green-400 scale-105"
            : "bg-slate-800 border-white/10 hover:border-green-500 hover:scale-[1.02]"}`}
        >
          ✔ {t("fixed")}
        </div>

        <div
          onClick={()=>setFixStatus("not-fixed")}
          className={`cursor-pointer p-3 rounded-xl border transition flex justify-between items-center
          ${fixStatus === "not-fixed"
            ? "bg-red-500/20 border-red-500 text-red-400 scale-105"
            : "bg-slate-800 border-white/10 hover:border-red-500 hover:scale-[1.02]"}`}
        >
          ✖ {t("notFixed")}
        </div>

      </div>

      {/* WARRANTY */}
      <div
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
      </div>

      {/* BUTTON */}
      <button
        disabled={!fixStatus}
        onClick={confirmReady}
        className="w-full h-12 rounded-xl font-semibold 
        bg-indigo-600 hover:bg-indigo-500 
        disabled:opacity-40 transition active:scale-95"
      >
        {t("confirm")}
      </button>

    </motion.div>
  </div>
)}
    </div>
    </PageWrapper>
  )
}