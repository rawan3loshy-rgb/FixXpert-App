"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { t, tStatus } from "@/lib/text"

import Card from "@/components/ui/card"
import RepairPipeline from "@/components/dashboard/repair-pipeline"
import PageWrapper from "@/components/ui/page-wrapper"
import RepairChart from "@/components/dashboard/repairs-charts"
import StatusChart from "@/components/dashboard/status-charts"
import { useToast } from "@/components/ui/toast-provider"

import Skeleton from "@/components/ui/skeleton"
import EmptyState from "@/components/ui/empty-state"
import PinModal from "@/components/ui/pin-modal"

export default function Page() {

  const router = useRouter()
  const { addNotificationUnique, showToast } = useToast()

  const [repairs, setRepairs] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [profit, setProfit] = useState(0)
  const [loading, setLoading] = useState(true)

  const [showProfit, setShowProfit] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [shop, setShop] = useState<any>(null)

  const lockTimer = useRef<any>(null)

 useEffect(() => {

  const checkAccess = async () => {

    // 🔐 تحقق من session
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push("/login")
      
      return
      
    }

    // 🔥 تحقق OTP
    if (localStorage.getItem("otp_verified") !== "true") {
      router.push("/verify")
      return
    }

    // ✅ إذا كل شي تمام → حمّل البيانات
    load()
  }

  checkAccess()

}, [])
  useEffect(() => {
  const interval = setInterval(async () => {
    const loginTime = Number(localStorage.getItem("login_time"))

    if (!loginTime) return

    // ⏱️ بعد 10 ساعات
    if (Date.now() - loginTime > 10 * 60 * 60 * 1000) {
      await supabase.auth.signOut()

      localStorage.removeItem("otp_verified")

      router.push("/login")
    }
  }, 10000)

  return () => clearInterval(interval)
}, [])
  const load = async () => {

    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data: shopData } = await supabase
   .from("shops")
   .select("*")
   .eq("shop_id", session.user.id)
    .single()

   // ❗ تحقق مهم جداً
   if (!shopData) {
    showToast("Shop not found")

    await supabase.auth.signOut()
    router.push("/login")
    return
    }
   // 🔒 تحقق الاشتراك
   if (shopData?.subscription_status !== "active") {
    router.push("/billing")
    return
    }
    setShop(shopData)

    const { data } = await supabase
      .from("repairs")
      .select("*")
      .eq("shop_id", shopData.id)

    const now = new Date()

    const totalProfit = data?.reduce((sum, r) => {
      return sum + (Number(r.price || 0) - Number(r.cost || 0))
    }, 0) || 0

    const statsData = {
      total: data?.length || 0,
      today: data?.filter(r => new Date(r.created_at).toDateString() === now.toDateString()).length || 0,
      pending: data?.filter(r => r.status.includes("pending")).length || 0,
      delivered: data?.filter(r => r.status === "delivered").length || 0,
    }

    setRepairs(data || [])
    setStats(statsData)
    setProfit(totalProfit)

    setLoading(false)
  }

  const unlockProfit = () => {
    setShowPin(true)
  }

  const handleUnlockSuccess = () => {

    setShowProfit(true)
    setShowPin(false)

    if (lockTimer.current) clearTimeout(lockTimer.current)

    lockTimer.current = setTimeout(() => {
      setShowProfit(false)
    }, 20000)
  }

  const statusData = {
    received: repairs.filter(r => r.status === "received").length,
    "in-repair": repairs.filter(r => r.status === "in-repair").length,
    "pending-answer": repairs.filter(r => r.status === "pending-answer").length,
    "pending-parts": repairs.filter(r => r.status === "pending-parts").length,
    ready: repairs.filter(r => r.status === "ready").length,
    delivered: repairs.filter(r => r.status === "delivered").length
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </PageWrapper>
    )
  }

  if (!repairs.length) {
    return (
      <PageWrapper>
        <EmptyState
          title={t("noRepairs") || "No repairs yet"}
          description={t("startRepair") || "Start by adding a repair"}
        />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>

      <div className="space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>

          <button
            onClick={()=>router.push("/add-repair")}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700"
          >
            ➕ {t("addNewRepair")}
          </button>
        </div>

        {/* 🔥 ULTRA STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">

          <StatCard title={t("total")} value={stats.total} icon="📦" glow="indigo" />
          <StatCard title={t("today")} value={stats.today} icon="⚡" glow="blue" />
          <StatCard title={t("pending")} value={stats.pending} icon="⏳" glow="yellow" />
          <StatCard title={t("delivered")} value={stats.delivered} icon="✅" glow="green" />

        </div>

        {/* QUICK */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t("addNewRepair"), icon: "➕", path: "/add-repair" },
            { label: t("viewRepairs"), icon: "📋", path: "/repairs" },
            { label: t("repairPipeline"), icon: "📊", path: "/pipeline" },
            { label: t("trackDevice"), icon: "🔍", path: "/track" },
            
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} onClick={()=>router.push(item.path)}>
              <Card>
             <div className="text-xl md:text-2xl">{item.icon}</div>

             <p className="mt-2 text-xs md:text-sm text-slate-400">
             {item.label}
             </p>
             </Card>
            </motion.div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">

         <Card className="p-4 flex flex-col justify-start">
           <div className="h-[250px] md:h-[300px]">
           <RepairChart repairs={repairs} />
           </div>
          </Card>

         <Card className="p-4 flex flex-col justify-start">
            <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <StatusChart data={statusData} />
            </div>
          </Card>

         </div>

          {/* RECENT */}
         <div>
          <h2 className="text-lg font-semibold mb-3 text-slate-300">
          {t("recentRepairs")}
          </h2>

         <div className="space-y-3">
         {repairs.slice(0,5).map(r => (
          <div 
          key={r.id}
          className="bg-slate-900/60 border border-white/10 p-3 md:p-4 rounded-xl flex justify-between items-center"
          >

          {/* LEFT */}
          <div className="min-w-0">
          <p className="font-semibold truncate">{r.customer}</p>
          <p className="text-xs md:text-sm text-slate-400 truncate">
          {r.device}
          </p>
         </div>

         {/* RIGHT */}
         <div className="text-right text-xs md:text-sm text-slate-400">
         {tStatus(r.status)}
         </div>
         </div>
         ))}
        </div>
        </div>

        <div className="overflow-x-auto">
        <div className="w-max">
       <RepairPipeline repairs={repairs} />
       </div>
       </div>

      </div>

      {showPin && (
        <PinModal
          correctPin={shop?.profit_pin}
          onClose={() => setShowPin(false)}
          onSuccess={handleUnlockSuccess}
        />
      )}

    </PageWrapper>
  )
}

/* 🔥 ULTRA CARD */
function StatCard({ title, value, icon, glow }: any) {

  const glowMap:any = {
    indigo: "shadow-[0_0_25px_rgba(99,102,241,0.4)]",
    blue: "shadow-[0_0_25px_rgba(59,130,246,0.4)]",
    yellow: "shadow-[0_0_25px_rgba(234,179,8,0.4)]",
    green: "shadow-[0_0_25px_rgba(34,197,94,0.4)]",
    pink: "shadow-[0_0_25px_rgba(236,72,153,0.4)]",
  }

  return(
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-3 md:p-4 rounded-xl border border-white/10 bg-slate-900 ${glowMap[glow]}`}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>

      <p className="text-2xl font-bold mt-3">{value}</p>
    </motion.div>
  )
}