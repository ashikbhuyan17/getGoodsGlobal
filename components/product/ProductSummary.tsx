/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import ShippingOptionCard from "./ShippingOptionCard";
import PriceDetails from "./PriceDetails";
import ActionButtons from "./ActionButtons";
import { useProductStore } from "@/stores/useProductStore";

export default function ProductSummary({
  productId,
  isInWishlist,
  bulkQuantities,
}: {
  productId: string | number;
  isInWishlist: boolean;
  bulkQuantities?: any;
}) {
  const shippingArea = useProductStore((s) => s.shippingArea);
  const setShippingArea = useProductStore((s) => s.setShippingArea);
  const shippingOptions = useProductStore((s) => s.shippingOptions);
  const totalQuantity = useProductStore((s) => s.totalQuantity)();
  const priceList = useProductStore((s) => s.priceList)();

  return (
    <Card className="px-4 rounded-sm border">
      <div className="grid grid-cols-2 gap-3">
        {shippingOptions.map((item) => (
          <ShippingOptionCard
            key={item?.id}
            title={item?.name ?? ""}
            rate={`৳${item?.amount ?? 0}`}
            active={shippingArea?.id === item?.id}
            onClick={() =>
              setShippingArea({ id: item?.id, amount: item?.amount })
            }
          />
        ))}
      </div>

      <PriceDetails
        shipping={Number(shippingArea?.amount ?? 0)}
        price={priceList}
        bulkQuantities={bulkQuantities}
        quantity={totalQuantity}
      />

      <ActionButtons isInWishlist={isInWishlist} productId={productId} />
    </Card>
  );
}
