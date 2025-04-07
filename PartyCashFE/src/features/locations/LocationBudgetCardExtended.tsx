import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatEuro, formatDate } from '@/utils/format'
import api from '@/lib/api'
import { Location, LocationBudgetData, Operation } from '@/types'
import { operationStyleMap } from '@/utils/operationStyle'

interface LocationBudgetCardProps {
  location: Location
  budgetData: LocationBudgetData
  gross: number
  pendingStartingCashAmount?: number
}

export function LocationBudgetCardExtended({
  location,
  budgetData,
  gross,
  pendingStartingCashAmount = 0,
}: LocationBudgetCardProps) {
  const netBalance = parseFloat(budgetData.current_balance.toString())
  const hasPendingCash = pendingStartingCashAmount > 0

  const [expanded, setExpanded] = useState(false)
  const [operations, setOperations] = useState<Operation[]>([])
  const [opsLoading, setOpsLoading] = useState(false)
  const [opsError, setOpsError] = useState<string | null>(null)

  const fetchOperations = async () => {
    setOpsLoading(true)
    try {
      const res = await api.get('/operations/with-location')
      const opsForLocation = res.data.filter((op: any) => op.location_id === location.id)
      setOperations(opsForLocation)
      setOpsError(null)
    } catch (err) {
      console.error('Error fetching operations for location', location.id, err)
      setOpsError('Errore nel recupero operazioni')
    } finally {
      setOpsLoading(false)
    }
  }

  useEffect(() => {
    if (expanded) fetchOperations()
  }, [expanded, location.id])

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-base font-semibold">{location.name}</CardTitle>
        {hasPendingCash && (
          <Badge variant="outline">
            Fondocassa da recuperare: {formatEuro(pendingStartingCashAmount)}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Lordo</span>
          <span className="text-gray-900 font-medium">{formatEuro(gross)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-black">
          <span>Netto</span>
          <span>{formatEuro(netBalance)}</span>
        </div>
        <div className="text-xs text-gray-400 pt-2 border-t mt-3">
          Ultimo aggiornamento: {formatDate(budgetData.updated_at)}
        </div>

        <Button variant="outline" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Nascondi operazioni' : 'Vedi operazioni'}
        </Button>

        {expanded && (
          <div className="mt-2">
            {opsLoading && <p>Caricamento operazioni...</p>}
            {opsError && <p className="text-red-500">{opsError}</p>}
            {operations.length === 0 && !opsLoading ? (
              <p className="text-gray-500">Nessuna operazione trovata.</p>
            ) : (
              <ul className="space-y-2">
                {operations.map((op: Operation) => {
                  const fallback = {
                    label: op.type,
                    badge: 'bg-gray-100 text-gray-800',
                    text: 'text-gray-700 font-medium',
                    prefix: ''
                  }

                  const style = operationStyleMap[op.type] ?? fallback

                  return (
                    <li key={op.id} className="border-b pb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${style.badge}`}>
                        {style.label}
                      </span>
                      <span className={`${style.text}`}>
                        {style.prefix}
                        {formatEuro(Number(op.amount))}
                      </span>{' '}
                      <span className="text-xs text-gray-500">– {op.description}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
