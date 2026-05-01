import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔥 مهم
)

export async function POST(req: Request) {
  try {
    const { pin, userId } = await req.json()

    const { data: shop } = await supabase
      .from("shops")
      .select("*")
      .eq("shop_id", userId)
      .single()

    if (!shop) {
      return new Response("Shop not found", { status: 404 });
    }

    // 🔒 check lock
    if (
      shop.admin_locked_until &&
      new Date(shop.admin_locked_until) > new Date()
    ) {
      return new Response("LOCKED", { status: 403 });
    }

    const valid = await bcrypt.compare(pin, shop.admin_pin_hash || "")

    if (!valid) {
      const attempts = (shop.admin_attempts || 0) + 1

      if (attempts >= 3) {
        await supabase
          .from("shops")
          .update({
            admin_attempts: 0,
            admin_locked_until: new Date(Date.now() + 5 * 60 * 1000) // 5 min lock
          })
          .eq("id", shop.id)

        return new Response("LOCKED", { status: 403 });
      }

      await supabase
        .from("shops")
        .update({ admin_attempts: attempts })
        .eq("id", shop.id)

      return new Response("INVALID", { status: 401 });
    }

    // ✅ success
    await supabase
      .from("shops")
      .update({ admin_attempts: 0 })
      .eq("id", shop.id);

    // 🍪 session cookie
    (await cookies()).set("admin_session", "true", {
      httpOnly: true,
      secure: true,
      maxAge: 0, // 10 min
      path: "/"
    })

    return new Response("OK")

  } catch (e) {
    return new Response("ERROR", { status: 500 })
  }
}