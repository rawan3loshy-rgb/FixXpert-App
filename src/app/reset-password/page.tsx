"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ResetPassword(){

  const [password,setPassword] = useState("")
  const [confirm,setConfirm] = useState("")
  const [loading,setLoading] = useState(false)
  const [showPassword,setShowPassword] = useState(false)
  const [lang,setLang] = useState<"en" | "de">("en")

  // 🔥 translations
  const t = {
    en: {
      reset: "Reset Password",
      newPass: "New password",
      confirm: "Confirm password",
      update: "Update Password",
      updating: "Updating...",
      show: "Show password",
      hide: "Hide password",
      invalid: "Password not valid",
      success: "Password updated ✅",
      rules: {
        length: "At least 8 characters",
        number: "Contains a number",
        symbol: "Contains a symbol (@$!%...)",
        match: "Passwords match"
      }
    },
    de: {
      reset: "Passwort zurücksetzen",
      newPass: "Neues Passwort",
      confirm: "Passwort bestätigen",
      update: "Passwort aktualisieren",
      updating: "Wird aktualisiert...",
      show: "Passwort anzeigen",
      hide: "Passwort verstecken",
      invalid: "Passwort ist nicht gültig",
      success: "Passwort aktualisiert ✅",
      rules: {
        length: "Mindestens 8 Zeichen",
        number: "Enthält eine Zahl",
        symbol: "Enthält ein Symbol (@$!%...)",
        match: "Passwörter stimmen überein"
      }
    }
  }

  // 🔥 session من الرابط
  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.href)
  }, [])

  // 🔥 validation
  const hasLength = password.length >= 8
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[@$!%*?&]/.test(password)
  const match = password === confirm && password !== ""

  const isValid = hasLength && hasNumber && hasSymbol && match

  async function updatePassword(){

    if(!isValid){
      alert(t[lang].invalid)
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password
    })

    if(error){
      alert(error.message)
      setLoading(false)
      return
    }

    alert(t[lang].success)
    setLoading(false)
  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-slate-950">

      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-6">

        {/* 🔥 language switch */}
        <div className="flex justify-end">
          <button
            onClick={()=>setLang(lang === "en" ? "de" : "en")}
            className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700"
          >
            {lang === "en" ? "DE" : "EN"}
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center">
          {t[lang].reset}
        </h1>

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t[lang].newPass}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-white/10 pr-10"
          />

          <button
            type="button"
            title={showPassword ? t[lang].hide : t[lang].show}
            onClick={()=>setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-400 hover:text-white transition"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 3l18 18M10.584 10.587a2.25 2.25 0 003.182 3.182M9.88 4.24A10.97 10.97 0 0112 4.5c5.25 0 9.27 3.438 10.5 7.5a11.04 11.04 0 01-4.043 5.568M6.61 6.61A11.042 11.042 0 001.5 12c.57 1.95 1.76 3.74 3.39 5.11" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.25 12c1.5-4.5 5.25-7.5 9.75-7.5s8.25 3 9.75 7.5c-1.5 4.5-5.25 7.5-9.75 7.5S3.75 16.5 2.25 12z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* CONFIRM */}
        <input
          type="password"
          placeholder={t[lang].confirm}
          value={confirm}
          onChange={(e)=>setConfirm(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-800 border border-white/10"
        />

        {/* RULES */}
        <div className="text-sm space-y-1">
          <Rule ok={hasLength} text={t[lang].rules.length} />
          <Rule ok={hasNumber} text={t[lang].rules.number} />
          <Rule ok={hasSymbol} text={t[lang].rules.symbol} />
          <Rule ok={match} text={t[lang].rules.match} />
        </div>

        {/* BUTTON */}
        <button
          onClick={updatePassword}
          disabled={!isValid || loading}
          className={`
            w-full py-3 rounded-lg font-semibold transition
            ${isValid ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-700 cursor-not-allowed"}
          `}
        >
          {loading ? t[lang].updating : t[lang].update}
        </button>

      </div>

    </div>
  )
}

/* RULE */
function Rule({ok,text}:any){
  return(
    <div className="flex items-center gap-2">
      <span className={ok ? "text-green-400" : "text-slate-500"}>
        {ok ? "✔" : "•"}
      </span>
      <span className={ok ? "text-green-400" : "text-slate-400"}>
        {text}
      </span>
    </div>
  )
}