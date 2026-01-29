"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import ShippingOptionCard from "./ShippingOptionCard";
import PriceDetails from "./PriceDetails";
// import ShippingSummary from "./ShippingSummary";
import ActionButtons from "./ActionButtons";
import { fetcher } from "@/lib/fetcher";

export default function ProductSummary({
  sizes,
  color,
  productId,
  isInWishlist,
  bulkQuantities,
  price,
  shippingAreaSelected,
  setShippingAreaSelected,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sizes: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  color: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  price: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isInWishlist: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bulkQuantities?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shippingAreaSelected: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setShippingAreaSelected: any;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shippingArea, setShippingArea] = useState<any>(null);

  useEffect(() => {
    (async function fetchData() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await fetcher("/shipping-area");
      setShippingArea(data);
      setShippingAreaSelected({
        id: data?.data[0]?.id,
        amount: data?.data[0]?.amount,
      });
    })();
  }, [setShippingAreaSelected]);

  let quantity;

  if (typeof sizes === "object" && sizes !== null) {
    quantity = Object.entries(sizes).reduce((prev, curr) => {
      return prev + Number(curr[1]);
    }, 0);
  }

  return (
    <Card className="px-4 rounded-sm border">
      <div className="grid grid-cols-2 gap-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {shippingArea?.data?.map((item: any) => (
          <ShippingOptionCard
            key={item?.id}
            title={item?.name}
            rate={`৳${item?.amount}`}
            active={shippingAreaSelected?.id === item?.id}
            onClick={() =>
              setShippingAreaSelected({ id: item?.id, amount: item?.amount })
            }
          />
        ))}
      </div>

      <PriceDetails
        shipping={shippingAreaSelected?.amount}
        price={price}
        bulkQuantities={bulkQuantities}
        quantity={quantity ?? 0}
      />
      {/* <ShippingSummary /> */}
      <ActionButtons
        isInWishlist={isInWishlist}
        productId={productId}
        shipping={shippingAreaSelected?.id}
        sizes={sizes}
        color={color}
      />
    </Card>
  );
}
