"use client"

import CrudTable from "@/components/admin/CrudTableAdv"

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Part Types</h1>
      <CrudTable table="part_types" />
    </div>
  )
}