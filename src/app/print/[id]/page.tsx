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
    const { data } = await supabase
      .from("repairs")
      .select("*")
      .eq("id", id)
      .single()

    setRepair(data)

    setTimeout(() => {
      window.print()
    }, 500)
    
  }
  

  if (!repair) return null

  const qrValue = `${process.env.NEXT_PUBLIC_APP_URL}/track/${repair.order_number}`

  const safe = (val: any) => {
    if (!val) return "Nicht angegeben"
    if (typeof val === "string" && !val.trim()) return "Nicht angegeben"
    return val
  }

  // ✅ الحجم الحقيقي بدل scale
  const getPageSize = () => {
    switch (size) {
      case "a5":
        return { width: "148mm", height: "210mm" }
      case "a6":
        return { width: "105mm", height: "148mm" }
      default:
        return { width: "210mm", height: "297mm" }
    }
  }

  const page = getPageSize()
  const trackUrl = repair
  ? `${process.env.NEXT_PUBLIC_APP_URL}/track/${repair.order_number}`
  : ""

  return (
    <div className={`print-container flex justify-center bg-gray-200 print:bg-white`}>

      {/* ✅ FIX PRINT */}
      <style>
     {`
     @page {
      size: ${size === "a5" ? "A5" : size === "a6" ? "A6" : "A4"};
      margin: 0; /* 🔥 أهم شي */
     }

      @media print {

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: auto !important;
      overflow: hidden !important;
       background: white !important;
     }
 
      /* 🔥 يمنع أي overflow يعمل صفحة ثانية */
      body > * {
      page-break-after: avoid;
      break-after: avoid;
      }
 
      * {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      color: black !important;
      border-color: black !important;
       }
        }
      `}
      </style>

      <div
        style={{
          width: page.width,
          minHeight: page.height, // 🔥 بدل height
          background: "white"
        }}
        className="text-black p-10 print:p-6"
      >

        {/* HEADER */}
        <div className="flex justify-between items-start mb-10 border-b-2 border-black pb-6">

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

          <div className="w-24 h-24 border-2 border-black flex items-center justify-center text-xs">
            LOGO
          </div>

        </div>

        {/* MAIN */}
        <div className="grid grid-cols-2 gap-6">

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">
              {t("customerLabel", "de")}
            </p>

            <p><b>{t("customerLabel", "de")}:</b> {safe(repair.customer)}</p>
            <p><b>{t("phone", "de")}:</b> {safe(repair.phone)}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">
              {t("deviceLabel", "de")}
            </p>

            <p><b>{t("deviceLabel", "de")}:</b> {safe(repair.device)}</p>
            <p><b>{t("imei", "de")}:</b> {safe(repair.imei)}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5 col-span-2">
            <p className="text-xs mb-3 uppercase font-bold">
              {t("problemLabel", "de")}
            </p>

            <p><b>{t("problemLabel", "de")}:</b> {safe(repair.problem)}</p>
            <p><b>{t("description", "de")}:</b> {safe(repair.description)}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">
              {t("priceLabel", "de")}
            </p>

            <p className="text-xl font-bold">
              {repair.price || 0} €
            </p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">
              {t("statusLabel", "de")}
            </p>

            <p>{tStatus(repair.status, "de")}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">
              {t("receiverLabel", "de")}
            </p>

            <p>{safe(repair.received_by)}</p>
          </div>

          <div className="border-2 border-black rounded-xl p-5">
            <p className="text-xs mb-3 uppercase font-bold">
              {t("technicianLabel", "de")}
            </p>

            <p>{safe(repair.technician)}</p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-16 border-t-2 border-black pt-8 flex justify-between items-end">

          <div>
            <p className="text-sm">
              {t("signatureCustomer", "de")}
            </p>
            <div className="w-56 h-12 border-b-2 border-black mt-6"></div>
          </div>

          <div className="text-center">
            <QRCode value={qrValue} size={90} />
            <p className="text-xs mt-2">
              {t("trackRepair", "de")}
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}