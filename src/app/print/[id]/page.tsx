"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import QRCode from "react-qr-code"
import { t, tStatus } from "@/lib/text"

export default function PrintPage() {

  const params = useParams()
  const search = useSearchParams()

  const id = params?.id as string
  const size = search.get("size") || "a4"

  const [repair, setRepair] = useState<any>(null)

  // ✅ طباعة ثابتة (ما تعتمد على اللوجو)
  useEffect(() => {
    if (repair) {
      setTimeout(() => window.print(), 500)
    }
  }, [repair])

  useEffect(() => {
    if (!id) return
    load()
  }, [id])

  const load = async () => {
    const { data: repairData } = await supabase
      .from("repairs")
      .select("*")
      .eq("id", id)
      .single()

    if (!repairData) return

    const { data: shop } = await supabase
      .from("shops")
      .select("id, shop_name, address, city, phone, logo_url")
      .eq("id", repairData.shop_id)
      .single()

    setRepair({
      ...repairData,
      shop
    })
  }

  if (!repair) return null

  const logoUrl = repair.shop?.logo_url || null

  const trackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track/${repair.id}`

  const safe = (val: any) => {
    if (!val) return "Nicht angegeben"
    if (typeof val === "string" && !val.trim()) return "Nicht angegeben"
    return val
  }

  return (
    <div className="flex justify-center bg-gray-200 print:bg-white">

      <style>
        {`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          * {
            color: black !important;
            border-color: black !important;
          }
        }
      `}
      </style>

      <div
        style={{
          width: "210mm",
          minHeight: "245mm",
          background: "white"
        }}
        className="text-black p-8 print:p-4"
      >

        {/* HEADER */}
        <div className="flex justify-between items-start mb-10 border-b-2 border-black pb-6">

          {/* LEFT */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t("repairReceipt", "de")}
            </h1>

            <p className="text-sm">
              {t("orderNumber", "de")}: {repair.order_number}
            </p>

           <p className="text-xs mt-1">
  {repair.created_at &&
    new Date(repair.created_at).toLocaleDateString("de-DE")}{" "}
  {repair.created_at &&
    new Date(repair.created_at).toLocaleTimeString("de-DE")}
</p>
          </div>

          {/* RIGHT */}
          <div className="flex items-start gap-4">

            {/* SHOP INFO */}
            <div className="text-xs text-right leading-5">
              <p className="font-semibold">
                {repair.shop?.shop_name}
              </p>
              <p>{repair.shop?.address}</p>
              <p>{repair.shop?.city}</p>
              <p>{repair.shop?.phone}</p>
            </div>

            {/* LOGO */}
            <div className="flex items-center justify-center h-[80px] w-[140px]">

              {logoUrl ? (
                <img
                  src={logoUrl}
                  onError={(e) => {
                    // 🔥 fallback إذا خربت الصورة
                    e.currentTarget.style.display = "none"
                  }}
                  onLoad={(e) => {
                    const img = e.currentTarget
                    const ratio = img.naturalWidth / img.naturalHeight

                    if (ratio > 2) {
                      img.style.height = "50px"
                    } else {
                      img.style.height = "80px"
                    }

                    img.style.width = "auto"
                  }}
                  className="object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400">No Logo</span>
              )}

            </div>

          </div>

        </div>

        {/* MAIN */}
        <div className="grid grid-cols-2 gap-6">

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">Kunde</p>
            <p><b>Kunde:</b> {safe(repair.customer)}</p>
            <p><b>Telefon:</b> {safe(repair.phone)}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">Gerät</p>
            <p><b>Gerät:</b> {safe(repair.device)}</p>
            <p><b>IMEI:</b> {safe(repair.imei)}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5 col-span-2">
            <p className="text-xs mb-3 uppercase font-bold">Fehler</p>
            <p><b>Fehler:</b> {safe(repair.problem)}</p>
            <p><b>Beschreibung:</b> {safe(repair.description)}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">Preis</p>
            <p className="text-xl font-bold">{repair.price || 0} €</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">Status</p>
            <p>{tStatus(repair.status, "de")}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">Angenommen von</p>
            <p>{safe(repair.received_by)}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">Techniker</p>
            <p>{safe(repair.technician)}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5 col-span-2">
            <p className="text-xs mb-3 uppercase font-bold">Abholzeit</p>

            <div className="border-b-2 border-black h-8 flex items-end">
             {repair.pickup_at
              ? (() => {
              const clean = repair.pickup_at.replace("T", " ").replace("Z", "")
              const [date, time] = clean.split(" ")

              if (!date || !time) return "Nicht angegeben"

              const [y, m, d] = date.split("-")
              const [h, min] = time.split(":")

              return `${d}.${m}.${y}, ${h}:${min}`
              })()
              : "Nicht angegeben"}
            </div>
          </div>

        </div>
        {/* TERMS */}
        <div className="mt-6 text-[10px] leading-4 border-t border-black pt-3">
          <p className="font-semibold mb-1">
            Einverständniserklärung & Garantiebedingungen
          </p>

          <p>
           • Das Gerät muss innerhalb von 2 Monaten nach Fertigstellung abgeholt und bezahlt werden.
           Erfolgt dies nicht, behalten wir uns das Recht vor, das Gerät zu verkaufen,
           um Reparaturkosten und Arbeitsaufwand zu decken.
          </p>

          <p>
           • Für Datenverlust wird keine Haftung übernommen. Der Kunde ist selbst
            verantwortlich für die Sicherung seiner Daten.
         </p>

          <p>
           • Keine Haftung für SIM-Karten, Speicherkarten oder Zubehör, die nicht
            ausdrücklich dokumentiert wurden.
          </p>

          <p>
           • Garantie gilt nur für die durchgeführte Reparatur, nicht für das gesamte Gerät.
          </p>
        </div>

        {/* FOOTER */}
        <div style={{ pageBreakInside: "avoid" }} className="mt-6 border-t border-black pt-6 flex justify-between items-end">

          <div>
            <p className="text-sm">Unterschrift Kunde</p>
            <div className="w-56 h-12 border-b-2 border-black mt-6"></div>
          </div>

          <div className="text-center">
            <QRCode value={trackUrl} size={70} />
            <p className="text-xs mt-2">Reparatur verfolgen</p>
          </div>

        </div>

      </div>
    </div>
  )
}