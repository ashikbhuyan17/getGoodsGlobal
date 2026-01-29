import { ReactNode } from "react";

interface PriceRowProps {
  label: string;
  value: string | number;
  children?: ReactNode;
}

export default function PriceRow({ label, value, children }: PriceRowProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">{label}</span>
        {children}
      </div>

      <span className="font-semibold">{value}</span>
    </div>
  );
}
