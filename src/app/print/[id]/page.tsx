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

  useEffect(() => {
    if (!id) return
    load()
  }, [id])

  const load = async () => {
    const { data: repairData, error } = await supabase
      .from("repairs")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !repairData) return

    const { data: shop } = await supabase
      .from("shops")
      .select("shop_id, shop_name, address, city, phone")
      .eq("id", repairData.shop_id)
      .single()

    setRepair({
      ...repairData,
      shop
    })

    setTimeout(() => window.print(), 500)
  }

  if (!repair) return null

  const logoUrl = repair.shop?.shop_id
    ? `https://zaydhnrctfmuujruvkzw.supabase.co/storage/v1/object/public/logos/${repair.shop.shop_id}/logo.png`
    : null

  const trackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track/${repair.order_number}`

  const safe = (val: any) => {
    if (!val) return "Nicht angegeben"
    if (typeof val === "string" && !val.trim()) return "Nicht angegeben"
    return val
  }

  const pageWidth = "210mm"

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
            overflow: hidden !important;
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
          width: pageWidth,
          minHeight: "260mm", // 🔥 فراغ تحت
          background: "white"
        }}
        className="text-black p-10 print:p-6"
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
              {new Date().toLocaleString("de-DE")}
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
            <div className="w-20 h-20 flex items-center justify-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  className="max-w-full max-h-full object-contain"
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

          {/* ✅ row 1 */}
          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">
              Angenommen von
            </p>
            <p>{safe(repair.received_by)}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">
              Techniker
            </p>
            <p>{safe(repair.technician)}</p>
          </div>

          {/* ✅ row 2 full width */}
          <div className="border-2 border-black rounded-xl p-5 col-span-2">
            <p className="text-xs mb-3 uppercase font-bold">
              Abholzeit
            </p>

            <div className="border-b-2 border-black h-8 flex items-end">
              {safe(repair.pickup_time)}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-16 border-t-2 border-black pt-8 flex justify-between items-end">

          <div>
            <p className="text-sm">Unterschrift Kunde</p>
            <div className="w-56 h-12 border-b-2 border-black mt-6"></div>
          </div>

          <div className="text-center">
            <QRCode value={trackUrl} size={90} />
            <p className="text-xs mt-2">Reparatur verfolgen</p>
          </div>

        </div>

      </div>
    </div>
  )
}