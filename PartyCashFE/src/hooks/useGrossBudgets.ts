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
        // Assuming the endpoint returns an array of operations with snake_case field names
        const operations = res.data;
        const grossMap: Record<number, number> = {};

        operations.forEach((op: any) => {
          const locationId = op.location_id; // Use snake_case field
          const amount = Number(op.amount);
          if (locationId != null) {
            if (!grossMap[locationId]) {
              grossMap[locationId] = 0;
            }
            // Only sum positive amounts (incoming deposits)
            if (amount > 0) {
              grossMap[locationId] += amount;
            }
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
