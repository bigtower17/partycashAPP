// File: src/features/dashboard/LocationBudgetCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Location, LocationBudgetData } from '@/types';

interface LocationBudgetCardProps {
  location: Location;
  budgetData: LocationBudgetData;
  gross: number;
}

export function LocationBudgetCard({ location, budgetData, gross }: LocationBudgetCardProps) {
  const netBalance = parseFloat(budgetData.current_balance.toString());
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>{location.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Gross: € {gross.toFixed(2)}</p>
        <p className="text-lg font-semibold">Net: € {netBalance.toFixed(2)}</p>
        <p className="text-sm text-gray-600">
          Last Updated: {new Date(budgetData.updated_at).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
