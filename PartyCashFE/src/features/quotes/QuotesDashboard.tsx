// src/features/quotes/QuotesDashboard.tsx
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Quote, User } from '@/types'
import QuoteForm from './QuoteForm'
import QuotesList from './QuotesList'
import { useLocations } from '@/hooks/useLocation'

export default function QuotesDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuotes = () => {
    setLoading(true)
    api.get('/quotes')
      .then((res) => setQuotes(res.data))
      .catch((err) => console.error('Error loading quotes:', err))
      .finally(() => setLoading(false))
  }

  const fetchUsers = () => {
    api.get('/users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error loading users:', err))
  }

  useEffect(() => {
    fetchQuotes()
    fetchUsers()
  }, [])

  // Map user id to username for easy lookup
  const userMap = users.reduce<Record<number, string>>((map, u) => {
    map[u.id] = u.username
    return map
  }, {})

  // Fetch locations using the custom hook
  const { locations, loading: locationsLoading } = useLocations()

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Create New Quote</h2>
        <QuoteForm onQuoteCreated={fetchQuotes} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Quotes</h2>
        <QuotesList
          quotes={quotes}
          loading={loading}
          getUser={(id) => userMap[id] || `User #${id}`}
          onUpdated={fetchQuotes}
          locations={locations}
        />
      </div>
    </div>
  )
}
