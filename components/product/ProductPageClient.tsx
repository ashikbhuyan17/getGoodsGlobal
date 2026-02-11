"use client";

import ProductSummary from "@/components/product/ProductSummary";
import ProductDetails from "@/components/product/ProductDetails";
import { useEffect } from "react";
import { useProductStore } from "@/stores/useProductStore";

export default function ProductPageClient({
  product,
  bulkQuantities,
  isInWishlist,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isInWishlist: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bulkQuantities?: any;
}) {
  const initFromProduct = useProductStore((s) => s.initFromProduct);
  const reset = useProductStore((s) => s.reset);

  useEffect(() => {
    if (product) initFromProduct(product);
    return () => reset();
  }, [product, initFromProduct, reset]);

  return (
    <div className="w-full grid grid-cols-8 gap-4 rounded-sm mt-4">
      <div className="bg-white col-span-8 lg:col-span-5 rounded-sm">
        <ProductDetails product={product} bulkQuantities={bulkQuantities} />
      </div>
      <div className="col-span-8 lg:col-span-3">
        <ProductSummary
          productId={product?.data?.product?.id}
          isInWishlist={isInWishlist}
          bulkQuantities={bulkQuantities}
        />
      </div>
    </div>
  );
}
