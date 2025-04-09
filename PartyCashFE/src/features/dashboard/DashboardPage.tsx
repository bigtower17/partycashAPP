import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { SharedBudgetCard } from '@/features/dashboard/SharedBudgetCard'
import { LocationBudgetDashboard } from '@/features/dashboard/LocationBudgetDashboard'
import { QuickActions } from '@/features/dashboard/QuickActions'
import { RecentOperationsTable } from '@/features/dashboard/RecentOperationsTable'
import { User } from '@/types'

const operationLegend = [
  { label: 'Scarico', color: 'bg-green-500' },
  { label: 'Scarico Virtuale', color: 'bg-gray-400' },
  { label: 'Pagamento da cassa generale', color: 'bg-red-500' },
  { label: 'Pagamento da postazione', color: 'bg-orange-500' },
  { label: 'Fondocassa Assegnato', color: 'bg-pink-300' },
  { label: 'Fondocassa Recuperato', color: 'bg-blue-500' },
]

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
      <LocationBudgetDashboard />
      <QuickActions />

      {/* 💡 Color Legend for Operations */}
      <div className="space-x-2 border rounded-2xl px-6 py-2  shadow-sm ">
        <h2 className="text-lg font-semibold mb-2">Legenda Operazioni</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {operationLegend.map(({ label, color }) => (
            <div key={label} className="flex items-center space-x-2 ">
              <span className={`w-4 h-4 rounded-full ${color}`} />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <RecentOperationsTable users={users} />
    </div>
  )
}
