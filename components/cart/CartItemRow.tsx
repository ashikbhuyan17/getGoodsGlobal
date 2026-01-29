"use client";

import { Button } from "@/components/ui/button";
import UpdateCartModal from "./UpdateCartModal";

interface CartItemRowProps {
  color: string;
  size?: string;
  qty: number;
  id: number | string;
  price: number;
  page?: "cart" | "checkout";

  onEdit?: () => void;
}

export default function CartItemRow({
  color,
  size,
  qty,
  price,
  page = "cart",
  id,
  onEdit,
}: CartItemRowProps) {
  return (
    <div className="flex items-center justify-between pl-10 py-3 border-b">
      <div>
        <p className="text-sm font-medium">Color: {color}</p>
        {size && <p className="text-xs text-gray-500">Size: {size}</p>}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">
          {qty} x ৳{price}
        </span>
        <span className="text-sm font-semibold">৳{qty * price}</span>

        {page === "cart" && (
          <UpdateCartModal
            id={id}
            size={size}
            color={color}
            qty={qty}
            price={price}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="text-primary border-primary hover:bg-teal-50"
            >
              Edit
            </Button>
          </UpdateCartModal>
        )}
      </div>
    </div>
  );
}
