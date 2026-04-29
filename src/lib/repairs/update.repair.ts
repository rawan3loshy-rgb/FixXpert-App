console.log("🔥 NEW UPDATE FILE")

import { supabase } from "@/lib/supabase"

export async function updateRepair(id: string, updates: any) {

  // =========================
  // 🔍 GET OLD DATA
  // =========================
  const { data: old, error: fetchError } = await supabase
    .from("repairs")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error("❌ FETCH ERROR:", fetchError)
    throw new Error(fetchError.message)
  }

  console.log("📦 UPDATE DATA:", updates)

  // =========================
  // 🧹 CLEAN DATA (FIXED)
  // =========================
  const cleaned: any = {}

  const allowedFields = [
    "customer",
    "phone",
    "device",
    "imei",
    "problem",
    "price",
    "status",
    "technician",
    "returned",
    "pickup_at",
    "description"
  ]

  for (const key of allowedFields) {

    if (updates[key] === undefined) continue

    let value = updates[key]

    // =========================
    // 🔥 TYPE FIXES
    // =========================

    if (key === "price") {
      value = Number(value)
      if (isNaN(value)) value = 0
    }

    if (key === "returned") {
      value = Boolean(value)
    }

    if (key === "pickup_at") {
      value = value && value !== "" ? value : null
    }

    // =========================
    // 🔥 EMPTY STRING FIX
    // =========================
    if (value === "" && key !== "description") {
      value = null
    }

    cleaned[key] = value
  }

  // 🔥 timestamp
  cleaned.updated_at = new Date().toISOString()

  console.log("🧼 CLEANED DATA:", cleaned)

  // =========================
  // 🔥 UPDATE
  // =========================
  const { data, error } = await supabase
    .from("repairs")
    .update(cleaned)
    .eq("id", id)
    .select()

  if (error) {
    console.error("❌ UPDATE ERROR FULL:", JSON.stringify(error, null, 2))
    throw new Error(error.message || "Update failed")
  }

  console.log("✅ UPDATED:", data)

  // =========================
  // 🧾 LOG CHANGES (SMART)
  // =========================
  for (const key of Object.keys(cleaned)) {

    const oldValue = old?.[key]
    const newValue = cleaned?.[key]

    const oldVal = oldValue ?? ""
    const newVal = newValue ?? ""

    if (String(oldVal) !== String(newVal)) {
      await supabase.from("repair_logs").insert({
        repair_id: id,
        action: key,
        old_value: String(oldVal),
        new_value: String(newVal)
      })
    }
  }

  return true
}