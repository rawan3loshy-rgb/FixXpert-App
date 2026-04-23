import { supabase } from "@/lib/supabase"
export async function logAction({
  action,
  table,
  recordId,
  user,
  details
}: any) {
  await supabase.from("admin_logs").insert({
    action,
    table_name: table,
    record_id: recordId,
    user_id: user.id,
    user_email: user.email,
    details
  })
}