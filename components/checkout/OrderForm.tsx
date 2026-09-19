'use client';

import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { FormPicker } from '@/components/ui/form-picker';
import { useDistrictThana } from '@/hooks/useDistrictThana';
import { type LocationData } from '@/lib/locations';

export default function OrderForm({
  formData,
  setFormData,
  locations,
}: {
  formData: {
    name: string;
    phone: string;
    address: string;
    district: string;
    city: string;
    customer_id: number;
    payment_method: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: any;
  locations?: LocationData;
}) {
  const { districts, thanaOptions, loading: locationsLoading } = useDistrictThana(
    formData?.district || '',
    locations,
  );

  const cityOptions = useMemo(() => {
    const city = formData?.city || '';
    if (city && !thanaOptions.includes(city)) {
      return [city, ...thanaOptions];
    }
    return thanaOptions;
  }, [formData?.city, thanaOptions]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData?.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            id="name"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Label htmlFor="phone">
            Phone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            value={formData?.phone}
            placeholder="Enter phone number"
            required
            type="tel"
            pattern="[0-9]{11}"
            maxLength={11}
          />
        </div>

        {/* District */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="district">
            District <span className="text-red-500">*</span>
          </Label>
          <FormPicker
            id="district"
            value={formData?.district || ''}
            onValueChange={(value) => {
              const isSameDistrict = (formData?.district || '') === value;
              setFormData({
                ...formData,
                district: value,
                city: isSameDistrict ? formData?.city || '' : '',
              });
            }}
            options={districts.map((district) => ({
              value: district.districtName,
              label: district.districtName,
            }))}
            placeholder={
              locationsLoading ? 'Loading districts...' : 'Select district'
            }
            searchPlaceholder="Search district..."
            disabled={locationsLoading}
          />
        </div>

        {/* City */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="city">
            Thana/PS <span className="text-red-500">*</span>
          </Label>
          <FormPicker
            id="city"
            value={formData?.city || ''}
            onValueChange={(value) => setFormData({ ...formData, city: value })}
            options={cityOptions.map((thana) => ({
              value: thana,
              label: thana,
            }))}
            placeholder={
              locationsLoading
                ? 'Loading thana...'
                : formData?.district
                  ? 'Select thana/PS'
                  : 'Select district first'
            }
            searchPlaceholder="Search thana..."
            disabled={locationsLoading || !formData?.district}
          />
        </div>

        {/* Address */}
        <div className="flex flex-col col-span-1 md:col-span-2 space-y-1 w-full">
          <Label htmlFor="address">
            Address <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={formData?.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            id="address"
            placeholder="Enter full address"
            required
          />
        </div>
      </form>
    </div>
  );
}
