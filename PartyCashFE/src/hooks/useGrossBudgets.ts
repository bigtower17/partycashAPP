// File: src/hooks/useGrossBudgets.ts
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Location } from '@/types';

export function useGrossBudgets(locations: Location[]) {
  const [grossBudgets, setGrossBudgets] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (locations.length === 0) return;

    api.get('/operations/with-location')
      .then(res => {
        const operations = res.data;
        const grossMap: Record<number, number> = {};

        operations.forEach((op: any) => {
          const locationId = op.location_id;
          const amount = Number(op.amount);
          const excludedTypes = ['starting_cash_assigned', 'starting_cash_recovered'];

          if (locationId != null && amount > 0 && !excludedTypes.includes(op.type)) {
            grossMap[locationId] = (grossMap[locationId] || 0) + amount;
          }
        });

        setGrossBudgets(grossMap);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching operations:', err);
        setError('Error fetching operations');
      })
      .finally(() => setLoading(false));
  }, [locations]);

  return { grossBudgets, loading, error };
}
