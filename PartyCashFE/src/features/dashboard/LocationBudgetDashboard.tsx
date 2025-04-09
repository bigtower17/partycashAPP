import { useEffect, useState } from 'react';
import { useLocations } from '@/hooks/useLocation';
import { useLocationBudgets } from '@/hooks/useLocationBudget';
import { useGrossBudgets } from '@/hooks/useGrossBudgets';
import { LocationBudgetCard } from './LocationBudgetCard';
import api from '@/lib/api';
import { StartingCash } from '@/types';

export function LocationBudgetDashboard() {
  const { locations, loading: locLoading, error: locError } = useLocations();
  const { budgets, loading: budgetLoading, error: budgetError } = useLocationBudgets(locations);
  const { grossBudgets, loading: grossLoading, error: grossError } = useGrossBudgets(locations);

  const [startingCashEntries, setStartingCashEntries] = useState<StartingCash[]>([]);

  // Se l'array delle locations è vuoto, ignoro il loading degli altri hook
  const loading = locLoading || (locations.length > 0 ? (budgetLoading || grossLoading) : false);
  const error = locError || budgetError || grossError;

  useEffect(() => {
    const fetchStartingCash = async () => {
      try {
        const res = await api.get('/starting-cash/all');
        setStartingCashEntries(res.data);
      } catch (err) {
        console.error('Errore caricamento fondocassa:', err);
      }
    };
    fetchStartingCash();
  }, []);

  // Filter locations to only those with an existing budget row
  const locationsWithBudget = locations.filter((loc) => budgets[loc.id]);

  // Calculate pending starting cash for a location (if needed)
  const getPendingStartingCashAmount = (locationId: number): number => {
    return startingCashEntries
      .filter((entry) => entry.location_id === locationId && !entry.recovered_at)
      .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
  };

  if (loading) return <p>Caricamento incassi...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Performance Postazioni</h1>
      {locationsWithBudget.length === 0 ? (
        <p className="text-gray-500 text-sm mt-4">
          Nessuna postazione con budget trovata.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {locationsWithBudget.map((loc) => {
            const budgetData = budgets[loc.id];
            const gross = grossBudgets[loc.id] || 0;
            return (
              <LocationBudgetCard
                key={loc.id}
                location={loc}
                budgetData={budgetData}
                gross={gross}
                pendingStartingCashAmount={getPendingStartingCashAmount(loc.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
