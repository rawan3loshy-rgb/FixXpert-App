"use client"

import { useSearchParams } from "next/navigation"

export default function BlockedPage() {

  const params = useSearchParams()
  const status = params.get("status")

  let title = ""
  let message = ""
  let color = "text-yellow-400"

  if (status === "pending") {
    title = "⏳ Konto wird überprüft"
    message = "Dein Konto ist noch nicht aktiviert. Bitte warte auf Freigabe durch den Administrator."
    color = "text-yellow-400"
  }

  else if (status === "disabled") {
    title = "🚫 Konto deaktiviert"
    message = "Dein Konto wurde deaktiviert. Bitte kontaktiere den Support für weitere Informationen."
    color = "text-red-500"
  }

  else {
    title = "⚠️ Zugriff eingeschränkt"
    message = "Dein Konto ist aktuell nicht aktiv."
    color = "text-gray-400"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">

        <div className="text-5xl">🚀</div>

        <h1 className={`text-2xl font-bold ${color}`}>
          {title}
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed">
          {message}
        </p>
       <button
        onClick={()=>window.location.href="/login"}
        className="mt-4 px-4 py-2 bg-indigo-600 rounded-xl"
        >
         Anmelden
        </button>
        <div className="pt-4 border-t border-white/10 text-xs text-slate-500">
          FixXpert System • Admin Control
        </div>

      </div>
      

    </div>
    
  )
}