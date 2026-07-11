import { fetcher } from '@/lib/fetcher';

export type District = {
  id: number;
  districtName: string;
};

export type Thana = {
  id: number;
  district_id: string;
  thanaName: string;
};

export type LocationData = {
  districts: District[];
  thanas: Thana[];
};

type LocationApiResponse<T> = {
  status?: boolean;
  message?: string;
  data?: T[];
};

export async function fetchLocations(): Promise<LocationData> {
  try {
    const [districtRes, thanaRes] = await Promise.all([
      fetcher<LocationApiResponse<District>>('/district', {}, 60, false),
      fetcher<LocationApiResponse<Thana>>('/thana', {}, 60, false),
    ]);

    return {
      districts:
        districtRes?.status && Array.isArray(districtRes.data)
          ? districtRes.data
          : [],
      thanas:
        thanaRes?.status && Array.isArray(thanaRes.data) ? thanaRes.data : [],
    };
  } catch {
    return { districts: [], thanas: [] };
  }
}

export function getThanaNamesByDistrict(
  districts: District[],
  thanas: Thana[],
  selectedDistrictName: string,
): string[] {
  const selectedDistrict = districts.find(
    (district) =>
      district.districtName.trim().toLowerCase() ===
      selectedDistrictName.trim().toLowerCase(),
  );
  if (!selectedDistrict) return [];

  return thanas
    .filter(
      (thana) => String(thana.district_id) === String(selectedDistrict.id),
    )
    .map((thana) => thana.thanaName)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'en'));
}
