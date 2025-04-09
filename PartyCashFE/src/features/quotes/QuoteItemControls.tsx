import { Location } from '@/types'
import { Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'  // Assuming this one works
// Temporarily use the native select elements instead of shadcn/ui/select
// import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'

type Props = {
  locations: Location[]
  paymentSource: 'shared' | number
  onSourceChange: (val: 'shared' | number) => void
  onPay: () => void
  onEdit: () => void
  onDelete: () => void
}

export function QuoteControls({ locations, paymentSource, onSourceChange, onPay, onEdit, onDelete }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {/* Native select fallback */}
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

      <Button
        onClick={onPay}
        className="text-sm px-3 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200"
      >
        <Banknote size={14} className="inline-block mr-1" />
        Paga
      </Button>

      <div className="flex gap-2">
        <Button onClick={onEdit} className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200">
          Modifica
        </Button>
        <Button onClick={onDelete} className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200">
          Elimina
        </Button>
      </div>
    </div>
  )
}
