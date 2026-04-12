import Dexie, { Table } from "dexie"

export interface StockItem {
  id?: number
  name: string
  quantity: number
  min: number
  created_at: string
}

class AppDB extends Dexie {
  stock!: Table<StockItem>

  constructor() {
    super("FixXpertDB")

    this.version(1).stores({
      stock: "++id, name, quantity, min, created_at"
    })
  }
}

export const db = new AppDB()