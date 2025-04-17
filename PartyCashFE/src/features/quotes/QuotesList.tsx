import { Quote, Location } from '@/types'
import QuoteItem from './QuoteItem'
import { formatEuro } from '@/utils/format'

type Props = {
  quotes: Quote[]
  loading: boolean
  onUpdated: () => void
  getUser: (id: number) => string
  locations: Location[]
}

export default function QuotesList({ quotes, loading, onUpdated, getUser, locations }: Props) {
  if (loading) {
    return <p className="text-gray-500">Caricamento preventivi...</p>
  }

  if (quotes.length === 0) {
    return <p className="text-gray-500 italic">Nessun preventivo ancora presente. Aggiungine uno!</p>
  }

  const pendingQuotes = quotes.filter((q) => q.status === 'pending')
  const paidQuotes = quotes.filter((q) => q.status === 'paid')

  // Calculate the total amounts
  const pendingTotal = pendingQuotes.reduce((total, quote) => total + Number(quote.amount), 0)
  const paidTotal = paidQuotes.reduce((total, quote) => total + Number(quote.amount), 0)

  return (
    <div className="space-y-6">
      {pendingQuotes.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-2 text-yellow-700">Da Pagare</h3>
          <p className="text-sm text-gray-500">Totale: {formatEuro(pendingTotal)}</p>
          <ul className="space-y-3">
            {pendingQuotes.map((q) => (
              <QuoteItem
                key={q.id}
                quote={q}
                onUpdated={onUpdated}
                getUser={getUser}
                locations={locations}
              />
            ))}
          </ul>
        </section>
      )}

      {paidQuotes.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mt-4 mb-2 text-green-700">Pagate</h3>
          <p className="text-sm text-gray-500">Totale: {formatEuro(paidTotal)}</p>

          <ul className="space-y-3">
            {paidQuotes.map((q) => (
              <QuoteItem
                key={q.id}
                quote={q}
                onUpdated={onUpdated}
                getUser={getUser}
                locations={locations}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
