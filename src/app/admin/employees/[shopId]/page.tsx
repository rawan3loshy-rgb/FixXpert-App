"use client"

import { useParams } from "next/navigation"
import CrudTable from "@/components/admin/CrudTable"

export default function Page() {
  const params = useParams()
  const shopId = params.shopId as string

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Employees</h1>

      <CrudTable table="employees" shopId={shopId} />
    </div>
  )
}