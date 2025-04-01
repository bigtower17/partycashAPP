import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function SharedBudgetCard() {
  const [budget, setBudget] = useState<number | null>(null)

  useEffect(() => {
    api.get('/budget')
      .then(res => {
        const data = res.data
        if (data && data.current_balance !== undefined) {
          const parsed = parseFloat(data.current_balance)
          if (!isNaN(parsed)) {
            setBudget(parsed)
          } else {
            setBudget(null)
          }
        }
      })
      .catch(console.error)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Shared Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">
          {typeof budget === 'number'
            ? `€ ${budget.toFixed(2)}`
            : 'Loading...'}
        </p>
      </CardContent>
    </Card>
  )
};

export { SharedBudgetCard }
