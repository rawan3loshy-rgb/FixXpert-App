"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/toast-provider"
import AuthLayout from "@/components/auth/auth-layout"
import { motion } from "framer-motion"

export default function Verify(){

  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  const email = searchParams.get("email") || ""

  const [token,setToken] = useState("")
  const [loading,setLoading] = useState(false)
  const [timer,setTimer] = useState(30)
  const [errorAnim,setErrorAnim] = useState(false)
  const [attempts,setAttempts] = useState(0)
  const redirect = searchParams.get("redirect") || "/dashboard"
  // 🔥 NEW
  const [remember,setRemember] = useState(false)

  const sentRef = useRef(false)
  const lockedRef = useRef(false)

  // =========================
  // EMAIL VALIDATION
  // =========================
  useEffect(() => {
    if (!email) {
      showToast("Invalid access")
      router.push("/login")
    }
  }, [])
    useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    console.log("USER AFTER VERIFY:", data.user)
  })
}, [])
  // =========================
  // SEND OTP (مرة واحدة)
  // =========================
  useEffect(() => {

    if (!email) return
    if (sentRef.current) return

    sentRef.current = true

    const sendOtp = async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }
      })

      if (error) showToast(error.message)
      else showToast("Verification code sent 📩")
    }

    sendOtp()

  }, [email])

  // =========================
  // TIMER
  // =========================
  useEffect(()=>{
    if(timer === 0) return

    const interval = setInterval(()=>{
      setTimer(prev => prev - 1)
    },1000)

    return ()=>clearInterval(interval)
  },[timer])

  // =========================
  // VERIFY (🔥 FIXED)
  // =========================
  const verifyCode = async () => {

    if (loading || lockedRef.current) return

    if(!token || token.length < 6){
      showToast("Enter valid code")
      triggerError()
      return
    }

    if (attempts >= 5) {
      showToast("Too many attempts. Please wait ⏳")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email"
    })

    // ❌ إذا خطأ
    if(error){

      setAttempts(prev => prev + 1)
      setLoading(false)
      showToast(error.message)
      triggerError()

      if (attempts + 1 >= 5) {
        lockedRef.current = true
        setTimeout(() => {
          lockedRef.current = false
          setAttempts(0)
        }, 30000)
      }

      return
    }
    

    // ✅ إذا نجاح
   
    // 🔐 OTP verified
    localStorage.setItem("otp_verified", "true")

    // 🧠 Remember device (فقط إذا checked)
    if (remember) {
      localStorage.setItem("trusted_device", email)
    }

    // ⏱️ session start
    localStorage.setItem("login_time", Date.now().toString())

    showToast("Login successful 🚀")

    router.push(redirect)
  }

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verifyCode()
  }

  // =========================
  // ERROR ANIMATION
  // =========================
  const triggerError = () => {
    setErrorAnim(true)
    setTimeout(()=>setErrorAnim(false),400)
  }

  // =========================
  // RESEND
  // =========================
  const resendCode = async () => {

    if(timer > 0 || loading) return

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options:{ shouldCreateUser:false }
    })

    if(error){
      showToast(error.message)
      return
    }

    setTimer(30)
    showToast("New code sent 📩")
  }

  // =========================
  // UI
  // =========================
  return(
    <AuthLayout>

      <motion.form
        onSubmit={handleSubmit}
        animate={errorAnim ? { x: [-10,10,-8,8,0] } : {}}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto"
      >

        <h2 className="text-3xl font-bold mb-3 text-center">
          Bestätigungscode
        </h2>

        <p className="text-sm text-slate-400 mb-8 text-center">
          an Ihre E-Mail-Adresse gesendet <b>{email}</b>
        </p>

        <input
          value={token}
          onChange={(e)=>{
            if (!/^\d*$/.test(e.target.value)) return
            setToken(e.target.value)
          }}
          placeholder="Code eingeben"
          autoFocus
          inputMode="numeric"
          className="
            w-full h-16 text-center text-2xl font-bold tracking-widest
            bg-slate-800 border border-white/10
            rounded-xl outline-none
            focus:border-indigo-500
          "
        />

        {/* 🔥 REMEMBER DEVICE */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e)=>setRemember(e.target.checked)}
          />
          <span className="text-sm text-slate-400">
            Gerät merken
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || lockedRef.current}
          className="
            w-full mt-6 h-14 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            transition font-semibold text-lg
            disabled:opacity-50
          "
        >
          {loading ? "Verifizieren..." : "Verifizieren"}
        </button>

        <div className="text-center mt-5">
          <button
            type="button"
            onClick={resendCode}
            disabled={timer > 0 || loading}
            className="text-sm text-indigo-400"
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          Attempts: {attempts}/5
        </p>

      </motion.form>

    </AuthLayout>
  )
}