"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // ✅ جديد
import BackButton from "@/components/BackButton"
import { motion } from "framer-motion"
import { t } from "@/lib/text"

export default function TrackPage(){

  const [order,setOrder] = useState("")
  const router = useRouter() // ✅ جديد

  const handleTrack = () => {
    if(!order.trim()) return

    // 🔥 الحل الأساسي
    router.push(`/track/${order}`) 
  }

  return(

    <div className="relative min-h-[80vh] flex items-center justify-center p-6">

      {/* BACKGROUND */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 blur-[140px] rounded-full" />

      {/* ========================= */}
      {/* 🔍 SEARCH UI */}
      {/* ========================= */}
      <motion.div
        initial={{opacity:0, scale:0.9}}
        animate={{opacity:1, scale:1}}
        className="
          w-full max-w-lg
          bg-white/5 backdrop-blur-2xl
          border border-white/10
          rounded-3xl
          p-10
          shadow-[0_0_80px_rgba(99,102,241,0.35)]
          relative z-10
        "
      >

        <div className="mb-4">
          <BackButton />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            🔍 {t("trackTitle")}
          </h1>

          <p className="text-slate-400 text-sm mt-2">
            {t("trackSubtitle")}
          </p>
        </div>

        <input
          value={order}
          onChange={(e)=>setOrder(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter") handleTrack()
          }}
          placeholder={t("orderPlaceholder")}
          className="
            w-full px-5 py-4
            rounded-xl
            bg-white/5
            border border-white/10
            outline-none
            text-white text-center text-lg
            focus:border-indigo-500
            focus:shadow-[0_0_25px_rgba(99,102,241,0.6)]
          "
        />

        <motion.button
          onClick={handleTrack}
          whileHover={{scale:1.05}}
          whileTap={{scale:0.95}}
          className="
            mt-6 w-full py-3 rounded-xl
            bg-gradient-to-r from-indigo-500 to-cyan-400
            font-semibold text-white
          "
        >
          {t("trackButton")}
        </motion.button>

      </motion.div>

    </div>
  )
}