export async function safeQuery(query: any) {
  const { data, error } = await query

  if (error) {
    console.error("SUPABASE ERROR:", error)
    throw new Error(error.message || "Database error")
  }

  return data
}