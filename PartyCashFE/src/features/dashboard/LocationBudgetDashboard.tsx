// File: src/features/dashboard/LocationBudgetDashboard.tsx
import React from 'react';
import { useLocations } from '@/hooks/useLocation';
import { useLocationBudgets } from '@/hooks/useLocationBudget';
import { useGrossBudgets } from '@/hooks/useGrossBudgets';
import { LocationBudgetCard } from './LocationBudgetCard';

export function LocationBudgetDashboard() {
  const { locations, loading: locLoading, error: locError } = useLocations();
  const { budgets, loading: budgetLoading, error: budgetError } = useLocationBudgets(locations);
  const { grossBudgets, loading: grossLoading, error: grossError } = useGrossBudgets(locations);

  const loading = locLoading || budgetLoading || grossLoading;
  const error = locError || budgetError || grossError;

  if (loading) return <p>Loading budgets...</p>;
  if (error) return <p>{error}</p>;

  // Only display locations that have a net budget available
  const locationsWithBudget = locations.filter(loc => budgets[loc.id]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Locations Performance Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {locationsWithBudget.map(loc => {
          const budgetData = budgets[loc.id];
          const netBalance = parseFloat(budgetData.current_balance.toString());
          const gross = grossBudgets[loc.id] || 0;
          return (
            <LocationBudgetCard
              key={loc.id}
              location={loc}
              budgetData={budgetData}
              gross={gross}
            />
          );
        })}
      </div>
    </div>
  );
}
