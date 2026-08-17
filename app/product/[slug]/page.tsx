import ProductDescription from '@/components/product/ProductDescription';
import ProductInfoBar from '@/components/product/ProductInfoBar';
import ProductPageClient from '@/components/product/ProductPageClient';
import ProductSuggestions from '@/components/product/ProductSuggestions';
import { fetcher } from '@/lib/fetcher';
import {
  normalizeProductResponse,
  isProductResponseSuccess,
} from '@/lib/productNormalizer';
import { REVALIDATE_CATALOG, REVALIDATE_PRODUCTS } from '@/lib/utils';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';

export const revalidate = 60;

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const getProductDetails = unstable_cache(
    async () =>
      fetcher(`/product-details/${slug}`, {}, REVALIDATE_PRODUCTS, false),
    ['product-details', slug],
    { revalidate: REVALIDATE_PRODUCTS },
  );

  const getShippingArea = unstable_cache(
    async () =>
      fetcher('/shipping-area', {}, REVALIDATE_CATALOG, false).catch(() => ({
        status: false,
        data: [],
      })),
    ['shipping-area'],
    { revalidate: REVALIDATE_CATALOG },
  );

  const [rawProduct, shippingArea] = await Promise.all([
    getProductDetails(),
    getShippingArea(),
  ]);

  const product = normalizeProductResponse(rawProduct);
  const p = product?.data?.product;

  if (!isProductResponseSuccess(rawProduct) || !product) notFound();

  const bulkQuantities =
    p?.order_by == 1
      ? await fetcher(
          `/product-bulkquantities/${p?.id}`,
          {},
          REVALIDATE_PRODUCTS,
          false,
        )
      : undefined;

  const shippingOptions =
    product?.data?.shippingCharge ??
    (shippingArea as { data?: unknown[] })?.data;

  return (
    <main>
      <ProductInfoBar product={product} slug={slug} />
      <div className="flex flex-col gap-2 px-2 pb-20 lg:pb-2">
        <ProductPageClient
          bulkQuantities={bulkQuantities}
          product={product}
          shippingOptions={shippingOptions}
        />
        <div className="w-full grid grid-cols-8 gap-4 rounded-sm mt-4">
          <div className="bg-white px-4 pb-4 col-span-8 lg:col-span-5 xl:col-span-6 rounded-sm">
            {/* <SellerRatingCard /> */}
            <ProductDescription product={product} slug={slug} />
          </div>
          <div className="col-span-8 lg:col-span-3 xl:col-span-2">
            <ProductSuggestions slug={slug} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
