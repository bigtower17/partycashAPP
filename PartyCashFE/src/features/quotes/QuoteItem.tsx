// src/features/quotes/QuoteItem.tsx
import { Quote, Location } from '@/types'
import { useQuoteActions } from '@/hooks/useQuoteActions'

type Props = {
  quote: Quote
  onUpdated: () => void
  getUser: (id: number) => string
  locations: Location[]
}

export default function QuoteItem({ quote, onUpdated, getUser, locations }: Props) {
  const isPaid = quote.status === 'paid'
  const createdAt = new Date(quote.created_at).toLocaleString()
  const paidAt = quote.updated_at ? new Date(quote.updated_at).toLocaleString() : null

  // Use the custom hook to get action handlers and state
  const { paymentSource, handlePaymentSourceChange, handleEdit, handlePay, handleDelete } =
    useQuoteActions(quote, onUpdated)

  return (
    <li className="p-4 bg-white shadow-sm rounded border-l-4 border-blue-500 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{quote.name}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isPaid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {quote.status}
            </span>
          </div>
          {quote.notes && <p className="text-sm text-gray-600">{quote.notes}</p>}
          <div className="text-green-700 font-bold">
            € {parseFloat(quote.amount).toFixed(2)}
          </div>
          <p className="text-xs text-gray-500">
            Created by: <strong>{getUser(quote.user_id)}</strong> at {createdAt}
          </p>
          {isPaid && quote.paid_by !== null && (
            <p className="text-xs text-gray-500">
              Paid by: <strong>{getUser(quote.paid_by)}</strong> at {paidAt}
            </p>
          )}
        </div>
        <div className="space-x-2 flex-shrink-0">
          {!isPaid ? (
            <div className="flex flex-col gap-2">
              {/* Payment source selector */}
              <select
                value={paymentSource === 'shared' ? 'shared' : paymentSource}
                onChange={(e) => handlePaymentSourceChange(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="shared">Shared Budget</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handlePay}
                className="text-sm px-3 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200"
              >
                Pay
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <button
              disabled
              className="text-sm px-3 py-1 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              Paid
            </button>
          )}
        </div>
      </div>
    </li>
  )
}
