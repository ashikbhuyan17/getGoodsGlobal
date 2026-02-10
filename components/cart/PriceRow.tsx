import { ReactNode } from 'react';

interface PriceRowProps {
  label: string;
  value: string | number;
  children?: ReactNode;
  discount?: number;
}

export default function PriceRow({
  label,
  value,
  children,
  discount,
}: PriceRowProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="font-semibold">{label}</span>
        {children}
        {discount && (
          <span className="bg-[#FFF0F6] border border-[#b94e8d] text-xs font-semibold text-[#c41d7f] py-[2px] px-2 rounded-sm">
            {discount}%
          </span>
        )}
      </div>

      <span className="font-semibold text-base">{value}</span>
    </div>
  );
}
