import { Quote } from './types'
import api from '@/lib/api'

type Props = {
  quote: Quote
  onUpdated: () => void
  getUser: (id: number) => string
}

export default function QuoteItem({ quote, onUpdated, getUser }: Props) {
  const isPaid = quote.status === 'paid'
  const createdAt = new Date(quote.created_at).toLocaleString()
  const paidAt = quote.updated_at ? new Date(quote.updated_at).toLocaleString() : null

  const handleEdit = async () => {
    const newName = prompt('Edit name:', quote.name)
    const newNotes = prompt('Edit notes:', quote.notes)
    const newAmount = prompt('Edit amount:', quote.amount)

    if (newName && newAmount) {
      try {
        await api.put(`/quotes/${quote.id}`, {
          name: newName,
          notes: newNotes ?? '',
          amount: parseFloat(newAmount),
        })
        onUpdated()
      } catch (err) {
        console.error('Error updating quote:', err)
      }
    }
  }

  const handlePay = async () => {
    try {
      await api.post(`/quotes/${quote.id}/pay`)
      onUpdated()
    } catch (err) {
      console.error('Error paying quote:', err)
    }
  }

  const handleDelete = async () => {
    const confirm = window.confirm(`Are you sure you want to delete "${quote.name}"?`)
    if (!confirm) return
    try {
      await api.delete(`/quotes/${quote.id}`)
      onUpdated()
    } catch (err) {
      console.error('Error deleting quote:', err)
    }
  }

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
          <button
            disabled={isPaid}
            onClick={handlePay}
            className={`text-sm px-3 py-1 rounded ${
              isPaid
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {isPaid ? 'Paid' : 'Pay'}
          </button>

          {!isPaid && (
            <>
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
            </>
          )}
        </div>
      </div>
    </li>
  )
}
