"use client"

import { supabase } from "@/lib/supabase"

export default function Billing(){

  const activate = async () => {

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    await supabase
      .from("shops")
      .update({
        subscription_status: "active",
        subscription_expires_at: new Date(Date.now() + 30*24*60*60*1000)
      })
      .eq("shop_id", user.id)

    window.location.href = "/dashboard"
  }

  return(
    <div className="text-center mt-32 text-white">

      <h1 className="text-3xl mb-4">
        Activate your subscription
      </h1>

      <p className="mb-6 text-slate-400">
        You need an active plan to use the system
      </p>

      <button
        onClick={activate}
        className="px-6 py-3 bg-indigo-600 rounded-xl"
      >
        Activate (Test)
      </button>

    </div>
  )
}