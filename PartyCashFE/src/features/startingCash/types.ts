export type Location = {
    id: number
    name: string
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
  