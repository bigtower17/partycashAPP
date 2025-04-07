import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { LocationBudgetData } from '@/types';

export function useLocationBudgets(locations: any[]) {
  const [budgets, setBudgets] = useState<Record<number, LocationBudgetData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/location-budget/all');
      const mapping: Record<number, LocationBudgetData> = {};
      res.data.forEach((entry: LocationBudgetData) => {
        mapping[entry.location_id] = entry;
      });
      setBudgets(mapping);
      setError(null);
    } catch (err) {
      console.error("Error fetching location budgets:", err);
      setError("Error fetching location budgets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (locations.length === 0) return;
    fetchBudgets();
  }, [locations, fetchBudgets]);

  return { budgets, loading, error, refetch: fetchBudgets }; // 👈 aggiunto qui!
}
