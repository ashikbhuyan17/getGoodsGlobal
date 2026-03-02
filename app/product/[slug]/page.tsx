import ProductDescription from '@/components/product/ProductDescription';
import ProductInfoBar from '@/components/product/ProductInfoBar';
import ProductPageClient from '@/components/product/ProductPageClient';
import ProductSuggestions from '@/components/product/ProductSuggestions';
// import SellerRatingCard from "@/components/product/SellerRatingCard";
import { fetcher } from '@/lib/fetcher';
import {
  normalizeProductResponse,
  isProductResponseSuccess,
} from '@/lib/productNormalizer';
import { notFound } from 'next/navigation';

async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  // Parallel fetch: product, wishlist, shipping
  const [rawProduct, wishlist, shippingArea] = await Promise.all([
    fetcher(`/product-details/${slug}`),
    fetcher('/wishlists'),
    fetcher('/shipping-area'),
  ]);

  const product = normalizeProductResponse(rawProduct);
  const p = product?.data?.product;

  if (!isProductResponseSuccess(rawProduct) || !product) notFound();

  // bulkQuantities depends on product (cache 60s)
  const bulkQuantities =
    p?.order_by == 1
      ? await fetcher(`/product-bulkquantities/${p?.id}`, {}, 60)
      : undefined;

  const isInWishlist = (
    wishlist as { data?: { product?: { id?: number } }[] }
  )?.data?.find(
    (item: { product?: { id?: number } }) => item?.product?.id === p?.id,
  );

  const shippingOptions =
    product?.data?.shippingCharge ??
    (shippingArea as { data?: unknown[] })?.data;

  return (
    <main>
      <ProductInfoBar product={product} slug={slug} />
      <div className="flex flex-col gap-2 px-2 max-md:pb-20">
        <ProductPageClient
          bulkQuantities={bulkQuantities}
          product={product}
          isInWishlist={isInWishlist}
          shippingOptions={shippingOptions}
        />
        <div className="w-full grid grid-cols-8 gap-4 rounded-sm mt-4">
          <div className="bg-white px-4 pb-4 col-span-8 lg:col-span-6 rounded-sm">
            {/* <SellerRatingCard /> */}
            <ProductDescription product={product} slug={slug} />
          </div>
          <div className="col-span-8 lg:col-span-2">
            <ProductSuggestions slug={slug} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
