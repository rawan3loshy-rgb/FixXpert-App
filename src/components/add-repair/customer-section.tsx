"use client"

import { supabase } from "@/lib/supabase"
import { useState } from "react"
import Card from "@/components/ui/card"
import Input from "@/components/ui/input"
import { t } from "@/lib/text"

type Props = {
  customer: string
  setCustomer: (v: string) => void
  phone: string
  setPhone: (v: string) => void
}

export default function CustomerSection({
  customer,
  setCustomer,
  phone,
  setPhone
}: Props) {

  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  const checkCustomer = async (value: string) => {

    setPhone(value)

    if (value.length < 5) return

    setLoading(true)

    const { data } = await supabase
      .from("repairs")
      .select("customer,device,problem,created_at")
      .eq("phone", value)
      .order("created_at", { ascending: false })
      .limit(5)

    if (data && data.length > 0) {
      setCustomer(data[0].customer)
      setHistory(data)
    } else {
      setHistory([])
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">

      {/* NAME */}
      <Input
        placeholder={t("customerName") || "Customer name"}
        value={customer}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCustomer(e.target.value)
        }
        className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-white/10 text-white"
      />

      {/* PHONE */}
      <Input
        placeholder={t("phone")}
        value={phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          checkCustomer(e.target.value)
        }
        className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-white/10 text-white"
      />

      {/* LOADING */}
      {loading && (
        <p className="text-xs text-slate-400">
          {t("checking")}
        </p>
      )}

      {/* HISTORY */}
      {history.length > 0 && (
        <Card>

          <p className="text-xs text-slate-400">
            {t("previousRepairs")}
          </p>

          {history.map((item, index) => (
            <div key={index} className="text-sm border-b border-white/5 pb-2">

              <p className="font-medium">{item.device}</p>
              <p className="text-slate-400">{item.problem}</p>
              <p className="text-xs text-slate-500">
                {new Date(item.created_at).toLocaleDateString()}
              </p>

            </div>
          ))}

        </Card>
      )}

    </div>
  )
}