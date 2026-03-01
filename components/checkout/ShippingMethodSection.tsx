'use client';

import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface ShippingOption {
  id: number;
  name: string;
  amount: string;
  to_amount: string;
  status?: string;
}

interface ShippingMethodSectionProps {
  options: ShippingOption[];
  selectedId: number | null;
  onSelect: (option: ShippingOption | null) => void;
}

export default function ShippingMethodSection({
  options,
  selectedId,
  onSelect,
}: ShippingMethodSectionProps) {
  if (!options?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <Label className="text-base font-semibold mb-3 block">
        Shipping Method <span className="text-red-500">*</span>
      </Label>
      <div className="space-y-2">
        {options.map((opt) => {
          const amount = Number(opt.amount) || 0;
          const isSelected = selectedId === opt.id;
          return (
            <label
              key={opt.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                  : 'hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelect(checked ? opt : null)}
                />
                <span className="font-medium text-gray-800">{opt.name}</span>
              </div>
              <span className="text-primary font-semibold">৳{amount}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
