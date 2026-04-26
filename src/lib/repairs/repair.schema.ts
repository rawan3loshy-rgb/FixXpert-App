import { z } from "zod"

export const repairSchema = z.object({

  customer: z.string().min(2, "Customer name is too short"),

  phone: z.string().min(6, "Phone number is too short"),

  device: z.string().min(2, "Device is required"),

  imei: z.string().optional(),

  problem: z.string().min(2, "Problem is required"),

  price: z.coerce.number(),

  status: z.string(),

  technician: z.string().optional(),

  description: z.string().optional(),

  received_by: z.string().optional(),
  
  logo_url: z.string().optional(),

  returned: z.boolean(),

  pickup_at: z.string().optional()
})

export type RepairForm = z.infer<typeof repairSchema>