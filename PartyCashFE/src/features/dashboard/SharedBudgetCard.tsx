import { useEffect, useState } from 'react'
import api from '@/lib/api'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatEuro } from '@/utils/format'

export function SharedBudgetCard() {
  const [budget, setBudget] = useState<number | null>(null)
  const [gross, setGross] = useState<number | null>(null)
  const [hasPendingStartingCash, setHasPendingStartingCash] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch shared budget
        const budgetRes = await api.get('/budget')
        const parsedBudget = parseFloat(budgetRes.data?.current_balance)
        setBudget(isNaN(parsedBudget) ? null : parsedBudget)

        // Fetch gross (excluding certain types)
        const opsRes = await api.get('/operations/with-location')
        const excluded = ['starting_cash_assigned', 'starting_cash_recovered']
        const totalGross = opsRes.data.reduce((sum: number, op: any) => {
          if (Number(op.amount) > 0 && !excluded.includes(op.type)) {
            return sum + Number(op.amount)
          }
          return sum
        }, 0)
        setGross(totalGross)

        // Fetch pending starting cash
        const cashRes = await api.get('/starting-cash/all')
        const hasPending = cashRes.data.some((entry: any) => !entry.recovered_at)
        setHasPendingStartingCash(hasPending)
      } catch (err) {
        console.error('Errore caricamento dati shared budget:', err)
      }
    }

    fetchData()
  }, [])

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Cassa Generale
          </CardTitle>
          {hasPendingStartingCash && (
            <Badge className="bg-yellow-300" variant="outline">Fondocassa da Recuperare</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Disponibile (Netto)</span>
          <span className="text-xl font-bold text-black">
            {budget !== null ? formatEuro(budget) : 'Caricamento...'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Incassato Totale (Lordo)</span>
          <span className="text-sm">{gross !== null ? formatEuro(gross) : '-'}</span>
        </div>
      </CardContent>
    </Card>
  )
}
