"use client"

import { useEffect, useState } from "react"

export default function LanguageSwitcher(){

  const [lang,setLang] = useState<"en" | "de">("en")

  useEffect(()=>{
    const stored = localStorage.getItem("lang") as "en" | "de"
    if (stored) setLang(stored)
  },[])

  const changeLang = (l: "en" | "de") => {
    localStorage.setItem("lang", l)
    setLang(l)

    // 🔥 force refresh UI
    window.location.reload()
  }

  return (
    <div className="flex gap-2">

      <button
        onClick={()=>changeLang("en")}
        className={`px-3 py-1 rounded ${
          lang === "en"
            ? "bg-indigo-600 text-white"
            : "bg-slate-700 text-gray-300"
        }`}
      >
        EN
      </button>

      <button
        onClick={()=>changeLang("de")}
        className={`px-3 py-1 rounded ${
          lang === "de"
            ? "bg-indigo-600 text-white"
            : "bg-slate-700 text-gray-300"
        }`}
      >
        DE
      </button>

    </div>
  )
}