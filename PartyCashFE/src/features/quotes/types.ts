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
  }
  
  export type User = {
    id: number
    username: string
  }
  