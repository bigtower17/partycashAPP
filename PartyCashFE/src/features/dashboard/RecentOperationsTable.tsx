import { useEffect, useState } from 'react'
import api from '@/lib/api'

type Operation = {
  description: string
  amount: string
  type: string
  created_at: string
  user_id: number
}

type User = {
  id: number
  username: string
}

type Props = {
  users: User[]
}

export function RecentOperationsTable({ users }: Props) {
  const [operations, setOperations] = useState<Operation[]>([])
  const [loading, setLoading] = useState(true)
  const typeStyles: Record<string, string> = {
    deposit: 'bg-green-100',
    local_withdrawal: 'bg-yellow-100',
    starting_cash_assigned: 'bg-red-100',
    starting_cash_recovered: 'bg-blue-100',
  }
  useEffect(() => {
    api.get('/operations/last-operations')
      .then((res) => {
        const data = res.data
        if (Array.isArray(data.operations)) {
          setOperations(data.operations)
        } else {
          console.error('Unexpected operations format:', data)
          setOperations([])
        }
      })
      .catch((err) => {
        console.error('Error fetching operations:', err)
        setOperations([])
      })
      .finally(() => setLoading(false))
  }, [])

  const userMap = users.reduce<Record<number, string>>((map, user) => {
    map[user.id] = user.username
    return map
  }, {})

  if (loading) return <p>Loading operations...</p>

  if (!Array.isArray(operations)) return <p>Something went wrong loading operations.</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">User</th>
          </tr>
        </thead>
        <tbody>
  {operations.map((op, idx) => {
    const bgClass = typeStyles[op.type] || ''
    const username = userMap[op.user_id] || `User #${op.user_id}`
    return (
      <tr key={idx} className={`border-t ${bgClass}`}>
        <td className="px-4 py-2">{new Date(op.created_at).toLocaleString()}</td>
        <td className="px-4 py-2">{op.description || '-'}</td>
        <td className="px-4 py-2">€ {parseFloat(op.amount).toFixed(2)}</td>
        <td className="px-4 py-2">{op.type}</td>
        <td className="px-4 py-2">{username}</td>
      </tr>
    )
  })}
</tbody>
      </table>
    </div>
  )
}
