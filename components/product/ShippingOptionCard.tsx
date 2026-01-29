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
      className={`p-4 cursor-pointer rounded-xl transition border ${
        active
          ? "bg-[#E7F2EF] border-[#167389]"
          : "bg-gray-100 border-transparent hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <CheckCircle
          size={22}
          className={active ? "text-[#167389]" : "text-gray-400"}
        />
        <span className="capitalize font-medium">{title}</span>
      </div>
      <p className="text-sm mt-1">{rate}</p>
    </Card>
  );
}
