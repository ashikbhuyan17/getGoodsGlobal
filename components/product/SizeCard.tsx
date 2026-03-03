'use client';

import { Button } from '../ui/button';
import QuantityUpdateBtn from '../common/QuantityUpdateBtn';
import { useProductStore } from '@/stores/useProductStore';

function SizeCard({
  size,
  colorId,
  price,
  max = 999999999,
  displayLabel,
  flashSalePercentage,
}: {
  size: string | number;
  price: string | number;
  colorId: string;
  max?: number;
  /** Optional: show in UI instead of size (e.g. specification). API always receives size. */
  displayLabel?: string;
  /** Flash sale percentage (e.g. "5"). When set, apply discount and show both prices. */
  flashSalePercentage?: string;
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

  const originalPrice = Number(price);
  const pct = Number(flashSalePercentage) || 0;
  const discountedPrice =
    pct > 0 ? Math.round(originalPrice * (1 - pct / 100)) : originalPrice;
  const priceToUse = pct > 0 ? discountedPrice : originalPrice;

  const handleQuantityChange = (newQty: number) => {
    setVariant(String(colorId), String(size), newQty, priceToUse);
  };

  return (
    <div className="grid grid-cols-3 gap-0 items-center py-3 px-1">
      {/* Size Column - displayLabel for UI, size used for variant/API */}
      <p className="text-left text-gray-800">{displayLabel ?? size}</p>

      {/* Price Column */}
      <div className="flex flex-col items-center gap-1">
        {pct > 0 ? (
          <>
            <p className="font-semibold text-gray-800">৳{discountedPrice}</p>
            <p className="text-sm text-gray-400 line-through">৳{originalPrice}</p>
          </>
        ) : (
          <p className="font-semibold text-gray-800">৳{originalPrice}</p>
        )}
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
