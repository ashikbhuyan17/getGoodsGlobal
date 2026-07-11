'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import {
  type District,
  type LocationData,
  type Thana,
  getThanaNamesByDistrict,
} from '@/lib/locations';

export type { District, Thana };

type LocationApiResponse<T> = {
  status?: boolean;
  message?: string;
  data?: T[];
};

export function useDistrictThana(
  selectedDistrictName: string,
  initialLocations?: LocationData,
) {
  const prefetched = initialLocations !== undefined;
  const [districts, setDistricts] = useState<District[]>(
    initialLocations?.districts ?? [],
  );
  const [thanas, setThanas] = useState<Thana[]>(initialLocations?.thanas ?? []);
  const [loading, setLoading] = useState(!prefetched);

  useEffect(() => {
    if (prefetched) return;

    let cancelled = false;

    async function loadLocations() {
      try {
        const [districtRes, thanaRes] = await Promise.all([
          fetcher<LocationApiResponse<District>>('/district', {}, 60, false),
          fetcher<LocationApiResponse<Thana>>('/thana', {}, 60, false),
        ]);

        if (cancelled) return;

        setDistricts(
          districtRes?.status && Array.isArray(districtRes.data)
            ? districtRes.data
            : [],
        );
        setThanas(
          thanaRes?.status && Array.isArray(thanaRes.data) ? thanaRes.data : [],
        );
      } catch {
        if (!cancelled) {
          setDistricts([]);
          setThanas([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLocations();

    return () => {
      cancelled = true;
    };
  }, [prefetched]);

  const thanaOptions = useMemo(
    () => getThanaNamesByDistrict(districts, thanas, selectedDistrictName),
    [districts, thanas, selectedDistrictName],
  );

  return {
    districts,
    thanaOptions,
    loading,
  };
}
