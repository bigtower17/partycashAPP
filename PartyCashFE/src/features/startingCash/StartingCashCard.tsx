import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StartingCash, Location } from './types'

type Props = {
  entry: StartingCash
  locations: Location[]
  onReimburse: (id: number) => void
  processing: boolean
}

export default function StartingCashCard({ entry, locations, onReimburse, processing }: Props) {
  const locationName =
    entry.location_name || locations.find(loc => loc.id === entry.location_id)?.name || `Location ${entry.location_id}`

  const parsedAmount = parseFloat(entry.amount)
  const isReimbursed = !!entry.recovered_at

  return (
    <Card className={`p-4 ${isReimbursed ? 'opacity-80' : ''}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {locationName}
          {isReimbursed && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Reimbursed
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">
          Amount: € {isNaN(parsedAmount) ? 'N/A' : parsedAmount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">Assigned by: {entry.assigned_by}</p>
        <p className="text-sm">Date: {new Date(entry.created_at).toLocaleString()}</p>

        {isReimbursed && (
          <>
            <p className="text-sm text-gray-600 mt-1">Recovered by: {entry.recovered_by}</p>
            <p className="text-sm text-gray-500">
              Recovered at: {new Date(entry.recovered_at!).toLocaleString()}
            </p>
          </>
        )}

        {!isReimbursed && (
          <div className="mt-2">
            <Button size="sm" onClick={() => onReimburse(entry.id)} disabled={processing}>
              {processing ? 'Processing...' : 'Reimburse'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
