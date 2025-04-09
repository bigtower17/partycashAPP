import { useEffect, useState } from 'react'
import { useLocations } from '@/hooks/useLocation'
import { useLocationBudgets } from '@/hooks/useLocationBudget'
import { useGrossBudgets } from '@/hooks/useGrossBudgets'
import { LocationBudgetCardExtended } from '../locations/LocationBudgetCardExtended'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { StartingCash } from '@/types'

export function LocationDashboard() {
  
  const { locations, loading: locLoading, error: locError } = useLocations()
  const [locationsLoaded, setLocationsLoaded] = useState(false)

  // Hook extra triggerato solo quando le locations sono pronte
  const {
    budgets,
    loading: budgetLoading,
    error: budgetError,
  } = useLocationBudgets(locationsLoaded ? locations : [])

  const {
    grossBudgets,
    loading: grossLoading,
    error: grossError,
  } = useGrossBudgets(locationsLoaded ? locations : [])

  const [pendingCashMap, setPendingCashMap] = useState<Record<number, number>>({})
  const [cashLoading, setCashLoading] = useState(true)

  useEffect(() => {
    if (!locLoading) setLocationsLoaded(true)
  }, [locLoading])

  useEffect(() => {
    const fetchPendingCash = async () => {
      try {
        const res = await api.get('/starting-cash/all')
        const startingCash: StartingCash[] = res.data
        const map: Record<number, number> = {}

        startingCash.forEach((entry) => {
          if (entry.recovered_at === null && entry.location_id != null) {
            const amount = parseFloat(entry.amount)
            map[entry.location_id] = (map[entry.location_id] || 0) + amount
          }
        })

        setPendingCashMap(map)
      } catch (err) {
        console.error('Errore nel caricamento fondocassa:', err)
      } finally {
        setCashLoading(false)
      }
    }

    fetchPendingCash()
  }, [])

  // Condizioni di rendering aggiornate
  if (locLoading || (locationsLoaded && locations.length > 0 && (budgetLoading || grossLoading || cashLoading))) {
    return <p>Caricamento...</p>
  }

  if (locError || budgetError || grossError) {
    return <p>Errore: {locError || budgetError || grossError}</p>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header con titolo */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Postazioni</h1>
      </div>

      {locations.length === 0 ? (
        <p className="text-gray-500 text-sm mt-4">
          Nessuna postazione trovata.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {locations.map((loc) => {
            const budgetData = budgets[loc.id]
            const gross = grossBudgets[loc.id] || 0
            const pendingAmount = pendingCashMap[loc.id] || 0

            return (
              
              <div key={loc.id}>
                {budgetData ? (
                  <LocationBudgetCardExtended
                    location={loc}
                    budgetData={budgetData}
                    gross={gross}
                    pendingStartingCashAmount={pendingAmount}
                  />
                ) : (
                  <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">{loc.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                      <p>Postazione non inizializzata.</p>
                      {/* Nessun pulsante per inizializzare */}
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
