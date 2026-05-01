import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { pin, userId } = await req.json()

    const { data: shop } = await supabase
      .from("shops")
      .select("admin_pin_hash")
      .eq("shop_id", userId)
      .single()

    if (!shop) {
      return new Response("Not found", { status: 404 })
    }

    const valid = await bcrypt.compare(pin, shop.admin_pin_hash)

    if (!valid) {
      return new Response("INVALID", { status: 401 })
    }

    return new Response("OK")

  } catch (e) {
    return new Response("ERROR", { status: 500 })
  }
}