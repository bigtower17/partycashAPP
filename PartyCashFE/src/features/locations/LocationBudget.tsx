import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type LocationBudget = {
  current_balance: number
  location_name: string
  updated_at: string
  last_updated_by: number
}

export function LocationBudget({ locationId }: { locationId: number }) {
  const [budgetData, setBudgetData] = useState<LocationBudget | null>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/location-budget/${locationId}`)
      .then(res => setBudgetData(res.data))
      .catch(console.error)
  }, [locationId])

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await api.post(`/location-budget/${locationId}/update`, {
        amount: parseFloat(amount)
      })
      const res = await api.get(`/location-budget/${locationId}`)
      setBudgetData(res.data)
      setAmount('')
      alert('Budget updated')
    } catch (err) {
      alert('Error updating budget')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{budgetData?.location_name || 'Location Budget'}</CardTitle>
      </CardHeader>
      <CardContent>
        {budgetData ? (
          <>
            <p className="text-2xl font-semibold">€ {budgetData.current_balance.toFixed(2)}</p>
            <div className="mt-4 flex gap-2">
              <Input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Update amount"
              />
              <Button onClick={handleUpdate} disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </>
        ) : (
          'Loading...'
        )}
      </CardContent>
    </Card>
  )
}
