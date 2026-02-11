'use client';

import { Button } from '../ui/button';
import QuantityUpdateBtn from '../common/QuantityUpdateBtn';
import { useProductStore } from '@/stores/useProductStore';

function SizeCard({
  size,
  colorId,
  price,
  max = 999999999,
}: {
  size: string | number;
  price: string | number;
  colorId: string;
  max?: number;
}) {
  const setVariant = useProductStore((s) => s.setVariant);
  const variants = useProductStore((s) => {
    return s.variants;
  });

  const quantity =
    variants.find(
      (v) =>
        String(v.color_id) === String(colorId) &&
        String(v.size) === String(size),
    )?.quantity ?? 0;

  const priceNum = Number(price);
  const handleQuantityChange = (newQty: number) => {
    setVariant(String(colorId), String(size), newQty, priceNum);
  };

  return (
    <div className="grid grid-cols-3 gap-0 items-center py-3 px-1">
      {/* Size Column */}
      <p className="text-left text-gray-800">{size}</p>

      {/* Price Column */}
      <div className="flex flex-col items-center gap-1">
        <p className=" font-semibold text-gray-800">৳{price}</p>
      </div>

      {/* Quantity Column */}
      <div className="flex flex-col items-end gap-1">
        {quantity < 1 ? (
          <Button
            onClick={() => handleQuantityChange(1)}
            className=" text-white px-4 py-2 rounded-md"
          >
            Add
          </Button>
        ) : (
          <QuantityUpdateBtn
            quantity={quantity}
            setQuantity={(val: number) => handleQuantityChange(val)}
            size={size}
            max={max}
          />
        )}
      </div>
    </div>
  );
}

export default SizeCard;
