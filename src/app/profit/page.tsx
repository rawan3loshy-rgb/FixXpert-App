"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import PageWrapper from "@/components/ui/page-wrapper"
import Card from "@/components/ui/card"
import PinModal from "@/components/ui/pin-modal"
import { motion } from "framer-motion"
import { t, getLang, setLang } from "@/lib/text"
import { useSearchParams } from "next/navigation"

import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

export default function ProfitPage(){

  const router = useRouter()
  const lang = getLang()

  const [repairs,setRepairs] = useState<any[]>([])
  const [filtered,setFiltered] = useState<any[]>([])
  const [loading,setLoading] = useState(true)

  const [shop,setShop] = useState<any>(null)

  const [unlocked,setUnlocked] = useState(false)
  const lockTimer = useRef<any>(null)
  const searchParams = useSearchParams()
  const key = searchParams.get("key")

  const [stats,setStats] = useState({
    fixed:0,
    notFixed:0,
    profit:0,
    warranty:0,
    avg:0,
    successRate:0
  })

  const [range,setRange] = useState("today")
  const [selectedMonth,setSelectedMonth] = useState(new Date().getMonth())
  const [mounted,setMounted] = useState(false)

  // =========================
  // INIT + REALTIME
  // =========================
  useEffect(()=>{

    let channel:any

    const init = async () => {

      setMounted(true)

      await load()

      let shopId = null

      // ✅ إذا في key
      if (key) {
        const { data } = await supabase
          .from("shops")
          .select("id")
          .eq("profit_key", key)
          .maybeSingle()

        shopId = data?.id
      } 
      // ✅ إذا ما في key
      else {
        const { data: { session } } = await supabase.auth.getSession()
        if(!session) return

        const { data } = await supabase
          .from("shops")
          .select("id")
          .eq("shop_id", session.user.id)
          .maybeSingle()

        shopId = data?.id
      }

      if(!shopId) return

      channel = supabase
        .channel("repairs-live")
        .on(
          "postgres_changes",
          { 
            event: "*", 
            schema: "public", 
            table: "repairs",
            filter: `shop_id=eq.${shopId}`
          },
          () => {
            load()
          }
        )
        .subscribe()
    }

    init()

    return () => {
      if(channel){
        supabase.removeChannel(channel)
      }
    }

  },[])

  useEffect(()=>{
    if(mounted){
      applyFilter()
    }
  },[range,repairs,mounted,selectedMonth])

  // =========================
  // LOAD (🔥 المعدل)
  // =========================
  const load = async ()=>{

    const { data: { session } } = await supabase.auth.getSession()

    let shopData = null

    // ✅ إذا في key
    if (key) {
      const { data } = await supabase
        .from("shops")
        .select("*")
        .eq("profit_key", key)
        .maybeSingle()

      shopData = data
    } 
    // ✅ إذا ما في key
    else {
      if(!session){
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("shops")
        .select("*")
        .eq("shop_id", session.user.id)
        .limit(1)
        .maybeSingle()

      shopData = data
    }

    if(!shopData){
      setLoading(false)
      return
    }

    setShop(shopData)

    const { data } = await supabase
      .from("repairs")
      .select("*")
      .eq("shop_id", shopData.id)
      .order("created_at",{ascending:false})

    setRepairs(data || [])
    setLoading(false)
  }

  // =========================
  // FILTER (بدون تغيير)
  // =========================
  const applyFilter = ()=>{

    let result = repairs
    const now = new Date()

    if(range === "today"){
      result = repairs.filter(r =>
        new Date(r.created_at).toDateString() === now.toDateString()
      )
    }

    if(range === "week"){
      const weekAgo = new Date()
      weekAgo.setDate(now.getDate()-7)
      result = repairs.filter(r =>
        new Date(r.created_at) >= weekAgo
      )
    }

    if(range === "month"){
      result = repairs.filter(r =>
        new Date(r.created_at).getMonth() === selectedMonth
      )
    }

    setFiltered(result)

    let fixed = 0
    let notFixed = 0
    let profit = 0
    let warranty = 0

    for(const r of result){
      const p = Number(r.price||0) - Number(r.cost||0)

      if(r.fix_status === "fixed"){
        fixed++
        profit += p
      }

      if(r.fix_status === "not-fixed"){
        notFixed++
      }

      if(r.warranty){
        warranty++
      }
    }

    const avg = result.length ? Math.round(profit / result.length) : 0
    const successRate = result.length ? Math.round((fixed / result.length) * 100) : 0

    setStats({fixed,notFixed,profit,warranty,avg,successRate})
  }
  }

