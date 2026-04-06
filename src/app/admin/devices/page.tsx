"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface Device {
  id: string
  brand: string
  device_type: string
  model: string
  created_at?: string
}

export default function AdminDevices(){

  const [devices,setDevices] = useState<Device[]>([])
  const [loading,setLoading] = useState(true)

  const [brand,setBrand] = useState("")
  const [deviceType,setDeviceType] = useState("")
  const [model,setModel] = useState("")

  const [editing,setEditing] = useState<Device | null>(null)
  const [search,setSearch] = useState("")

  useEffect(()=>{
    loadDevices()
  },[])

  async function loadDevices(){
    setLoading(true)

    const { data, error } = await supabase
      .from("devices")
      .select("*")

    if(error){
      console.error(error)
      alert(error.message)
      return
    }

    // 🔥 ترتيب حسب brand
    const sorted = (data || []).sort((a,b)=>
      a.brand.localeCompare(b.brand)
    )

    setDevices(sorted)
    setLoading(false)
  }

  // ➕ ADD
  async function addDevice(){

    if(!brand || !model){
      alert("Fill all fields")
      return
    }

    // 🚫 منع التكرار
    const exists = devices.find(d =>
      d.brand === brand &&
      d.model === model
    )

    if(exists){
      alert("Device already exists")
      return
    }

    const { data, error } = await supabase
      .from("devices")
      .insert({
        brand,
        device_type: deviceType || "Other",
        model
      })
      .select()
      .single()

    if(error){
      alert(error.message)
      return
    }

    // 🔥 LOG
    await supabase.from("admin_logs").insert({
      action: "ADD_DEVICE",
      details: `${brand} ${model}`
    })

    setDevices(prev => [data, ...prev])

    setBrand("")
    setDeviceType("")
    setModel("")
  }

  // 🗑 DELETE
  async function deleteDevice(id:string){

    if(!confirm("Delete device?")) return

    const device = devices.find(d=>d.id === id)

    const { error } = await supabase
      .from("devices")
      .delete()
      .eq("id",id)

    if(error){
      alert(error.message)
      return
    }

    await supabase.from("admin_logs").insert({
      action: "DELETE_DEVICE",
      details: `${device?.brand} ${device?.model}`
    })

    setDevices(prev => prev.filter(d=>d.id !== id))
  }

  // ✏️ UPDATE
  async function updateDevice(){

    if(!editing) return

    const { error } = await supabase
      .from("devices")
      .update({
        brand: editing.brand,
        device_type: editing.device_type,
        model: editing.model
      })
      .eq("id",editing.id)

    if(error){
      alert(error.message)
      return
    }

    await supabase.from("admin_logs").insert({
      action: "UPDATE_DEVICE",
      details: `${editing.brand} ${editing.model}`
    })

    setEditing(null)
    loadDevices()
  }

  // 🔍 FILTER
  const filtered = devices.filter(d =>
    `${d.brand} ${d.model} ${d.device_type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return(

    <div className="max-w-6xl mx-auto space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          📱 Devices Control
        </h1>
        <p className="text-gray-400">
          Manage all platform devices (Admin level)
        </p>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search (brand / model / type)..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="w-full bg-black/40 border border-white/10 px-4 py-2 rounded"
      />

      {/* ADD */}
      <div className="bg-[#020617] p-6 rounded-xl border border-white/10">

        <h3 className="font-semibold mb-4">Add Device</h3>

        <div className="grid md:grid-cols-4 gap-4">

          <input
            placeholder="Brand"
            value={brand}
            onChange={(e)=>setBrand(e.target.value)}
            className="bg-black/40 border border-white/10 px-4 py-2 rounded"
          />

          <input
            placeholder="Type"
            value={deviceType}
            onChange={(e)=>setDeviceType(e.target.value)}
            className="bg-black/40 border border-white/10 px-4 py-2 rounded"
          />

          <input
            placeholder="Model"
            value={model}
            onChange={(e)=>setModel(e.target.value)}
            className="bg-black/40 border border-white/10 px-4 py-2 rounded"
          />

          <button
            onClick={addDevice}
            className="bg-indigo-600 rounded font-semibold"
          >
            Add
          </button>

        </div>

      </div>

      {/* LIST */}
      <div className="bg-[#020617] p-6 rounded-xl border border-white/10">

        <h3 className="font-semibold mb-4">
          All Devices ({filtered.length})
        </h3>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No devices</p>
        ) : (

          <div className="grid md:grid-cols-2 gap-4">

            {filtered.map(device=>(
              <div
                key={device.id}
                className="p-4 rounded-lg bg-black/40 hover:bg-black/60 transition"
              >

                {/* INFO */}
                <div className="mb-3">

                  <p className="font-bold text-lg">
                    {device.brand} {device.model}
                  </p>

                  <span className="text-xs bg-indigo-600/20 px-2 py-1 rounded">
                    {device.device_type}
                  </span>

                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 text-sm">

                  <button
                    onClick={()=>setEditing(device)}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>deleteDevice(device.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

        )}

      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-[#020617] p-6 rounded-xl w-[400px] space-y-4">

            <h3 className="font-semibold">Edit Device</h3>

            <input
              value={editing.brand}
              onChange={(e)=>setEditing({...editing,brand:e.target.value})}
              className="w-full bg-black/40 border border-white/10 px-4 py-2 rounded"
            />

            <input
              value={editing.device_type}
              onChange={(e)=>setEditing({...editing,device_type:e.target.value})}
              className="w-full bg-black/40 border border-white/10 px-4 py-2 rounded"
            />

            <input
              value={editing.model}
              onChange={(e)=>setEditing({...editing,model:e.target.value})}
              className="w-full bg-black/40 border border-white/10 px-4 py-2 rounded"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={()=>setEditing(null)}
                className="text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={updateDevice}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}