"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function PrintLabel(){

  const { id } = useParams()
  const [repair, setRepair] = useState<any>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase
      .from("repairs")
      .select("*")
      .eq("id", id)
      .single()

    setRepair(data)

    setTimeout(()=>{
      window.print()
    }, 600)
  }

  if(!repair) return null

  return(
    <div className="label">

      {/* HEADER */}
      <div className="header">
        <span className="order">#{repair.order_number}</span>
        <span className="status">{repair.status}</span>
      </div>

      {/* CUSTOMER */}
      <div className="box">
        <div className="title">Customer</div>
        <div className="value">{repair.customer}</div>
        <div className="small">{repair.phone}</div>
      </div>

      {/* DEVICE */}
      <div className="box">
        <div className="title">Device</div>
        <div className="value">{repair.device}</div>
        <div className="small">IMEI: {repair.imei || "-"}</div>
      </div>

      {/* PROBLEM */}
      <div className="box">
        <div className="title">Problem</div>
        <div className="value line-clamp">{repair.problem}</div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div>€ {repair.price}</div>
        <div>{repair.received_by}</div>
      </div>

      {/* STYLE */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
          }

          .label {
            width: 80mm;
            height: 50mm;
            padding: 4mm;
            font-size: 10px;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        .label {
          border: 1px dashed #999;
          background: white;
          color: black;
        }

        .header {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: 11px;
          margin-bottom: 2px;
        }

        .order {
          font-size: 12px;
        }

        .status {
          font-size: 9px;
        }

        .box {
          border: 1px solid #ccc;
          padding: 2px 3px;
          margin-bottom: 2px;
        }

        .title {
          font-size: 8px;
          color: #666;
        }

        .value {
          font-size: 10px;
          font-weight: bold;
        }

        .small {
          font-size: 8px;
          color: #444;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: 10px;
          border-top: 1px solid #ccc;
          padding-top: 2px;
        }

        .line-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

    </div>
  )
}