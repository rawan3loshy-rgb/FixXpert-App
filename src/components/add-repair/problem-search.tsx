"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { t } from "@/lib/text"

type Props = {
  problem: string
  setProblem: (v: string) => void
}

export default function ProblemSearch({ problem, setProblem }: Props){

  const [problems, setProblems] = useState<any[]>([])

  useEffect(() => {

    const loadProblems = async () => {

      const { data, error } = await supabase
        .from("repair_problems")
        .select("*")

      if (!error) {
        setProblems(data || [])
      }
    }

    loadProblems()

  }, [])

  return (

    <select
      value={problem}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        setProblem(e.target.value)
      }
      className="w-full bg-slate-800 text-white border border-white/10 rounded-xl px-4 py-3 outline-none appearance-none"
    >

      {/* DEFAULT OPTION */}
      <option value="">
        {t("selectProblem") || "Select problem"}
      </option>

      {/* DATA */}
      {problems.map((p) => (
        <option key={p.id} value={p.problem}>
          {p.problem}
        </option>
      ))}

    </select>

  )
}