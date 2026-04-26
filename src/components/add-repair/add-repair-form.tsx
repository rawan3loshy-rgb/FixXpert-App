"use client"

import { useEffect, useState } from "react"
import { t } from "@/lib/text"
import { supabase } from "@/lib/supabase"

import CustomerSection from "./customer-section"
import RepairSection from "./repair-section"
import DeviceSearch from "./device-search"
import ProblemSearch from "./problem-search"
import Card from "@/components/ui/card"
import { repairSchema } from "@/lib/repairs/repair.schema"
import { createRepair } from "@/lib/repairs/create.repair"
import Button from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-provider"



export default function AddRepairForm(){

  const [customer,setCustomer] = useState("")
  const [phone,setPhone] = useState("")
  const [device,setDevice] = useState("")
  const [imei,setImei] = useState("")
  const [problem,setProblem] = useState("")
  const [status,setStatus] = useState("received")
  const [technician,setTechnician] = useState("")
  const [returned,setReturned] = useState(false)
  const [pickupDate, setPickupDate] = useState(
  new Date().toISOString().split("T")[0])
  const [pickupTime, setPickupTime] = useState(
  new Date().toTimeString().slice(0,5))
  const [baseDateTime, setBaseDateTime] = useState<Date | null>(null)
  const [saving,setSaving] = useState(false)
  const [description,setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [employees,setEmployees] = useState<any[]>([])
  const [technicians,setTechnicians] = useState<any[]>([])
  const [activeSuggest, setActiveSuggest] = useState<number | null>(null)

  const [receivedBy,setReceivedBy] = useState("")
  const today = new Date().toLocaleDateString()
  const { showToast } = useToast()
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [shopName, setShopName] = useState<string | null>(null)
  const [shopId,setShopId] = useState<string | null>(null)

  // =========================
  // 🔥 INIT
  // =========================
  useEffect(()=>{
    init()
  },[])

  const init = async () => {

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      window.location.href = "/login"
      return
    }

    const user = session.user

    const { data: shop } = await supabase
      .from("shops")
      .select("id, logo_url, shop_name")
      .eq("shop_id", user.id)
      .single()

    if (!shop) {
      showToast("Shop not found", "error")
      return
    }

    setShopId(shop.id)
    setLogoUrl(shop.logo_url)
    setShopName(shop.shop_name)

    // employees
    const { data: emp } = await supabase
      .from("employees")
      .select("*")
      .eq("shop_id", shop.id)

    setEmployees(emp || [])

    // 🔥 technicians
    const { data: techs } = await supabase
      .from("technicians")
      .select("*")
      .eq("shop_id", shop.id)

    setTechnicians(techs || [])
  }

  // =========================
  // ➕ EMPLOYEE
  // =========================
  const addEmployee = async () => {

    if (!shopId) return

    const name = prompt("Employee name")
    if (!name || !name.trim()) return

    const { error } = await supabase
      .from("employees")
      .insert({
        name: name.trim(),
        shop_id: shopId
      })

    if (error) {
      showToast(error.message, "error")
      return
    }

    showToast("Employee added", "success")

    setEmployees(prev => [...prev, { name }])
    setReceivedBy(name.trim())
  }

  // =========================
  // ➕ TECHNICIAN
  // =========================
  const addTechnician = async () => {

    if (!shopId) return

    const name = prompt("Technician name")
    if (!name || !name.trim()) return

    const { error } = await supabase
      .from("technicians")
      .insert({
        name: name.trim(),
        shop_id: shopId
      })

    if (error) {
      showToast(error.message, "error")
      return
    }

    showToast("Technician added", "success")

    setTechnicians(prev => [...prev, { name }])
    setTechnician(name.trim())
  }

  // =========================
  // 💾 SUBMIT
  // =========================
  const submit = async(e:React.FormEvent)=>{
    e.preventDefault()

    if(saving || !shopId) return
    setSaving(true)

    try {

      const result = repairSchema.safeParse({
        customer,
        phone,
        device,
        imei,
        problem,
        status,
        technician,
        returned,
        pickup_at: `${pickupDate} ${pickupTime}`,
        description,
        price: Number(price || 0),
        received_by: receivedBy,
        shop_id: shopId,
        shop_name: shopName,
        logo_url: logoUrl
      })

      if (!result.success) {
        showToast(result.error.issues[0]?.message || "Invalid data")
        return
      }
      
      const res = await createRepair(result.data)

      if (!res?.id) {
        throw new Error("Failed to create repair")
      }

      window.open(`/print/${res.id}?size=a4`, "_blank")
      window.open(`/print-label/${res.id}`, "_blank")

      showToast("Repair added ✅", "success")

      // RESET
      setCustomer("")
      setPhone("")
      setDevice("")
      setImei("")
      setProblem("")
      setTechnician("")
      setReturned(false)
      setPickupTime("")
      setDescription("")
      setReceivedBy("")
      setPrice("")
      

    } catch (err: any) {
      console.error(err)
      showToast(err.message || "Error", "error")
    } finally {
      setSaving(false)
    }
  }
const applySuggestion = (hours: number) => {

  setActiveSuggest(hours)

  const base = baseDateTime || new Date()
  const newDate = new Date(base)

  newDate.setHours(base.getHours() + hours)

  const yyyy = newDate.getFullYear()
  const mm = String(newDate.getMonth() + 1).padStart(2, "0")
  const dd = String(newDate.getDate()).padStart(2, "0")

  const hh = String(newDate.getHours()).padStart(2, "0")
  const min = String(newDate.getMinutes()).padStart(2, "0")

  setPickupDate(`${yyyy}-${mm}-${dd}`)
  setPickupTime(`${hh}:${min}`)
}
  return(
      
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          {t("addNewRepair")}
        </h1>
        <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add Repair</h1>
         <span className="text-sm text-slate-400">
         📅 {today}
         </span>
         </div>
        <form onSubmit={submit} className="space-y-6">

          {/* CUSTOMER + DEVICE */}
          <div className="grid md:grid-cols-2 gap-6">

            <Card className="p-5 border border-white/10">
              <CustomerSection
                customer={customer}
                setCustomer={setCustomer}
                phone={phone}
                setPhone={setPhone}
              />
            </Card>

            <Card className="p-5 border border-white/10">
              <DeviceSearch device={device} setDevice={setDevice} />

              <input
                placeholder="IMEI"
                value={imei}
                onChange={(e)=>setImei(e.target.value)}
                className="mt-4 w-full h-12 px-4 rounded-xl bg-slate-800 border border-white/10"
              />
            </Card>

          </div>

          {/* PROBLEM */}
          <Card className="p-5 border border-white/10">
            <ProblemSearch problem={problem} setProblem={setProblem} />
          </Card>

          {/* DETAILS */}
          <Card className="p-5 border border-white/10">
            <RepairSection
              price={price}
              setPrice={setPrice}
              status={status}
              setStatus={setStatus}
              technician={technician}
              setTechnician={setTechnician}
              returned={returned}
              setReturned={setReturned}
              description={description}
              setDescription={setDescription}
            />
          </Card>
        
          {/* 🔥 TECHNICIAN */}
          <Card className="p-5 border border-white/10">

            <div className="flex gap-2">

              <select
                value={technician}
                onChange={(e)=>setTechnician(e.target.value)}
                className="flex-1 h-12 px-4 rounded-xl bg-slate-800 border border-white/10"
              >
                <option value="">
                  {t("selectTechnician") || "Select technician"}
                </option>

                {technicians.map((tch, i) => (
                  <option key={i} value={tch.name}>
                    {tch.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={addTechnician}
                className="px-4 rounded-xl bg-indigo-600"
              >
                +
              </button>

            </div>

          </Card>

          {/* EMPLOYEE */}
          <Card className="p-5 border border-white/10">

            <div className="flex gap-2">

              <select
                value={receivedBy}
                onChange={(e)=>setReceivedBy(e.target.value)}
                className="flex-1 h-12 px-4 rounded-xl bg-slate-800 border border-white/10"
              >
                <option value="">
                  {t("selectEmployee") || "Select employee"}
                </option>

                {Array.isArray(employees) &&
                 employees.map((emp) => (
                 <option key={emp.id} value={emp.name}>
                   {emp.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={addEmployee}
                className="px-4 rounded-xl bg-indigo-600"
              >
                +
              </button>

            </div>

          </Card>

          {/* PICKUP */}
      
          <Card>
           <p className="text-xs text-slate-400 mb-2">{t("pickupTime")}</p>

           {/* DATE + TIME */}
           <div className="grid grid-cols-2 gap-2 mb-2">

             <input
               type="date"
                value={pickupDate}
                onChange={(e)=>setPickupDate(e.target.value)}
                className="h-12 px-3 rounded-xl bg-slate-800 border border-white/10"
              />

              <input
               type="time"
               value={pickupTime}
               onChange={(e)=>setPickupTime(e.target.value)}
               className="h-12 px-3 rounded-xl bg-slate-800 border border-white/10"
              />

            </div>

           {/* 🔥 SUGGEST BUTTONS */}
           <div className="flex gap-3 mt-3">

             {[1,2,3,24].map((h)=>{

             const isActive = activeSuggest === h

              return (
              <button
               key={h}
               type="button"
               onClick={()=>applySuggestion(h)}
               className={`
               flex-1 h-12 rounded-xl font-semibold
               transition-all duration-300

               ${isActive 
               ? "shadow-[0_0_25px_rgba(59,130,246,0.9)] text-white shadow-[0_0_20px_rgba(99,102,241,0.8)] scale-105"
               : "bg-slate-800 text-white/80 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
               }
               `}
               >
               {
                h === 1 ? t("suggest1h") :
                h === 2 ? t("suggest2h") :
                h === 3 ? t("suggest3h") :
                t("suggest1d")
               }
              </button>
             )
              })}

            </div>
           </Card>

          {/* BUTTON */}
          <Button
            type="submit"
            disabled={saving || !shopId}
            className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold"
          >
            {saving ? t("saving") : t("createRepair")}
          </Button>

        </form>
      
      </div>
     
    </div>
  )
}