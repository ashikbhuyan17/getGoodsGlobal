/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ProductSummary from '@/components/product/ProductSummary';
import ProductDetails from '@/components/product/ProductDetails';
import { useEffect } from 'react';
import { useProductStore } from '@/stores/useProductStore';

function ProductPageClient({
  product,
  bulkQuantities,
  shippingOptions,
}: {
  product: any;
  bulkQuantities?: any;
  shippingOptions?: any[];
}) {
  const initFromProduct = useProductStore((s) => s.initFromProduct);
  const reset = useProductStore((s) => s.reset);

  useEffect(() => {
    if (product) {
      initFromProduct(product, shippingOptions);
    }
    return () => {
      reset();
    };
  }, [product, shippingOptions, initFromProduct, reset]);

  return (
    <div className="w-full grid grid-cols-8 gap-4 rounded-sm mt-4">
      <div className="bg-white col-span-8 min-w-0 lg:col-span-5 xl:col-span-6 rounded-sm">
        <ProductDetails
          key={product?.data?.product?.id}
          bulkQuantities={bulkQuantities}
          product={product || {}}
        />
      </div>
      <div className="col-span-8 min-w-0 lg:col-span-3 xl:col-span-2">
        <ProductSummary
          bulkQuantities={bulkQuantities}
          productId={product?.data?.product?.id}
        />
      </div>
    </div>
  );
}

export default ProductPageClient;
