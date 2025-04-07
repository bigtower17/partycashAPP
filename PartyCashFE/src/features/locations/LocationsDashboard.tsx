
import { useLocations } from '@/hooks/useLocation'
import { useLocationBudgets } from '@/hooks/useLocationBudget'
import { LocationBudgetCardExtended } from '../locations/LocationBudgetCardExtended'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export function LocationDashboard() {
    const { user } = useAuth(); // ✅ add this line
  
    const { locations, loading: locLoading, error: locError } = useLocations()
    const { budgets, loading: budgetLoading, error: budgetError, refetch } = useLocationBudgets(locations)
    const navigate = useNavigate()

  if (locLoading || budgetLoading) return <p>Caricamento...</p>
  if (locError || budgetError) return <p>Errore: {locError || budgetError}</p>

  const handleInitialize = async (locationId: number, userId: number) => {
    try {
      await api.post(`/location-budget/${locationId}/update`, {
        locationId,
        userId,
        amount: 0,
        init: true
      })
      alert('Postazione inizializzata')
      await refetch?.()
    } catch (err) {
      console.error(err)
      alert('Errore inizializzazione postazione')
    }
  }
  
  

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Postazioni</h1>
        <Button className="bg-green-100" variant={'outline'} onClick={() => navigate('/locations/new')}>Aggiungi Postazione</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {locations.map(loc => {
          const budgetData = budgets[loc.id]
          return (
            <div key={loc.id}>
              {budgetData ? (
                <LocationBudgetCardExtended
                  location={loc}
                  budgetData={budgetData}
                  gross={Number(budgetData.current_balance)} // Adjust if you have separate gross data
                  pendingStartingCashAmount={0} // Pass real amount if available
                />
              ) : (
                <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">{loc.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>Postazione non inizializzata.</p>
                    <Button
  variant="outline"
  onClick={() => {
    if (user?.id) {
      handleInitialize(loc.id, user.id)
    }
  }}
>
  Inizializza Postazione
</Button>




                  </CardContent>
                </Card>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
