import { Quote } from '@/types'
import { formatEuro } from '@/utils/format'

export function QuoteHeader({ quote }: { quote: Quote }) {
  const isPaid = quote.status === 'paid'
  const amountFormatted = formatEuro(Number(quote.amount))

  return (
    <>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{quote.name}</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {isPaid ? 'Pagato' : 'Da Pagare'}
        </span>
      </div>

      {quote.notes && <p className="text-sm text-gray-600">{quote.notes}</p>}

      <div className={`${isPaid ? 'text-red-600' : 'text-green-700'} font-bold`}>
        {isPaid ? `- ${amountFormatted}` : amountFormatted}
      </div>
    </>
  )
}
