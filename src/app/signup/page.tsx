"use client"

import React, { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/toast-provider"
import { motion } from "framer-motion"
import AuthLayout from "@/components/auth/auth-layout"

export default function Signup() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [shopName, setShopName] = useState("")
  const [loading, setLoading] = useState(false)

  const { showToast } = useToast()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (loading) return
    setLoading(true)

    // =========================
    // 🔐 SIGNUP
    // =========================
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      showToast(error.message)
      setLoading(false)
      return
    }

    // ⚠️ FIX مهم (بعض الأحيان data.user تكون null)
    let user = data.user

    if (!user) {
      const { data: userData } = await supabase.auth.getUser()
      user = userData?.user
    }

    if (!user) {
      showToast("User creation failed")
      setLoading(false)
      return
    }

    // =========================
    // 🏪 CREATE SHOP (FIX أساسي)
    // =========================
    const { error: insertError } = await supabase.from("shops").insert([
      {
        owner: user.id,
        email: email,
        shop_name: shopName,
        status: "pending",

        // 🔐 NEW (مهم جداً)
        profit_pin: "123456"
      },
    ])

    if (insertError) {
      showToast(insertError.message)
      setLoading(false)
      return
    }

    // =========================
    // ✅ SUCCESS
    // =========================
    showToast("Account created. Wait for admin approval.")

    // redirect مثل ما هو (ما غيرنا behavior)
    window.location.href = "/login"
  }

  return (
    <AuthLayout>

      <motion.form
        onSubmit={handleSignup}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >

        <h2 className="text-3xl font-bold text-center">
          Konto erstellen
        </h2>

        <input
          placeholder="Geschäftsname"
          value={shopName}
          onChange={(e)=>setShopName(e.target.value)}
          required
          className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
          className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
          className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-xl text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 active:scale-95"
        >
          {loading ? "Creating..." : "Konto erstellen"}
        </button>

        <p className="text-sm text-center text-slate-400">
          Hast du schon ein Konto?{" "}
          <span
            onClick={()=>window.location.href="/login"}
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </motion.form>

    </AuthLayout>
  )
}