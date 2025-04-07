import { Quote } from '@/types'
import { formatDate } from '@/utils/format'
import { MapPin } from 'lucide-react'

export function QuoteMeta({
  quote,
  getUser
}: {
  quote: Quote
  getUser: (id: number) => string
}) {
  const isPaid = quote.status === 'paid'
  const isGeneralCash = !quote.location_name

  return (
    <>
      <p className="text-xs text-gray-500">
        Creato da: <strong>{getUser(quote.user_id)}</strong> il {formatDate(quote.created_at)}
      </p>

      {isPaid && quote.paid_by !== null && (
        <p className="text-xs text-gray-500">
          Pagato da: <strong>{getUser(quote.paid_by)}</strong> il {formatDate(quote.updated_at!)}
        </p>
      )}

      {isPaid && (
        <p className={`text-xs flex items-center gap-1 text-gray-500 ${isGeneralCash ? 'bg-green-50 px-2 py-1 rounded' : ''}`}>
          <MapPin size={14} />
          Postazione:{' '}
          <strong className={isGeneralCash ? 'text-green-700' : 'text-gray-700'}>
            {quote.location_name ?? 'Cassa Generale'}
          </strong>
        </p>
      )}
    </>
  )
}
