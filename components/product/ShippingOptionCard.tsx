"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface ShippingOptionCardProps {
  title: string;
  rate: string;
  active?: boolean;
  onClick?: () => void;
}

export default function ShippingOptionCard({
  title,
  rate,
  active,
  onClick,
}: ShippingOptionCardProps) {
  return (
    <Card
      className={`p-3 cursor-pointer rounded-xl transition border ${active
        ? "bg-[#E7F2EF] border-[#67909b] border-2"
        : "bg-gray-100 border-transparent hover:border-gray-300"
        }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <CheckCircle
          size={22}
          className={active ? "text-[#167389]" : "text-gray-400"}
        />
        <span className="capitalize font-medium pt-1">{title}</span>
        <p className="text-sm text-gray-500 font-semibold">{rate}</p>
      </div>
    </Card>
  );
}
