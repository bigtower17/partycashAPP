import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Location, LocationBudgetData } from '@/types'
import { formatEuro, formatDate } from '@/utils/format'
import { Badge } from '@/components/ui/badge'

interface LocationBudgetCardProps {
  location: Location;
  budgetData: LocationBudgetData;
  gross: number;
  pendingStartingCashAmount?: number; // Updated prop name & type
}

export function LocationBudgetCard({
  location,
  budgetData,
  gross,
  pendingStartingCashAmount = 0,
}: LocationBudgetCardProps) {
  const netBalance = parseFloat(budgetData.current_balance.toString());
  const hasPendingCash = pendingStartingCashAmount > 0;

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
      </CardContent>
    </Card>
  )
}
