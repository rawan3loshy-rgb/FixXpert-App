import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"
import puppeteer from "puppeteer"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function GET(){

  const { data: shops } = await supabase
    .from("shops")
    .select("*")

  for(const shop of shops || []){

    if(!shop.email){
      console.log("NO EMAIL FOR SHOP")
      continue
    }

    const { data: repairs } = await supabase
      .from("repairs")
      .select("*")
      .eq("shop_id", shop.id)

    if(!repairs || repairs.length === 0){
      console.log("NO REPAIRS")
      continue
    }

    // =========================
    // ✅ WORKFLOW STATUS ONLY
    // =========================
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

    // =========================
    // STATUS MAP
    // =========================
    const statusMap:any = {
      "in-progress": "🔧 In Reparatur",
      "waiting-parts": "⏳ Warten auf Teile",
      "pending-answer": "📞 Warten auf Antwort",
      "received": "📥 Empfangen",
      "ready": "✅ Bereit"
    }

    // =========================
    // 📊 AI ANALYSIS
    // =========================
    const stats = {
      waitingParts: cleanRepairs.filter(r => r.status === "waiting-parts").length,
      waitingAnswer: cleanRepairs.filter(r => r.status === "pending-answer").length,
      inProgress: cleanRepairs.filter(r => r.status === "in-progress").length,
      ready: cleanRepairs.filter(r => r.status === "ready").length
    }

    let aiText = ""

    if(stats.waitingParts > 3){
      aiText += "⚠️ Viele Geräte warten auf Teile.\n"
    }

    if(stats.waitingAnswer > 3){
      aiText += "📞 Kunden reagieren nicht.\n"
    }

    if(stats.inProgress > 5){
      aiText += "🔧 Hohe Auslastung.\n"
    }

    if(stats.ready > 3){
      aiText += "📦 Geräte bereit zur Abholung.\n"
    }

    if(!aiText){
      aiText = "✅ Alles läuft optimal."
    }

    // =========================
    // TABLE (EMAIL)
    // =========================
    const list = cleanRepairs.map(r => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #1e293b">${r.order_number}</td>
        <td style="border-bottom:1px solid #1e293b">${r.device}</td>
        <td style="border-bottom:1px solid #1e293b">${r.problem}</td>
        <td style="border-bottom:1px solid #1e293b;font-weight:600;color:#818cf8">
          ${statusMap[r.status] || "-"}
        </td>
      </tr>
    `).join("")

    // =========================
    // EMAIL HTML
    // =========================
    const html = `
    <table width="100%" style="background:#0f172a;padding:30px;font-family:Arial">
      <tr>
        <td align="center">

          <table width="600" style="background:#020617;border-radius:14px;padding:25px;color:#e2e8f0">

            <tr>
              <td>
                <h1 style="color:#818cf8;margin:0">FixXpert APP Bericht</h1>
                <p style="color:#94a3b8">Dein täglicher Überblick</p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px">
                <div style="background:#020617;border:1px solid #1e293b;padding:15px;border-radius:10px">
                  <b>Analyse</b>
                  <p style="white-space:pre-line">${aiText}</p>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px">

                <table width="100%" style="border-collapse:collapse;font-size:14px;color:#e2e8f0">

                  <thead>
                    <tr style="background:#1e293b;color:#94a3b8">
                      <th>#</th>
                      <th>Gerät</th>
                      <th>Problem</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${list}
                  </tbody>

                </table>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
    `

    // =========================
    // 🔥 PDF HTML (خاص)
    // =========================
    const pdfHtml = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial;
          background: #0f172a;
          padding: 30px;
          color: #e2e8f0;
        }

        .container {
          max-width: 800px;
          margin: auto;
          background: #020617;
          border-radius: 14px;
          padding: 25px;
        }

        h1 { color: #818cf8; }
        p { color: #94a3b8; }

        .box {
          background: #020617;
          border: 1px solid #1e293b;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          color: #e2e8f0;
        }

        th {
          background: #1e293b;
          padding: 10px;
          color: #cbd5f5;
        }

        td {
          padding: 10px;
          border-bottom: 1px solid #1e293b;
        }

        tr:nth-child(even){
          background:#020617;
        }

      </style>
    </head>

    <body>

      <div class="container">
        <h1>FixXpert APP Bericht</h1>
        <p>Dein täglicher Überblick</p>

        <div class="box">
          <b>Analyse</b>
          <p style="white-space:pre-line">${aiText}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Gerät</th>
              <th>Problem</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            ${cleanRepairs.map(r => `
              <tr>
                <td>${r.order_number}</td>
                <td>${r.device}</td>
                <td>${r.problem}</td>
                <td>${statusMap[r.status] || "-"}</td>
              </tr>
            `).join("")}
          </tbody>

        </table>

      </div>

    </body>
    </html>
    `

    // =========================
    // PDF GENERATE
    // =========================
    //const browser = await puppeteer.launch({
      //headless: true,
     // args: ["--no-sandbox"]
   // })

   // const page = await browser.newPage()

   // await page.setContent(pdfHtml, { waitUntil: "networkidle0" })

    //const pdfBuffer = await page.pdf({
    //  format: "A4",
     // printBackground: true
   // })

    //await browser.close()

    //const pdfBase64 = Buffer.from(pdfBuffer).toString("base64")

    // =========================
    // SEND EMAIL
    // =========================
    try {

      await resend.emails.send({
        from: "FixXpert APP <noreply@fixxpertapp.eu>",
        to: shop.email,
        subject: "📊 Täglicher Bericht",
        html,
        
      })

      console.log("SENT:", shop.email)

    } catch (err) {
      console.error("ERROR:", err)
    }
  }

  return NextResponse.json({ success: true })
}