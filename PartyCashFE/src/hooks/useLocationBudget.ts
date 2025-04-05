// File: src/hooks/useLocationBudgets.ts
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Location, LocationBudgetData } from '@/types';

export function useLocationBudgets(locations: Location[]) {
  const [budgets, setBudgets] = useState<Record<number, LocationBudgetData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (locations.length === 0) return;
    Promise.all(
      locations.map(loc =>
        api.get(`/location-budget/${loc.id}`)
          .then(res => ({ id: loc.id, data: res.data }))
          .catch(err => {
            if (err.response?.status === 404) {
              console.warn(`No budget found for location ${loc.name} (ID ${loc.id})`);
            } else {
              console.error(`Error fetching budget for location ${loc.name} (ID ${loc.id}):`, err);
            }
            return { id: loc.id, data: null };
          })
      )
    )
    .then(results => {
      const budgetsMap: Record<number, LocationBudgetData> = {};
      results.forEach(({ id, data }) => {
        if (data) {
          budgetsMap[id] = data;
        }
      });
      setBudgets(budgetsMap);
      setError(null);
    })
    .catch(err => {
      console.error('Error fetching location budgets:', err);
      setError('Error fetching location budgets');
    })
    .finally(() => setLoading(false));
  }, [locations]);

  return { budgets, loading, error };
}
