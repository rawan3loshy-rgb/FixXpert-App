"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase} from "@/lib/supabase"
import AuthLayout from "@/components/auth/auth-layout"
import { useToast } from "@/components/ui/toast-provider"

export default function LoginPage() {

  const router = useRouter()
  const { showToast } = useToast()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [showPassword,setShowPassword] = useState(false)
  const [redirectTo, setRedirectTo] = useState("/dashboard")
  const [showReset,setShowReset] = useState(false)

  useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const redirect = params.get("redirect") || "/dashboard"
  setRedirectTo(redirect)
}, [])

  const handleLogin = async (e:any)=>{
    e.preventDefault()
    if(loading) return
    
    setLoading(true)

    // 🔥 تحقق إذا الجهاز trusted لهذا الإيميل
    const isTrusted = localStorage.getItem("trusted_device") === email

    // =========================
    // 🟢 جهاز موثوق → دخول مباشر
    // =========================
    if (isTrusted) {

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if(error){
        showToast("Falsche Email oder Passwort")
        setLoading(false)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
console.log("USER ID AFTER LOGIN:", user?.id)

      // ✅ حفظ وقت الدخول
      localStorage.setItem("login_time", Date.now().toString())

      // ✅ تخطي OTP
      localStorage.setItem("otp_verified", "true")

      router.push(redirectTo)
      return
    }

    // =========================
    // 🔐 جهاز جديد → تحقق بالباسورد ثم OTP
    // =========================
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(loginError){
      showToast("Falsche Email oder Passwort")
      setLoading(false)
      return
    }

    // ❗ logout لنفرض OTP

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
    })

    if(otpError){
      showToast("OTP konnte nicht gesendet werden")
      setLoading(false)
      return
    }

    localStorage.setItem("otp_verified", "false")

    showToast("Bestätigungscode wurde gesendet")

    router.push(`/verify?email=${email}&redirect=${redirectTo}`)
  }
 async function handleReset(){

  if(!email){
    showToast("Enter your email")
    return
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })

  if(error){
    showToast(error.message)
  } else {
    showToast("Check your email 📩")
  }
}
  return(
    <AuthLayout>

      <h2 className="text-2xl font-bold mb-6">
        Anmelden
      </h2>

      <form onSubmit={handleLogin} className="space-y-5">

        {/* EMAIL */}
        <div>
          <input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
            required
            className="
              w-full p-4 rounded-xl
              bg-slate-800 border border-white/10
              focus:border-indigo-500 outline-none
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Passwort"
            required
            className="w-full p-4 rounded-xl bg-slate-800 border border-white/10"
          />

          <button
            type="button"
            onClick={()=>setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-xs text-slate-400"
          >
            {showPassword ? "verstecken" : "zeigen"}
          </button>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full h-12 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            transition font-semibold
          "
        >
          {loading ? "Weiter..." : "Weiter"}
        </button>
        {/* 🔥 FORGOT PASSWORD */}
        <div className="text-right mt-2">
         <button
           type="button"
           onClick={()=>setShowReset(true)}
           className="text-sm text-indigo-400 hover:underline"
           >
           Passwort vergessen?
          </button>
        </div>

      </form>
      {showReset && (
      <div className="mt-6 space-y-3">

         <input
          placeholder="Email Eingeben"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-800 border border-white/10"
         />

           <button
            onClick={handleReset}
            className="w-full h-12 rounded-xl bg-indigo-600"
            >
            Link zum Zurücksetzen senden
           </button>

       </div> 
       )}
    </AuthLayout>
  )
}