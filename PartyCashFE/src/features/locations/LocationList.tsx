import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom'
import { Location } from '@/types'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useLocationBudgets } from '@/hooks/useLocationBudget'

export function LocationList() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const navigate = useNavigate()
  const routerLocation = useRouterLocation()

  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  // Recupero le locations
  useEffect(() => {
    if (!user) return // aspetta che l'utente sia pronto
  
    const endpoint = isAdmin ? '/locations/all' : '/locations'
    setLoading(true)
  
    api
      .get(endpoint)
      .then((res) => setLocations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user, isAdmin])

  // Hook per recuperare i budget: restituisce un oggetto in cui la chiave è l'ID della location
  const { budgets, loading: budgetLoading, error: budgetError } = useLocationBudgets(locations)

  // Only consider budgetLoading if there are locations (otherwise treat it as done)
  const budgetsLoading = locations.length > 0 ? budgetLoading : false;

  // Funzione per inizializzare una postazione (crea la linea nella tabella location_budget)
  const handleInitialize = async (id: number) => {
    if (!user?.id) return
    try {
      await api.post(`/location-budget/${id}/update`, {
        locationId: id,
        userId: user.id,
        amount: 0,
        init: true,
      })
      alert('Postazione inizializzata')
    } catch (err) {
      console.error(err)
      alert("Errore nell'inizializzazione della postazione")
    }
  }

  const handleDeactivate = async (id: number) => {
    if (window.confirm('Vuoi disattivare questa postazione?')) {
      try {
        await api.patch(`/locations/${id}/deactivate`)
        setLocations((prev) =>
          prev.map((loc) =>
            loc.id === id ? { ...loc, is_active: false } : loc
          )
        )
      } catch {
        alert('Errore nella disattivazione')
      }
    }
  }

  const handleReactivate = async (id: number) => {
    try {
      await api.patch(`/locations/${id}/reactivate`)
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === id ? { ...loc, is_active: true } : loc
        )
      )
    } catch {
      alert('Errore nella riattivazione')
    }
  }

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        'Sei sicuro di voler eliminare questa postazione?\n⚠️ Può essere eliminata solo se non ha operazioni registrate.'
      )
    ) {
      try {
        await api.delete(`/locations/${id}`)
        setLocations((prev) => prev.filter((loc) => loc.id !== id))
      } catch {
        alert('Errore: probabilmente ci sono operazioni associate.')
      }
    }
  }

  // Gestione del caricamento combinato (locations e budget)
  if (loading || budgetsLoading) return <p>Caricamento postazioni...</p>
  if (budgetError) return <p>Errore: {budgetError}</p>

  const activeLocations = locations.filter((l) => l.is_active)
  const inactiveLocations = locations.filter((l) => !l.is_active)

  return (
    <div className="p-6 space-y-6">
      {/* Header con titolo e pulsante "Aggiungi Postazione" */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Gestione Postazioni</h2>
        <Button
          variant="outline"
          className="bg-green-100"
          onClick={() =>
            navigate('/locations/new', { state: { from: routerLocation.pathname } })
          }
        >
          Aggiungi Postazione
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonna postazioni attive */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Postazioni Attive</h3>
          {activeLocations.map((loc) => (
            <Card key={loc.id}>
              <CardHeader>
                <CardTitle>{loc.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={() => navigate(`/locations/${loc.id}`)}>
                  Rinomina
                </Button>
                {/* Mostra il pulsante "Inizializza" solo se non esiste una linea di budget per la postazione */}
                {!budgets[loc.id] && (
                  <Button
                    variant="outline"
                    onClick={() => handleInitialize(loc.id)}
                  >
                    Inizializza
                  </Button>
                )}
                <Button
                  className="bg-yellow-600 text-white hover:bg-yellow-700"
                  onClick={() => handleDeactivate(loc.id)}
                >
                  Disattiva
                </Button>
                <Button
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleDelete(loc.id)}
                >
                  Elimina
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Colonna postazioni disattivate */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Postazioni Disattivate</h3>
          {inactiveLocations.length === 0 ? (
            <p className="text-sm text-gray-500">Nessuna postazione disattivata</p>
          ) : (
            inactiveLocations.map((loc) => (
              <Card key={loc.id} className="opacity-60">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>{loc.name}</CardTitle>
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    Disattivata
                  </Badge>
                </CardHeader>
                <CardContent className="flex gap-2 flex-wrap">
                  <Button
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() => handleReactivate(loc.id)}
                  >
                    Riattiva
                  </Button>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleDelete(loc.id)}
                  >
                    Elimina
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
