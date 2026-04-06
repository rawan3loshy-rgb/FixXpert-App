"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import AuthLayout from "@/components/auth/auth-layout"
import { useToast } from "@/components/ui/toast-provider"



export default function LoginPage() {

  const router = useRouter()
  const { showToast } = useToast()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [showPassword,setShowPassword] = useState(false)

  const handleLogin = async (e:any)=>{
    e.preventDefault()
    if(loading) return

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(error){
      showToast(error.message)
      setLoading(false)
      return
    }

    router.push("/verify?email="+email)
  }

  return(
    <AuthLayout>

      <h2 className="text-2xl font-bold mb-6">
        Willkommen zurück
      </h2>

      <form onSubmit={handleLogin} className="space-y-5">

        {/* EMAIL */}
        <div className="relative">
          <input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
            className="
              w-full p-4 rounded-xl
              bg-slate-800 border border-white/10
              focus:border-indigo-500 outline-none
              transition
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
          {loading ? "laden..." : "Login"}
        </button>

      </form>

    </AuthLayout>
  )
}