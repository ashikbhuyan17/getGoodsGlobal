'use client';

import { Button } from '../ui/button';
import QuantityUpdateBtn from '../common/QuantityUpdateBtn';
import { useProductStore } from '@/stores/useProductStore';
import { getActiveBulkTier, formatPriceInt } from '@/lib/utils';

function SizeCard({
  size,
  colorId,
  price,
  RegularPrice,
  SalePrice,
  max,
  displayLabel,
  bulkQuantities,
  totalQuantity,
}: {
  size: string | number;
  price: string | number;
  RegularPrice: string | number;
  SalePrice: string | number;
  colorId: string;
  max?: number;
  /** Optional: show in UI instead of size (e.g. specification). API always receives size. */
  displayLabel?: string;
  /** When set, use bulk tier price instead of variant price. */
  bulkQuantities?: {
    data?: {
      min_qty?: string | number;
      max_qty?: string | number;
      price?: string | number;
      flash_sale_price?: string | number | null;
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
  const bulkEffectivePrice = bulkTier
    ? bulkTier.flashSalePrice ?? bulkTier.price
    : Number(price);
  const isOutOfStock = Number(max ?? 0) <= 0;

  const handleQuantityChange = (newQty: number) => {
    if (isOutOfStock) return;
    const newTotal = (totalQuantity ?? 0) - quantity + newQty;
    const tierForNewTotal = useBulk
      ? getActiveBulkTier(bulkQuantities, newTotal)
      : null;
    const priceForVariant = tierForNewTotal
      ? tierForNewTotal.flashSalePrice ?? tierForNewTotal.price
      : bulkEffectivePrice;
    setVariant(String(colorId), String(size), newQty, priceForVariant);
  };

  return (
    <div className="grid grid-cols-3 gap-0 items-center py-3 px-1">
      {/* Size Column - displayLabel for UI, size used for variant/API */}
      <p className="text-left text-gray-800">{displayLabel ?? size}</p>

      {/* Price Column */}
      <div className="flex flex-col items-center gap-1">
        {useBulk ? (
          bulkTier?.flashSalePrice != null ? (
            <>
              <p className="font-semibold text-gray-800">
                ৳{formatPriceInt(bulkTier.flashSalePrice)}
              </p>
              <p className="text-sm text-gray-400 line-through">
                ৳{formatPriceInt(bulkTier.price)}
              </p>
            </>
          ) : (
            <p className="font-semibold text-gray-800">
              ৳{formatPriceInt(bulkTier?.price ?? 0)}
            </p>
          )
        ) : (
          <>
            <p className="font-semibold text-gray-800">
              ৳{formatPriceInt(SalePrice)}
            </p>
            <p className="text-sm text-gray-400 line-through">
              ৳{formatPriceInt(RegularPrice)}
            </p>
          </>
        )}
      </div>

      {/* Quantity Column */}
      <div className="flex flex-col items-end gap-1">
        {isOutOfStock ? (
          <Button disabled size="sm" variant="outline" className="px-3">
            Stock Out
          </Button>
        ) : quantity < 1 ? (
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
