"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import { t } from "@/lib/text"

import CustomerSection from "@/components/add-repair/customer-section"
import RepairSection from "@/components/add-repair/repair-section"
import DeviceSearch from "@/components/add-repair/device-search"
import ProblemSearch from "@/components/add-repair/problem-search"
import BackButton from "@/components/BackButtonr"
import { updateRepair } from "@/lib/repairs/update.repair"

import Card from "@/components/ui/card"
import PageWrapper from "@/components/ui/page-wrapper"
import Button from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-provider"

export default function EditRepair(){

  const params = useParams()
  const id = params?.id as string
  const router = useRouter()

  const [loading,setLoading] = useState(true)
  const [saving,setSaving] = useState(false)
  const [originalRepair,setOriginalRepair] = useState<any>(null)
  const { showToast } = useToast()

  const [customer,setCustomer] = useState("")
  const [phone,setPhone] = useState("")
  const [device,setDevice] = useState("")
  const [imei,setImei] = useState("")
  const [problem,setProblem] = useState("")
  const [price,setPrice] = useState("")
  const [status,setStatus] = useState("received")
  const [technician,setTechnician] = useState("")
  const [returned,setReturned] = useState(false)
  const [pickupTime,setPickupTime] = useState("")
  const [description,setDescription] = useState("")
  const createdDate = originalRepair?.created_at? new Date(originalRepair.created_at).toLocaleDateString(): ""
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

  const allowedStatuses = getAllowedStatuses(originalRepair?.status || status)

  // =========================
  // 🔄 LOAD
  // =========================
  useEffect(()=>{
    if(!id) return
    fetchRepair()
  },[id])

  const fetchRepair = async ()=>{
    try {
      const { data } = await supabase
        .from("repairs")
        .select("*")
        .eq("id", id)
        .single()

      setOriginalRepair(data)

      setCustomer(data.customer || "")
      setPhone(data.phone || "")
      setDevice(data.device || "")
      setImei(data.imei || "")
      setProblem(data.problem || "")
      setPrice(String(data.price || ""))
      setStatus(data.status || "received")
      setTechnician(data.technician || "")
      setReturned(data.returned || false)
      setPickupTime(data.pickup_time || "")
      setDescription(data.description || "")

    } catch (err:any) {
      showToast(err.message || t("updateFailed"), "error")
      router.push("/repairs")
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // 💾 SAVE
  // =========================
  const handelUpdate = async (e:React.FormEvent)=>{
    e.preventDefault()

    if (!originalRepair || saving) return
    setSaving(true)

    try {

      if (originalRepair.status === "delivered") {
        showToast(t("cannotEditDelivered") || "Cannot edit delivered repair", "error")
        return
      }

      if (
        originalRepair.status === "ready" &&
        status !== "delivered"
      ) {
        showToast(t("onlyDeliveredAllowed") || "Only delivered allowed", "error")
        return
      }

      if (status !== originalRepair.status &&!allowedStatuses.includes(status)
        ) {
       throw new Error(t("invalidStatus") || "Invalid status transition")
       }

      await updateRepair(id, {
        customer,
        phone,
        device,
        imei,
        problem,
        price: Number(price || 0),
        status,
        technician,
        returned,
        pickup_time: pickupTime,
        description
      })

      showToast(t("updatedSuccess") || "Updated successfully", "success")
      router.push("/repairs")

    } catch (err:any) {
      showToast(err.message || t("updateFailed"), "error")
    } finally {
      setSaving(false)
    }
  }

  // =========================
  // ⏳ LOADING
  // =========================
  if(loading){
    return <p className="p-10 text-white">{t("loading")}</p>
  }

  // =========================
  // UI
  // =========================
  return(
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-6">

                <button
          onClick={() => router.push("/repairs")}
          className="mb-6 px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 transition text-sm"
        >
          ← {t("backToRepairs") || "Back to Repairs"}
        </button>

        <div className="mb-6">

         <h1 className="text-3xl font-bold flex items-center gap-3">
         {t("edit")}
         <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
          #{originalRepair?.order_number}
         </span>
         </h1>

         {createdDate && (
           <div className="text-sm text-slate-400 mt-2 flex flex-wrap gap-4">

              {/* 📅 التاريخ */}
              <span>📅 {createdDate}</span>

               {/* 🕒 وقت الاستلام */}
                {originalRepair?.created_at && (
                <span className="text-green-400">
                  🕒 {new Date(originalRepair.created_at).toLocaleTimeString()}
                </span>
              )}

            </div>
            )}
         

        </div>
          
        <form onSubmit={handelUpdate} className="space-y-6">
         
          {/* CUSTOMER */}
          <Card>
            <p className="text-xs text-slate-400">{t("customerLabel")}</p>

            <CustomerSection
              customer={customer}
              setCustomer={setCustomer}
              phone={phone}
              setPhone={setPhone}
            />
          </Card>

          {/* DEVICE */}
          <Card>
            <p className="text-xs text-slate-400">{t("deviceLabel")}</p>

            <DeviceSearch device={device} setDevice={setDevice} />

            <input
              placeholder={t("imei")}
              value={imei}
              onChange={(e)=>setImei(e.target.value)}
              className="w-full mt-3 h-12 px-4 rounded-xl bg-slate-800 border border-white/10 text-white"
            />
          </Card>

          {/* PROBLEM */}
          <Card>
            <p className="text-xs text-slate-400">{t("problemLabel")}</p>

            <ProblemSearch
              problem={problem}
              setProblem={setProblem}
            />
          </Card>

          {/* DETAILS */}
          <Card>
            <p className="text-xs text-slate-400">{t("description")}</p>

            <RepairSection
              price={price}
              setPrice={setPrice}
              status={status}
              setStatus={setStatus}
              technician={technician}
              setTechnician={setTechnician}
              returned={returned}
              setReturned={setReturned}
              description={description}
              setDescription={setDescription}
              allowedStatuses={allowedStatuses}
            />
          </Card>
          {/* 🔥 TECHNICIAN & RECEIVED */}
         <Card>
            <div className="grid md:grid-cols-2 gap-4">

              {/* 👨‍🔧 Technician */}
             <div>
               <p className="text-xs text-slate-400 mb-1">
               {t("technicianLabel")}
                </p>

                <div className="h-12 flex items-center px-4 rounded-xl bg-slate-800 border border-white/10 text-white">
                  {originalRepair?.technician || "-"}
               </div>
              </div>

              {/* 👤 Received By */}
              <div>
               <p className="text-xs text-slate-400 mb-1">
                 {t("receiverLabel")}
               </p>

                <div className="h-12 flex items-center px-4 rounded-xl bg-slate-800 border border-white/10 text-white">
                  {originalRepair?.received_by || "-"}
               </div>
             </div>

            </div>
          </Card>

          {/* PICKUP */}
          <Card>
            <p className="text-xs text-slate-400">{t("pickupTime")}</p>

            <input
              type="time"
              value={pickupTime}
              onChange={(e)=>setPickupTime(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-white/10 text-white"
            />
          </Card>

          {/* BUTTON */}
          <Button
            type="submit"
            disabled={saving}
            className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700"
          >
            {saving ? t("saving") || "Saving..." : t("saveChanges") || "Save Changes"}
          </Button>

        </form>

      </div>
    </PageWrapper>
  )
}