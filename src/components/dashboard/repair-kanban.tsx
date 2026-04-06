"use client"

import { motion } from "framer-motion"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd"

import { t, tStatus } from "@/lib/text"

interface Repair {
  id: string
  customer: string
  device: string
  status: string
}

interface Props {
  repairs: Repair[]
  onStatusChange: (id: string, status: string) => void
}

// 🔥 STATUS COLORS
const STATUS_STYLES: Record<string, string> = {
  received: "border-blue-500/30",
  "in-repair": "border-indigo-500/30",
  "pending-answer": "border-yellow-500/30",
  "pending-parts": "border-orange-500/30",
  ready: "border-green-500/30",
  delivered: "border-gray-500/30",
}

// 🔥 COLUMNS
const columns = [
  { id: "received" },
  { id: "in-repair" },
  { id: "pending-answer" },
  { id: "pending-parts" },
  { id: "ready" },
  { id: "delivered" },
]

export default function RepairKanban({ repairs, onStatusChange }: Props) {

  // =========================
  // 📦 GROUP DATA
  // =========================
  const grouped = columns.reduce((acc, col) => {
    acc[col.id] = repairs.filter((r) => r.status === col.id)
    return acc
  }, {} as Record<string, Repair[]>)

  // =========================
  // 🧲 DRAG END
  // =========================
  const handleDragEnd = (result: DropResult) => {

    if (!result.destination) return

    const repairId = result.draggableId
    const newStatus = result.destination.droppableId
    const oldStatus = result.source.droppableId

    if (newStatus === oldStatus) return

    onStatusChange(repairId, newStatus)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>

      <div className="grid md:grid-cols-6 gap-6 mt-5">

        {columns.map((col) => (

          <Droppable key={col.id} droppableId={col.id}>

            {(provided) => (

              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`
                  bg-slate-900/60 
                  backdrop-blur-xl
                  border border-white/10 
                  rounded-2xl 
                  p-4 
                  min-h-[420px]
                  shadow-lg
                  transition
                `}
              >

                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">

                  <h3 className="text-sm font-semibold text-slate-300">
                    {tStatus(col.id)}
                  </h3>

                  <span className="text-xs bg-slate-800 px-2 py-1 rounded-lg text-slate-300">
                    {grouped[col.id]?.length || 0}
                  </span>

                </div>

                {/* CARDS */}
                <div className="space-y-3">

                  {grouped[col.id]?.map((repair, index) => (

                    <Draggable
                      key={repair.id}
                      draggableId={repair.id}
                      index={index}
                    >

                      {(provided, snapshot) => (

                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >

                          <motion.div
                            layout
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className={`
                              bg-slate-800
                              border ${STATUS_STYLES[col.id] || "border-white/10"}
                              rounded-xl
                              p-4
                              cursor-pointer
                              transition
                              hover:bg-slate-700
                              hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]
                            `}
                          >

                            {/* CUSTOMER */}
                            <p className="text-sm font-semibold text-white">
                              {repair.customer}
                            </p>

                            {/* DEVICE */}
                            <p className="text-xs text-slate-400 mt-1">
                              {repair.device}
                            </p>

                            {/* STATUS BADGE */}
                            <div className="mt-3">
                              <span className="text-[10px] px-2 py-1 rounded-md bg-slate-700 text-slate-300">
                                {tStatus(repair.status)}
                              </span>
                            </div>

                          </motion.div>

                        </div>

                      )}

                    </Draggable>

                  ))}

                </div>

                {provided.placeholder}

              </div>

            )}

          </Droppable>

        ))}

      </div>

    </DragDropContext>
  )
}