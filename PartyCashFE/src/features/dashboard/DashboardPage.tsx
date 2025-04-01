import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { SharedBudgetCard } from '@/features/dashboard/SharedBudgetCard'
import { RecentOperationsTable } from './RecentOperationsTable'
import { QuickActions } from './QuickActions'
import { LocationsBudgetDashboard } from './LocationBudgetDashboard'

type User = {
  id: number
  username: string
}


export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    api.get('/users')
      .then((res) => {
        setUsers(res.data)
      })
      .catch((err) => {
        console.error('Error fetching users:', err)
      })
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <SharedBudgetCard />
      <LocationsBudgetDashboard />
      <QuickActions />
      <RecentOperationsTable users={users} />
    </div>
  )
}
