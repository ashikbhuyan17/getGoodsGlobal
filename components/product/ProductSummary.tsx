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
  flashSalePercentage,
}: {
  productId: any;
  isInWishlist: any;
  bulkQuantities?: any;
  flashSalePercentage?: string;
}) {
  const shippingOptions = useProductStore((s) => s.shippingOptions);
  const shippingArea = useProductStore((s) => s.shippingArea);
  const setShippingArea = useProductStore((s) => s.setShippingArea);
  const totalQuantity = useProductStore((s) => s.totalQuantity);
  const priceList = useProductStore((s) => s.priceList);
  // Subscribe to variants so quantity/price updates when size increment/decrement
  useProductStore((s) => s.variants);

  const quantity = totalQuantity();
  const price = priceList();

  return (
    <Card className="px-4 rounded-sm border">
      {/* <div className="grid grid-cols-2 gap-3">
        {shippingOptions?.map((item) => (
          <ShippingOptionCard
            key={item?.id}
            title={item?.name}
            rate={`৳${item?.amount}`}
            active={shippingArea?.id === item?.id}
            onClick={() =>
              setShippingArea({ id: item?.id, amount: item?.amount })
            }
          />
        ))}
      </div> */}

      <PriceDetails
        // shipping={shippingArea?.amount ?? 0}
        shipping={0}
        price={price}
        bulkQuantities={bulkQuantities}
        quantity={quantity}
        flashSalePercentage={flashSalePercentage}
      />
      <ActionButtons isInWishlist={isInWishlist} productId={productId} />
    </Card>
  );
}
