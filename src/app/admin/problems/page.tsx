"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface Problem {
  id: string
  problem: string
  created_at: string
}

export default function Problems(){

  const [problems,setProblems] = useState<Problem[]>([])
  const [loading,setLoading] = useState(true)

  const [newProblem,setNewProblem] = useState("")
  const [editing,setEditing] = useState<Problem | null>(null)

  const [search,setSearch] = useState("")

  useEffect(()=>{
    load()
  },[])

  async function load(){

    setLoading(true)

    const { data, error } = await supabase
      .from("repair_problems")
      .select("*")
      .order("created_at",{ ascending:false })

    if(error){
      console.log(error)
      alert(error.message)
      return
    }

    setProblems(data || [])
    setLoading(false)
  }

  // ➕ ADD
  async function addProblem(){

    if(!newProblem.trim()){
      return alert("Enter problem name")
    }

    const { error } = await supabase
      .from("repair_problems")
      .insert({
        problem:newProblem
      })

    if(error){
      alert(error.message)
      return
    }

    setNewProblem("")
    load()
  }

  // 🗑 DELETE
  async function deleteProblem(id:string){

    if(!confirm("Delete this problem?")) return

    const { error } = await supabase
      .from("repair_problems")
      .delete()
      .eq("id",id)

    if(error){
      alert(error.message)
      return
    }

    load()
  }

  // ✏️ UPDATE
  async function updateProblem(){

    if(!editing) return

    const { error } = await supabase
      .from("repair_problems")
      .update({
        problem: editing.problem
      })
      .eq("id",editing.id)

    if(error){
      alert(error.message)
      return
    }

    setEditing(null)
    load()
  }

  // 🔍 FILTER
  const filtered = problems.filter(p =>
    p.problem.toLowerCase().includes(search.toLowerCase())
  )

  return(

    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          🧠 Repair Problems
        </h1>
        <p className="text-gray-400">
          Manage all repair issues in system
        </p>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search problems..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="w-full bg-black/40 border border-white/10 px-4 py-2 rounded"
      />

      {/* ADD */}
      <div className="bg-[#020617] p-6 rounded-xl border border-white/10 space-y-4">

        <h3 className="font-semibold">Add Problem</h3>

        <div className="flex gap-4">

          <input
            placeholder="Problem name (e.g. Screen broken)"
            value={newProblem}
            onChange={(e)=>setNewProblem(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 px-4 py-2 rounded"
          />

          <button
            onClick={addProblem}
            className="bg-indigo-600 px-4 rounded"
          >
            Add
          </button>

        </div>

      </div>

      {/* LIST */}
      <div className="bg-[#020617] p-6 rounded-xl border border-white/10">

        <h3 className="font-semibold mb-4">
          All Problems
        </h3>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No problems found</p>
        ) : (

          <div className="space-y-3">

            {filtered.map(problem=>(
              <div
                key={problem.id}
                className="flex items-center justify-between bg-black/40 p-4 rounded hover:bg-black/60 transition"
              >

                {/* INFO */}
                <p className="font-medium">
                  {problem.problem}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-3 text-sm">

                  <button
                    onClick={()=>setEditing(problem)}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>deleteProblem(problem.id)}
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

            <h3 className="font-semibold">
              Edit Problem
            </h3>

            <input
              value={editing.problem}
              onChange={(e)=>setEditing({
                ...editing,
                problem:e.target.value
              })}
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
                onClick={updateProblem}
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