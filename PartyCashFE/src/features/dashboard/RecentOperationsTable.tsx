import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Operation, User } from '@/types'
import OperationItem from './operationsElements/OperationItem'

type Props = {
  users: User[]
}

export function RecentOperationsTable({ users }: Props) {
  const [operations, setOperations] = useState<Operation[]>([])
  const [loading, setLoading] = useState(true)

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

  // Helper function to retrieve the username from the users array.
  const getUser = (id: number): string => {
    const user = users.find((u) => u.id === id)
    return user ? user.username : `User #${id}`
  }

  if (loading) return <p className="text-gray-500">Loading operations...</p>
  if (!Array.isArray(operations)) return <p>Something went wrong loading operations.</p>

  return (
    <div className="space-y-3">
      {operations.map((op, index) => {
        // If op.id is not available, fall back to using index
        const uniqueKey = op.id 
          ? `${op.id}-${op.created_at || index}` 
          : index.toString();
        return (
          <OperationItem 
            key={uniqueKey} 
            operation={op} 
            getUser={getUser} 
          />
        )
      })}
    </div>
  )
}
