import { Location } from '@/types'
import { Banknote } from 'lucide-react'

type Props = {
  locations: Location[]
  paymentSource: 'shared' | number
  onSourceChange: (val: 'shared' | number) => void
  onPay: () => void
  onEdit: () => void
  onDelete: () => void
}

export function QuoteControls({
  locations,
  paymentSource,
  onSourceChange,
  onPay,
  onEdit,
  onDelete
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <select
        value={paymentSource.toString()}
        onChange={(e) => {
          const val = e.target.value
          onSourceChange(val === 'shared' ? 'shared' : parseInt(val, 10))
        }}
        className="text-sm border rounded px-2 py-1"
      >
        <option value="shared">Cassa Generale</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id.toString()}>
            {loc.name}
          </option>
        ))}
      </select>

      <button
        onClick={onPay}
        className="text-sm px-3 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200"
      >
        <Banknote size={14} className="inline-block mr-1" />
        Paga
      </button>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
        >
          Modifica
        </button>
        <button
          onClick={onDelete}
          className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
        >
          Elimina
        </button>
      </div>
    </div>
  )
}
