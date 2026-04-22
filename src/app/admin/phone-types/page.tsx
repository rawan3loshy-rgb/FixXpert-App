"use client"

import CrudTable from "@/components/admin/CrudTableAdv"

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Phone Types</h1>
      <CrudTable table="phone_types" />
    </div>
  )
}