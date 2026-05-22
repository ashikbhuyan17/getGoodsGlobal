'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import QuantityUpdateBtn from '../common/QuantityUpdateBtn';
import { useProductStore } from '@/stores/useProductStore';
import { cn, getActiveBulkTier, formatPriceInt } from '@/lib/utils';

function SizeCard({
  size,
  colorId,
  price,
  RegularPrice,
  SalePrice,
  max,
  displayLabel,
  specLayout,
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
  /** Wider first column when showing long specification text. */
  specLayout?: boolean;
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

  const isOutOfStock = Number(max ?? 0) <= 0;

  /**
   * Stays true after the user hits "Add" so at qty 0 the stepper remains and
   * they can set a new value without the Add button coming back.
   */
  const [lineExpanded, setLineExpanded] = useState(false);
  const showQuantityStepper = !isOutOfStock && (quantity > 0 || lineExpanded);

  const useBulk = bulkQuantities && totalQuantity !== undefined;
  const bulkTier = useBulk
    ? getActiveBulkTier(bulkQuantities, totalQuantity)
    : null;
  const bulkEffectivePrice = bulkTier
    ? (bulkTier.flashSalePrice ?? bulkTier.price)
    : Number(price);

  const handleQuantityChange = (newQty: number) => {
    if (isOutOfStock) return;
    const newTotal = (totalQuantity ?? 0) - quantity + newQty;
    const tierForNewTotal = useBulk
      ? getActiveBulkTier(bulkQuantities, newTotal)
      : null;
    const priceForVariant = tierForNewTotal
      ? (tierForNewTotal.flashSalePrice ?? tierForNewTotal.price)
      : bulkEffectivePrice;
    setVariant(String(colorId), String(size), newQty, priceForVariant);
  };

  const labelText = String(displayLabel ?? size ?? '');
  const specLines = displayLabel
    ? labelText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : null;

  return (
    <div
      className={cn(
        'grid items-start gap-x-1 gap-y-1 px-0.5 py-2.5 min-w-0 sm:px-1 sm:py-3',
        specLayout
          ? 'grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]'
          : 'grid-cols-3',
      )}
    >
      {/* Size / specification — full value, line by line (no ellipsis) */}
      <div className="min-w-0 text-left text-sm leading-relaxed text-gray-800">
        {specLines && specLines.length > 1 ? (
          <ul className="m-0 list-none space-y-1 p-0">
            {specLines.map((line, index) => (
              <li
                key={`${line}-${index}`}
                className="wrap-break-word whitespace-normal"
              >
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <span className="wrap-break-word whitespace-pre-wrap">
            {labelText}
          </span>
        )}
      </div>

      {/* Price Column */}
      <div className="flex min-w-0 flex-col items-center gap-0.5 sm:gap-1">
        {useBulk ? (
          bulkTier?.flashSalePrice != null ? (
            <>
              <p className="min-w-0 truncate text-center  font-semibold text-gray-800 text-sm">
                ৳{formatPriceInt(bulkTier.flashSalePrice)}
              </p>
              <p className=" text-gray-400 line-through text-sm">
                ৳{formatPriceInt(bulkTier.price)}
              </p>
            </>
          ) : (
            <p className="min-w-0 truncate text-center font-semibold text-gray-800 text-sm">
              ৳{formatPriceInt(bulkTier?.price ?? 0)}
            </p>
          )
        ) : (
          <>
            <p className="min-w-0 truncate text-center  font-semibold text-gray-800 text-sm">
              ৳{formatPriceInt(SalePrice)}
            </p>
            <p className=" text-gray-400 line-through text-sm">
              ৳{formatPriceInt(RegularPrice)}
            </p>
          </>
        )}
      </div>

      {/* Quantity Column — min-w-0 so the stepper can shrink inside the grid */}
      <div className="flex min-w-0 flex-col items-stretch justify-center sm:items-end">
        {isOutOfStock ? (
          <Button
            disabled
            size="sm"
            variant="outline"
            className="w-full max-w-full shrink px-2 text-xs sm:ml-auto sm:w-auto sm:px-3 sm:text-sm"
          >
            Stock Out
          </Button>
        ) : !showQuantityStepper ? (
          <Button
            onClick={() => {
              setLineExpanded(true);
              handleQuantityChange(1);
            }}
            className="w-full max-w-full shrink whitespace-nowrap rounded-md px-3 py-2 text-xs text-white sm:ml-auto sm:w-auto sm:px-4 sm:text-sm"
          >
            Add
          </Button>
        ) : (
          <QuantityUpdateBtn
            quantity={quantity}
            setQuantity={(val: number) => handleQuantityChange(val)}
            size={size}
            max={max}
            min={0}
          />
        )}
      </div>
    </div>
  );
}

export default SizeCard;
