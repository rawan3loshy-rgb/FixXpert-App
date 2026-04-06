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
// 🔥 PDF PRODUCTION LEVEL
// =========================
const pdfDoc = await PDFDocument.create()
let page = pdfDoc.addPage([600, 800])

const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

let y = 760

// 🎨 BACKGROUND
const drawBackground = () => {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 600,
    height: 800,
    color: rgb(0.06, 0.09, 0.16)
  })
}

// 🧠 HEADER
const drawHeader = () => {
  page.drawText("FixXpert Bericht", {
    x: 40,
    y,
    size: 20,
    font: bold,
    color: rgb(0.5, 0.6, 1)
  })

  y -= 25

  page.drawText("Daily Overview", {
    x: 40,
    y,
    size: 10,
    font,
    color: rgb(0.6, 0.65, 0.75)
  })

  y -= 30
}

// 📦 AI BOX
const drawAI = () => {
  page.drawRectangle({
    x: 40,
    y: y - 60,
    width: 520,
    height: 60,
    borderWidth: 1,
    borderColor: rgb(0.2, 0.25, 0.35)
  })

  page.drawText("Analyse", {
    x: 50,
    y: y - 20,
    size: 12,
    font: bold,
    color: rgb(1, 1, 1)
  })

  page.drawText(aiText, {
    x: 50,
    y: y - 40,
    size: 10,
    font,
    color: rgb(0.7, 0.75, 0.85),
    maxWidth: 480,
    lineHeight: 12
  })

  y -= 90
}

// 📏 TEXT WRAP (مهم جداً)
const drawMultiline = (text: string, x: number, y: number, maxWidth: number) => {
  const words = text.split(" ")
  let line = ""
  let offsetY = 0

  for (const word of words) {
    const test = line + word + " "
    const width = font.widthOfTextAtSize(test, 9)

    if (width > maxWidth) {
      page.drawText(line, {
        x,
        y: y - offsetY,
        size: 9,
        font,
        color: rgb(0.8, 0.85, 0.9)
      })
      line = word + " "
      offsetY += 12
    } else {
      line = test
    }
  }

  page.drawText(line, {
    x,
    y: y - offsetY,
    size: 9,
    font,
    color: rgb(0.8, 0.85, 0.9)
  })

  return offsetY
}

// 🎨 STATUS COLORS
const getStatusColor = (status: string) => {
  if (status === "ready") return rgb(0.2, 0.8, 0.4)
  if (status === "in-progress") return rgb(0.3, 0.6, 1)
  if (status === "waiting-parts") return rgb(1, 0.7, 0.2)
  if (status === "pending-answer") return rgb(1, 0.5, 0.3)
  return rgb(0.7, 0.7, 0.7)
}

// 🧱 INIT PAGE
drawBackground()
drawHeader()
drawAI()

// TABLE HEADER
const headers = ["#", "Gerät", "Problem", "Status"]

headers.forEach((h, i) => {
  page.drawText(h, {
    x: 40 + i * 130,
    y,
    size: 10,
    font: bold,
    color: rgb(0.6, 0.7, 1)
  })
})

y -= 15

page.drawLine({
  start: { x: 40, y },
  end: { x: 560, y },
  thickness: 1,
  color: rgb(0.2, 0.25, 0.35)
})

y -= 10

// ROWS (احترافي مع wrap + dynamic height)
for (const r of cleanRepairs) {

  const status = statusMap[r.status] || "-"

  const deviceHeight = drawMultiline(
    r.device || "-",
    170,
    y,
    120
  )

  const problemHeight = drawMultiline(
    r.problem || "-",
    300,
    y,
    120
  )

  const rowHeight = Math.max(deviceHeight, problemHeight)

  // order number
  page.drawText(String(r.order_number), {
    x: 40,
    y,
    size: 9,
    font,
    color: rgb(0.8, 0.85, 0.9)
  })

  // status
  page.drawText(status, {
    x: 430,
    y,
    size: 9,
    font,
    color: getStatusColor(r.status)
  })

  y -= (rowHeight + 18)

  // pagination
  if (y < 60) {
    page = pdfDoc.addPage([600, 800])
    y = 760
    drawBackground()
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