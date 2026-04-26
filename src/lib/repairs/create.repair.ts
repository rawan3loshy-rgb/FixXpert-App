import { supabase } from "@/lib/supabase"

export const createRepair = async (form: {
  customer: string
  phone: string
  device: string
  imei?: string
  problem: string
  price: number
  status: string
  technician?: string
  returned?: boolean
  pickup_at?: string
  description?: string // 🔥 NEW
  received_by?: string // 🔥 NEW
}) => {

  // 🔹 1. get user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  // 🔹 2. get shop of this user
  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("id")
    .eq("shop_id", user.id)
    .single()

  if (shopError || !shop) {
    throw new Error("Shop not found")
  }

  // 🔹 3. generate order number
  const orderNumber = Math.floor(1000 + Math.random() * 9000)

  // 🔹 4. insert repair
  const { data, error } = await supabase
    .from("repairs")
    .insert([{
      order_number: orderNumber,
      customer: form.customer,
      phone: form.phone,
      device: form.device,
      imei: form.imei || null,
      problem: form.problem,
      price: form.price,
      status: form.status,
      technician: form.technician || null,
      returned: form.returned || false,
      pickup_at: form.pickup_at || null,

      // 🔥 FIX (المهم)
      description: form.description || null,
      received_by: form.received_by || null,

      shop_id: shop.id
    }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}