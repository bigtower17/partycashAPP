// src/features/quotes/QuotesList.tsx
import { Quote, Location } from '@/types'
import QuoteItem from './QuoteItem'

type Props = {
  quotes: Quote[]
  loading: boolean
  onUpdated: () => void
  getUser: (id: number) => string
  locations: Location[]
}

export default function QuotesList({ quotes, loading, onUpdated, getUser, locations }: Props) {
  if (loading) {
    return <p className="text-gray-500">Loading quotes...</p>
  }

  if (quotes.length === 0) {
    return <p className="text-gray-500 italic">No quotes yet. Add one above!</p>
  }

  return (
    <ul className="space-y-3">
      {quotes.map((q) => (
        <QuoteItem
          key={q.id}
          quote={q}
          onUpdated={onUpdated}
          getUser={getUser}
          locations={locations}
        />
      ))}
    </ul>
  )
}
