"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { t } from "@/lib/text"

import RepairKanban from "@/components/dashboard/repair-kanban"
import Card from "@/components/ui/card"
import PageWrapper from "@/components/ui/page-wrapper"
import EmptyState from "@/components/ui/empty-state"

interface Repair {
  id: string
  status: string
  customer: string
  device: string
}

export default function Page() {

  const [repairs, setRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)

  // =========================
  // 🔐 LOAD SECURE DATA
  // =========================
  useEffect(() => {
    loadRepairs()
  }, [])

  const loadRepairs = async () => {

    try {
      setLoading(true)

      // ✅ CHECK USER
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = "/login"
        return
      }

      const user = session.user

      // ✅ GET SHOP
      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("shop_id", user.id)
        .single()

      if (!shop) {
        window.location.href = "/login"
        return
      }

      // ✅ SECURE QUERY
      const { data, error } = await supabase
        .from("repairs")
        .select("id,status,customer,device")
        .eq("shop_id", shop.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setRepairs(data || [])

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // 🔄 UPDATE STATUS
  // =========================
  const updateStatus = async (id: string, status: string) => {

    await supabase
      .from("repairs")
      .update({ status })
      .eq("id", id)

    setRepairs(prev =>
      prev.map(r => r.id === id ? { ...r, status } : r)
    )
  }

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {
    return (
      <PageWrapper>
        <div className="text-center text-slate-400 mt-20 animate-pulse">
          {t("loading")}
        </div>
      </PageWrapper>
    )
  }

  // =========================
  // 📭 EMPTY STATE
  // =========================
  if (!repairs.length) {
    return (
      <PageWrapper>
        <EmptyState
          title="No repairs in pipeline"
          description="Start by adding a repair"
        />
      </PageWrapper>
    )
  }

  // =========================
  // UI
  // =========================
  return (
    <PageWrapper>
      <Card>

        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="flex items-center justify-between">

            <h1 className="text-3xl font-bold">
              {t("repairPipeline")}
            </h1>

            <p className="text-sm text-slate-400">
              {repairs.length} {t("totalRepairs")}
            </p>

          </div>

          {/* 🔥 KANBAN */}
          <RepairKanban
            repairs={repairs}
            onStatusChange={updateStatus}
          />

        </div>

      </Card>
    </PageWrapper>
  )
}