import bdDistrictsData from '@/lib/constants/bd-districts.json';
import bdPostcodesData from '@/lib/constants/bd-postcodes.json';

type BdDistrict = {
  id: string;
  division_id: string;
  name: string;
};

type BdPostcode = {
  district_id: string;
  upazila: string;
};

const districts = (bdDistrictsData?.districts ?? []) as BdDistrict[];
const postcodes = (bdPostcodesData?.postcodes ?? []) as BdPostcode[];

export const BD_DISTRICT_NAMES = districts
  .map((district) => district.name.trim())
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b, 'en'));

const districtNameToId = new Map(
  districts.map((district) => [district.name.trim().toLowerCase(), district.id]),
);

export function getThanaPsByDistrict(districtName: string): string[] {
  const districtId = districtNameToId.get(districtName.trim().toLowerCase());
  if (!districtId) return [];

  return Array.from(
    new Set(
      postcodes
        .filter((postcode) => postcode.district_id === districtId)
        .map((postcode) => postcode.upazila.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, 'en'));
}
