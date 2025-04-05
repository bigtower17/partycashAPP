// File: src/features/dashboard/DashboardPage.tsx
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { SharedBudgetCard } from '@/features/dashboard/SharedBudgetCard'
import { LocationBudgetDashboard } from '@/features/dashboard/LocationBudgetDashboard'
import { QuickActions } from '@/features/dashboard/QuickActions'
import { RecentOperationsTable } from '@/features/dashboard/RecentOperationsTable'
import { User } from '@/types'  // Import the correct User type

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
      {/* Shared budget for the party */}
      <SharedBudgetCard />
      {/* Individual location budgets (Gross and Net) */}
      <LocationBudgetDashboard />
      <QuickActions />
      <RecentOperationsTable users={users} />
    </div>
  )
}
