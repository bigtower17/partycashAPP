import { Quote, Location } from '@/types'
import { useQuoteActions } from '@/hooks/useQuoteActions'
import { formatDate, formatEuro } from '@/utils/format'
import { QuoteHeader } from './QuoteItemHeader'
import { QuoteMeta } from './QuoteItemMeta'
import { QuoteControls } from './QuoteItemControls'

type Props = {
  quote: Quote
  onUpdated: () => void
  getUser: (id: number) => string
  locations?: Location[]
}

export default function QuoteItem({ quote, onUpdated, getUser, locations = [] }: Props) {
  const {
    paymentSource,
    handlePaymentSourceChange,
    handleEdit,
    handlePay,
    handleDelete
  } = useQuoteActions(quote, onUpdated)

  return (
    <li className="p-4 bg-white shadow-sm rounded border-l-4 border-blue-500 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <QuoteHeader quote={quote} />
          <QuoteMeta quote={quote} getUser={getUser} />
        </div>

        <div className="space-x-2 flex-shrink-0">
          {quote.status !== 'paid' && (
            <QuoteControls
            locations={locations}
            paymentSource={paymentSource}
            onPay={handlePay}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSourceChange={(val: "shared" | number) => {
              // Convert number values to string, keep "shared" as is
              handlePaymentSourceChange(val === "shared" ? val : val.toString());
            }}
          />
          )}
        </div>
      </div>
    </li>
  )
}
