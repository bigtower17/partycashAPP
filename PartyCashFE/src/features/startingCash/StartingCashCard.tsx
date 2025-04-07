import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StartingCash, Location } from '@/types'

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
              Rimborsato
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">
          Importo: € {isNaN(parsedAmount) ? 'N/A' : parsedAmount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600  ">Assegnato da: {entry.assigned_by}</p>
        <p className="text-sm text-gray-600">Data: {new Date(entry.created_at).toLocaleString()}</p>

        {isReimbursed && (
          <>
            <p className="text-sm text-gray-600 mt-1">Recuperato da: {entry.recovered_by}</p>
            <p className="text-sm text-gray-600">
              Data: {new Date(entry.recovered_at!).toLocaleString()}
            </p>
          </>
        )}

        {!isReimbursed && (
          <div className="mt-2">
            <Button className="bg-red-200" variant="outline" size="sm" onClick={() => onReimburse(entry.id)} disabled={processing}>
              {processing ? 'Processing...' : 'Rimborsa'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
