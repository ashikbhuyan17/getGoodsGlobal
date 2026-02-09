'use client';

import ProductSummary from '@/components/product/ProductSummary';
import ProductDetails from '@/components/product/ProductDetails';
import { useState } from 'react';

function ProductPageClient({
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
  const [selectedColor, setSelectedColor] = useState(
    product?.data?.productColors?.[0]?.color || null
  );
  const [selectedSizes, setSelectedSizes] = useState({});
  const [price, setPrice] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shippingAreaSelected, setShippingAreaSelected] = useState<any>(null);

  return (
    <div className="w-full grid grid-cols-8 gap-4 rounded-sm mt-4">
      <div className="bg-white col-span-8 lg:col-span-5 xl:col-span-6 rounded-sm">
        <ProductDetails
          shippingchargeId={shippingAreaSelected?.id}
          bulkQuantities={bulkQuantities}
          setSelectedColor={setSelectedColor}
          setSelectedSizes={setSelectedSizes}
          selectedColor={selectedColor}
          setPrice={setPrice}
          product={product || {}}
        />
      </div>
      <div className="col-span-8 lg:col-span-3 xl:col-span-2">
        <ProductSummary
          setShippingAreaSelected={setShippingAreaSelected}
          shippingAreaSelected={shippingAreaSelected}
          isInWishlist={isInWishlist}
          price={price}
          bulkQuantities={bulkQuantities}
          productId={product?.data?.product?.id}
          sizes={selectedSizes}
          color={selectedColor}
        />
      </div>
    </div>
  );
}

export default ProductPageClient;
