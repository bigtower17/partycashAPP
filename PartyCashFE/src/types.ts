export type User = {
  id: number
  email: string
  username: string
  role: 'admin' | 'staff' | 'auditor'
}

export type Operation = {
  id: number
  description: string
  amount: string
  type: string
  created_at: string
  user_id: number
  location_id?: number  // optional, returned by with-location endpoint
  location_name?: string
  is_pos: boolean
}


export type Location = {
  id: number
  name: string
  is_active: boolean

}

export type LocationBudgetData = {
  current_balance: string
  location_name: string
  updated_at: string
  last_updated_by: number
  location_id: number
}
export type StartingCash = {
  id: number
  location_id: number
  location?: string
  amount: string
  created_at: string
  assigned_by: string
  recovered_by?: string | null
  recovered_at: string | null
  recovery_notes?: string | null
  location_name?: string
}

export type Quote = {
  id: number
  user_id: number
  name: string
  notes: string
  amount: string
  status: 'pending' | 'paid'
  created_at: string
  updated_at: string
  deleted: boolean
  paid_by: number | null
  location_id: number
  location_name: string
}

export interface CustomJwtPayload {
  id: number
  email: string
  role: 'admin' | 'auditor' | 'user' // personalizza se hai più ruoli
  iat: number
  exp: number
}