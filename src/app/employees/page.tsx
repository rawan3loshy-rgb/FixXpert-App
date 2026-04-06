"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-provider"

export default function EmployeesPage(){

  const [employees,setEmployees] = useState<any[]>([])
  const [name,setName] = useState("")
  const { showToast } = useToast()

  useEffect(()=>{
    loadEmployees()
  },[])

  // 🔥 LOAD EMPLOYEES
  const loadEmployees = async () => {

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id")
      .eq("owner", user.id)
      .single()

    if (shopError || !shop) {
      showToast("Shop not found", "error")
      return
    }

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("shop_id", shop.id)
      .order("created_at", { ascending: false })

    if (error) {
      showToast(error.message, "error")
      return
    }

    setEmployees(data || [])
  }

  // 🔥 ADD EMPLOYEE
  const addEmployee = async () => {

    if (!name.trim()) {
      showToast("Enter name", "error")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id")
      .eq("owner", user.id)
      .single()

    if (shopError || !shop) {
      showToast("Shop not found", "error")
      return
    }

    const { error } = await supabase
      .from("employees")
      .insert({
        name: name.trim(),
        shop_id: shop.id
      })

    if (error) {
      showToast(error.message, "error")
      return
    }

    setName("")
    showToast("Employee added ✅", "success")

    await loadEmployees()
  }

  // 🔥 DELETE
  const deleteEmployee = async (id: string) => {

    if (!confirm("Delete employee?")) return

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id)

    if (error) {
      showToast(error.message, "error")
      return
    }

    showToast("Deleted", "success")
    loadEmployees()
  }

  return (

    <div className="min-h-screen bg-slate-900 text-white p-6">

      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">
          Mitarbeiter Verwaltung
        </h1>

        {/* ADD */}
        <Card className="p-4 space-y-3">

          <p className="text-sm text-slate-400">
            Neuer Mitarbeiter
          </p>

          <div className="flex gap-2">

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Name"
              className="flex-1 h-12 px-4 rounded-xl bg-slate-800 border border-white/10 text-white"
            />

            <Button onClick={addEmployee}>
              +
            </Button>

          </div>

        </Card>

        {/* LIST */}
        <div className="space-y-3">

          {employees.map(emp => (
            <Card key={emp.id} className="p-4 flex justify-between items-center">

              <p>{emp.name}</p>

              <button
                onClick={()=>deleteEmployee(emp.id)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>

            </Card>
          ))}

          {employees.length === 0 && (
            <p className="text-slate-500 text-center mt-10">
              No employees yet
            </p>
          )}

        </div>

      </div>

    </div>
  )
}