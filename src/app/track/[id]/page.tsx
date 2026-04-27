"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
import PageWrapper from "@/components/ui/page-wrapper"
import { t, tStatus } from "@/lib/text"
import { motion } from "framer-motion"

export default function TrackRepair(){

  const params = useParams()
  const id = params?.id as string

  const [mounted,setMounted] = useState(false)
  const [repair,setRepair] = useState<any>(null)
  const [loading,setLoading] = useState(true)
  const [canSound,setCanSound] = useState(false)
  

  // =========================
  // 🔥 FIX HYDRATION
  // =========================
  useEffect(()=>{
    setMounted(true)
  },[])

  // 🔊 enable sound
  useEffect(()=>{
    const enable = () => {
      setCanSound(true)
      window.removeEventListener("click", enable)
    }
    window.addEventListener("click", enable)
    return ()=>window.removeEventListener("click", enable)
  },[])

  const playSound = ()=>{
    if(!canSound) return
    const audio = new Audio("/notify.mp3")
    audio.play().catch(()=>{})
  }

  // =========================
  // 🔥 LOAD + REALTIME
  // =========================
  useEffect(()=>{

    if(!mounted || !id) return

    const load = async ()=>{
      const isUUID = id.includes("-")

      const { data } = await supabase
      .from("repairs")
      .select("*")
      .eq(isUUID ? "id" : "order_number", isUUID ? id : Number(id))
      .single()

      setRepair(data)
      setLoading(false)
    }

    load()

    const channel = supabase
      .channel("track-repair")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "repairs"
        },
        (payload:any)=>{

          const isUUID = id.includes("-")

          if(
          (isUUID && payload.new.id === id) ||
          (!isUUID && payload.new.order_number == Number(id))
         ){
          setRepair(payload.new)
          playSound()
          } 

        }
      )
      .subscribe()

    return ()=>{
      supabase.removeChannel(channel)
    }

  },[id, mounted])

  // =========================
  // STEPS
  // =========================
  const steps = [
    "received",
    "in-repair",
    "pending-parts",
    "ready",
    "delivered"
  ]

  const getStepIndex = (status:string)=>{
    return steps.findIndex(s => s === status)
  }

  const getStatusMessage = (status:string)=>{
    switch(status){
      case "received": return "Ihr Gerät wurde angenommen."
      case "in-repair": return "Ihr Gerät wird aktuell repariert."
      case "pending-parts": return "Wir warten auf Ersatzteile."
      case "ready": return "Ihr Gerät ist fertig zur Abholung."
      case "delivered": return "Das Gerät wurde erfolgreich abgeholt."
      default: return "Ihr Auftrag wird bearbeitet."
    }
  }

  // =========================
  // 🔥 STOP SSR MISMATCH
  // =========================
  if(!mounted) return null

  if(loading){
    return (
      <PageWrapper>
        <div className="h-screen flex items-center justify-center">
          <p className="text-slate-400 animate-pulse">
            {t("loading")}
          </p>
        </div>
      </PageWrapper>
    )
  }

  if(!repair){
    return (
      <PageWrapper>
        <div className="h-screen flex items-center justify-center">
          <p className="text-red-400">
            {t("repairNotFound")}
          </p>
        </div>
      </PageWrapper>
    )
  }

  const currentStep = getStepIndex(repair.status)

  return(
    <PageWrapper>

      <div className="min-h-screen flex items-center justify-center p-6 relative">

        {/* 🔥 BACKGROUND */}
        <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 blur-[140px] rounded-full" />

        <motion.div
          initial={{ opacity:0, scale:0.9 }}
          animate={{ opacity:1, scale:1 }}
          className="
            w-full max-w-xl
            bg-white/5 backdrop-blur-2xl
            border border-white/10
            rounded-3xl
            p-8
            shadow-[0_0_80px_rgba(99,102,241,0.35)]
            relative z-10
          "
        >

          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              🔧 Reparaturstatus
            </h1>

            <p className="text-slate-400 text-sm">
              Auftrag #{repair.order_number}
            </p>
          </div>

          {/* STATUS */}
          <motion.div
            key={repair.status}
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            className="mt-6 text-center"
          >
            <p className="text-lg font-semibold text-indigo-400">
              {getStatusMessage(repair.status)}
            </p>
          </motion.div>

          {/* ========================= */}
          {/* 🔥 PROGRESS */}
          {/* ========================= */}
          <div className="mt-12 relative">

            {/* LINE BACK */}
            <div className="absolute top-7 left-0 right-0 h-[3px] bg-slate-700 rounded-full" />

            {/* LINE PROGRESS */}
            <motion.div
              className="absolute top-7 left-0 h-[3px] bg-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(currentStep/(steps.length-1))*100}%`
              }}
              transition={{ duration:0.6 }}
            />

            <div className="flex justify-between relative z-10">

              {steps.map((step,index)=>{

                const active = index <= currentStep
                const isCurrent = index === currentStep

                return (
                  <motion.div
                    key={step}
                    initial={{ opacity:0, y:30 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:index * 0.1 }}
                    className="flex-1 text-center"
                  >

                    <div className={`
                      w-12 h-12 rounded-full mx-auto flex items-center justify-center text-sm font-bold
                      transition-all duration-300
                      ${active
                        ? "bg-indigo-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.8)]"
                        : "bg-slate-700 text-slate-400"
                      }
                      ${isCurrent ? "scale-110 animate-pulse" : ""}
                    `}>
                      {active && index !== currentStep ? "✓" : index+1}
                    </div>

                    <p className={`mt-3 text-xs ${
                      active ? "text-white" : "text-slate-500"
                    }`}>
                      {tStatus(step)}
                    </p>

                  </motion.div>
                )
              })}

            </div>

          </div>

          {/* INFO */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-800/60 border border-white/10 text-sm space-y-3">
            <p><b>{t("customerLabel")}:</b> {repair.customer}</p>
            <p><b>{t("deviceLabel")}:</b> {repair.device}</p>
            <p><b>{t("problemLabel")}:</b> {repair.problem}</p>
          </div>

          {/* FOOTER */}
          <div className="mt-10 text-center text-xs text-slate-500">
            Vielen Dank für Ihr Vertrauen 🙏
          </div>

        </motion.div>

      </div>

    </PageWrapper>
  )
}