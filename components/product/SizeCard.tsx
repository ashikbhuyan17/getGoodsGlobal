'use client';

import { Button } from '../ui/button';
import QuantityUpdateBtn from '../common/QuantityUpdateBtn';
import { useProductStore } from '@/stores/useProductStore';
import { getActiveBulkTier, formatPriceInt } from '@/lib/utils';

function SizeCard({
  size,
  colorId,
  price,
  max = 999999999,
  displayLabel,
  flashSalePercentage,
  bulkQuantities,
  totalQuantity,
}: {
  size: string | number;
  price: string | number;
  colorId: string;
  max?: number;
  /** Optional: show in UI instead of size (e.g. specification). API always receives size. */
  displayLabel?: string;
  /** Flash sale percentage (e.g. "5"). When set, apply discount and show both prices. */
  flashSalePercentage?: string;
  /** When set, use bulk tier price instead of variant price. */
  bulkQuantities?: {
    data?: {
      min_qty?: string | number;
      max_qty?: string | number;
      price?: string | number;
    }[];
  };
  totalQuantity?: number;
}) {
  const setVariant = useProductStore((s) => s.setVariant);
  const variants = useProductStore((s) => s.variants);

  const quantity =
    variants.find(
      (v) =>
        String(v.color_id) === String(colorId) &&
        String(v.size) === String(size),
    )?.quantity ?? 0;

  const useBulk = bulkQuantities && totalQuantity !== undefined;
  const bulkTier = useBulk
    ? getActiveBulkTier(bulkQuantities, totalQuantity)
    : null;
  const basePrice = bulkTier ? bulkTier.price : Number(price);

  const pct = Number(flashSalePercentage) || 0;
  const discountedPrice = pct > 0 ? basePrice * (1 - pct / 100) : basePrice;
  const priceToUse = pct > 0 ? discountedPrice : basePrice;

  const handleQuantityChange = (newQty: number) => {
    const newTotal = (totalQuantity ?? 0) - quantity + newQty;
    const tierForNewTotal = useBulk
      ? getActiveBulkTier(bulkQuantities, newTotal)
      : null;
    const priceForVariant = tierForNewTotal ? tierForNewTotal.price : basePrice;
    const finalPrice =
      pct > 0 ? priceForVariant * (1 - pct / 100) : priceForVariant;
    setVariant(String(colorId), String(size), newQty, finalPrice);
  };

  return (
    <div className="grid grid-cols-3 gap-0 items-center py-3 px-1">
      {/* Size Column - displayLabel for UI, size used for variant/API */}
      <p className="text-left text-gray-800">{displayLabel ?? size}</p>

      {/* Price Column */}
      <div className="flex flex-col items-center gap-1">
        {pct > 0 ? (
          <>
            <p className="font-semibold text-gray-800">
              ৳{formatPriceInt(discountedPrice)}
            </p>
            <p className="text-sm text-gray-400 line-through">
              ৳{formatPriceInt(basePrice)}
            </p>
          </>
        ) : (
          <p className="font-semibold text-gray-800">
            ৳{formatPriceInt(basePrice)}
          </p>
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
