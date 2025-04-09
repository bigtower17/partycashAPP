import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Location, LocationBudgetData } from '@/types';
import { formatEuro, formatDate } from '@/utils/format';
import { Badge } from '@/components/ui/badge';

interface LocationBudgetCardProps {
  location: Location;
  budgetData: LocationBudgetData;
  gross: number;
  pendingStartingCashAmount?: number;
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
    <Card className="w-full rounded-2xl shadow-sm hover:shadow-md transition h-full min-h-[300px] flex flex-col">
      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-base font-semibold">{location.name}</CardTitle>
        
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground flex-grow">
        <div className="flex justify-between">
          <span>Totale Incasso sviluppato</span>
          <span className="text-gray-900 font-medium">{formatEuro(gross)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-black">
          <span>Incasso trasferito a Cassa Centrale</span>
          <span>{formatEuro(netBalance)}</span>
        </div>
        <div className="text-xs text-gray-400 pt-2 border-t mt-3">
          Ultimo aggiornamento: {formatDate(budgetData.updated_at)}
        </div>
        <div className='flex justify-center tm-2'>
        {hasPendingCash && (
          <Badge className="bg-yellow-300" variant="outline">
            Fondocassa da recuperare: {formatEuro(pendingStartingCashAmount)}
          </Badge>
        )}

        </div>
        
      </CardContent>
    </Card>
  );
}
