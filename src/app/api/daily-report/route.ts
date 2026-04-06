import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function GET(){

  const { data: shops } = await supabase.from("shops").select("*")

  for(const shop of shops || []){

    if(!shop.email) continue

    const { data: repairs } = await supabase
      .from("repairs")
      .select("*")
      .eq("shop_id", shop.id)

    if(!repairs || repairs.length === 0) continue

    const allowedStatuses = [
      "in-progress",
      "waiting-parts",
      "pending-answer",
      "received",
      "ready"
    ]

    const cleanRepairs = repairs.filter(r =>
      r.status && allowedStatuses.includes(r.status)
    )

    const statusMap:any = {
      "in-progress": "In Reparatur",
      "waiting-parts": "Warten auf Teile",
      "pending-answer": "Warten auf Antwort",
      "received": "Empfangen",
      "ready": "Bereit"
    }

    // =========================
    // AI
    // =========================
    const stats = {
      waitingParts: cleanRepairs.filter(r => r.status === "waiting-parts").length,
      waitingAnswer: cleanRepairs.filter(r => r.status === "pending-answer").length,
      inProgress: cleanRepairs.filter(r => r.status === "in-progress").length,
      ready: cleanRepairs.filter(r => r.status === "ready").length
    }

    let aiText = ""

    if(stats.waitingParts > 3) aiText += "Viele Geräte warten auf Teile.\n"
    if(stats.waitingAnswer > 3) aiText += "Kunden reagieren nicht.\n"
    if(stats.inProgress > 5) aiText += "Hohe Auslastung.\n"
    if(stats.ready > 3) aiText += "Viele Geräte sind bereit.\n"
    if(!aiText) aiText = "Alles läuft optimal."

    // =========================
    // EMAIL HTML
    // =========================
    const html = `
    <div style="background:#0f172a;padding:30px;font-family:Arial">
      <div style="max-width:600px;margin:auto;background:#020617;border-radius:14px;padding:25px;color:#e2e8f0">
        <h1 style="color:#818cf8">FixXpert Bericht</h1>
        <p style="color:#94a3b8">Dein täglicher Überblick</p>

        <div style="margin-top:20px;padding:15px;border:1px solid #1e293b;border-radius:10px">
          <b>Analyse</b>
          <p style="white-space:pre-line">${aiText}</p>
        </div>

        <table width="100%" style="margin-top:20px;border-collapse:collapse">
          <thead>
            <tr style="background:#1e293b">
              <th>#</th><th>Gerät</th><th>Problem</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${cleanRepairs.map(r => `
              <tr>
                <td>${r.order_number}</td>
                <td>${r.device}</td>
                <td>${r.problem}</td>
                <td>${statusMap[r.status]}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
    `

    // =========================
    // 🔥 PDF SaaS LEVEL
    // =========================
    const pdfDoc = await PDFDocument.create()
    let page = pdfDoc.addPage([600, 800])

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    let y = 760

    const drawHeader = () => {
      page.drawText("FixXpert Bericht", {
        x: 40,
        y,
        size: 20,
        font: bold,
        color: rgb(0.3, 0.3, 0.9)
      })

      y -= 25

      page.drawText("Daily Overview", {
        x: 40,
        y,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5)
      })

      y -= 30
    }

    drawHeader()

    // AI BOX
    page.drawRectangle({
      x: 40,
      y: y - 50,
      width: 520,
      height: 50,
      color: rgb(0.95, 0.97, 1)
    })

    page.drawText("Analyse:", { x: 50, y: y - 20, size: 12, font: bold })

    page.drawText(aiText, {
      x: 50,
      y: y - 35,
      size: 10,
      font,
      lineHeight: 12
    })

    y -= 80

    // HEADER TABLE
    const headers = ["#", "Gerät", "Problem", "Status"]

    headers.forEach((h, i) => {
      page.drawText(h, {
        x: 40 + i * 130,
        y,
        size: 10,
        font: bold
      })
    })

    y -= 15

    page.drawLine({
      start: { x: 40, y },
      end: { x: 560, y },
      thickness: 1
    })

    y -= 10

    // ROWS
    for(const r of cleanRepairs){

      const status = statusMap[r.status] || "-"

      page.drawText(String(r.order_number), { x: 40, y, size: 9, font })
      page.drawText(r.device?.slice(0,18) || "-", { x: 170, y, size: 9, font })
      page.drawText(r.problem?.slice(0,18) || "-", { x: 300, y, size: 9, font })
      page.drawText(status, { x: 430, y, size: 9, font })

      y -= 18

      // new page
      if(y < 50){
        page = pdfDoc.addPage([600, 800])
        y = 760
        drawHeader()
      }
    }

    const pdfBytes = await pdfDoc.save()
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64")

    // =========================
    // SEND EMAIL
    // =========================
    await resend.emails.send({
      from: "FixXpert APP <noreply@fixxpertapp.eu>",
      to: shop.email,
      subject: "📊 Täglicher Bericht",
      html,
      attachments: [
        {
          filename: "report.pdf",
          content: pdfBase64
        }
      ]
    })

    console.log("SENT:", shop.email)
  }

  return NextResponse.json({ success: true })
}