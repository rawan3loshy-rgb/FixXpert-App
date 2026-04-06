import puppeteer from "puppeteer"

export async function GET(req: Request, { params }: { params: { id: string } }) {

  const { id } = params

  const browser = await puppeteer.launch({
    headless: true, // ✅ FIX
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  })

  const page = await browser.newPage()

  await page.goto(`http://localhost:3000/print/${id}?size=a4`, { // ✅ FIX
    waitUntil: "networkidle0"
  })

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "10mm",
      bottom: "10mm",
      left: "10mm",
      right: "10mm"
    }
  })

  await browser.close()

  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=repair-${id}.pdf`
    }
  })
}