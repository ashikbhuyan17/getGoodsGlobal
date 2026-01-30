"use client";

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
    <div className="flex items-center justify-between py-1 text-sm font-medium">
      <div>
        <p>Color: {color}</p>
        {size && <p>Size: {size}</p>}
      </div>
      <div >
        {qty} x ৳{price}
      </div>
      <div className="flex items-center gap-4">

        <span>৳{qty * price}</span>

        {page === "cart" && (
          <UpdateCartModal
            id={id}
            size={size}
            color={color}
            qty={qty}
            price={price}
          >
            <button
              // size="sm"
              // variant="outline"
              onClick={onEdit}
              className="border-primary py-[2px]  rounded text-white  px-2 text-sm bg-primary"
            >
              Edit
            </button>
          </UpdateCartModal>
        )}
      </div>
    </div>
  );
}
