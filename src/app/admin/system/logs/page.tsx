"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"

export default function LogsPage() {

  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const [tableFilter, setTableFilter] = useState("")

  // 🔥 LOAD (أول مرة)
  const load = async () => {
    setLoading(true)

    const { data } = await supabase
      .from("admin_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)

    setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()

    // 🚀 REALTIME
    const channel = supabase
      .channel("logs-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_logs",
        },
        (payload) => {
          // ⚡ insert مباشرة بدون reload
          setLogs((prev) => [payload.new, ...prev].slice(0, 100))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // 🔍 FILTER
  const filtered = useMemo(() => {
    return logs.filter((log) => {

      const matchSearch =
        `${log.table_name} ${log.user_email}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchAction =
        actionFilter ? log.action === actionFilter : true

      const matchTable =
        tableFilter
          ? log.table_name.toLowerCase().includes(tableFilter.toLowerCase())
          : true

      return matchSearch && matchAction && matchTable
    })
  }, [logs, search, actionFilter, tableFilter])

  return (
    <div className="space-y-4 md:space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-lg md:text-xl font-semibold">
          System Logs
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Monitor all admin actions in realtime
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-3 md:p-4 space-y-3">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 p-2 rounded outline-none focus:ring-2 ring-indigo-500 text-sm"
          />

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-800 p-2 rounded text-sm"
          >
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>

          <input
            placeholder="Filter by table..."
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            className="bg-slate-800 p-2 rounded text-sm"
          />

        </div>

      </div>

      {/* LIST */}
      <div className="space-y-2 md:space-y-3">

        {loading && (
          <div className="text-center text-slate-400 py-10 animate-pulse">
            Loading logs...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-slate-400 py-10 text-sm">
            No logs found
          </div>
        )}

        {filtered.map((log) => (
          <LogItem key={log.id} log={log} />
        ))}

      </div>

    </div>
  )
}

// ================= ITEM =================

function LogItem({ log }: any) {

  const [open, setOpen] = useState(false)

  const color =
    log.action === "delete"
      ? "border-red-500/40"
      : log.action === "update"
      ? "border-yellow-500/40"
      : "border-green-500/40"

  return (
    <div
      className={`
        bg-slate-900/40
        border ${color}
        rounded-xl
        p-3 md:p-4
        space-y-2
        hover:bg-indigo-500/5
        transition
      `}
    >

      {/* HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs md:text-sm">

        <div className="flex gap-2 items-center flex-wrap">
          <span className="font-semibold capitalize">
            {log.action}
          </span>

          <span className="text-slate-400 break-all">
            {log.table_name}
          </span>
        </div>

        <div className="text-slate-500 text-[10px] md:text-xs">
          {new Date(log.created_at).toLocaleString()}
        </div>

      </div>

      {/* USER */}
      <div className="text-[10px] md:text-xs text-slate-400 break-all">
        {log.user_email}
      </div>

      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="text-indigo-400 text-xs"
      >
        {open ? "Hide details" : "Show details"}
      </button>

      {/* DETAILS */}
      {open && (
        <pre
          className="
            text-[10px] md:text-xs
            bg-slate-800
            p-2
            rounded
            overflow-auto
            max-h-40
            whitespace-pre-wrap
            break-words
          "
        >
          {JSON.stringify(log.details, null, 2)}
        </pre>
      )}

    </div>
  )
}