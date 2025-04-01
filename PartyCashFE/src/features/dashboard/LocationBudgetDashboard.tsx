import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Location = {
  id: number
  name: string
}

type LocationBudgetData = {
  current_balance: string
  location_name: string
  updated_at: string
  last_updated_by: number
}

export function LocationsBudgetDashboard() {
  const [locations, setLocations] = useState<Location[]>([])
  const [budgets, setBudgets] = useState<Record<number, LocationBudgetData>>({})
  const [loading, setLoading] = useState(true)

  // Fetch all locations
  useEffect(() => {
    api.get('/locations')
      .then((res) => {
        setLocations(Array.isArray(res.data) ? res.data : [])
      })
      .catch((err) => {
        console.error('Error fetching locations:', err)
      })
  }, [])

  // For each location, fetch its budget (if it exists)
  useEffect(() => {
    if (locations.length === 0) return

    Promise.all(
      locations.map(loc =>
        api.get(`/location-budget/${loc.id}`)
          .then(res => ({ id: loc.id, data: res.data }))
          .catch(err => {
            if (err.response?.status === 404) {
              console.warn(`No budget found for location ${loc.name} (ID ${loc.id})`)
            } else {
              console.error(`Error fetching budget for location ${loc.name} (ID ${loc.id}):`, err)
            }
            return { id: loc.id, data: null }
          })
      )
    ).then(results => {
      const budgetsMap: Record<number, LocationBudgetData> = {}
      results.forEach(({ id, data }) => {
        if (data) {
          budgetsMap[id] = data
        }
      })
      setBudgets(budgetsMap)
      setLoading(false)
    })
  }, [locations])

  if (loading) return <p>Loading budgets...</p>

  const locationsWithBudget = locations.filter(loc => budgets[loc.id])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Locations Performance Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {locationsWithBudget.map(loc => {
          const budgetData = budgets[loc.id]
          const currentBalance = parseFloat(budgetData.current_balance)
          const profitLabel = currentBalance >= 0 ? 'Money Made' : 'Loss'

          return (
            <Card key={loc.id} className="p-4">
              <CardHeader>
                <CardTitle>{loc.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {profitLabel}: € {currentBalance.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Last Updated: {new Date(budgetData.updated_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
