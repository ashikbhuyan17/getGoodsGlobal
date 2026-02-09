import ProductDescription from '@/components/product/ProductDescription';
import ProductInfoBar from '@/components/product/ProductInfoBar';
import ProductPageClient from '@/components/product/ProductPageClient';
import ProductSuggestions from '@/components/product/ProductSuggestions';
// import SellerRatingCard from "@/components/product/SellerRatingCard";
import { fetcher } from '@/lib/fetcher';
import { notFound } from 'next/navigation';

async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product: any = await fetcher(`/product-details/${slug}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wishlist: any = await fetcher('/wishlists');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bulkQuantities: any =
    product?.data?.product?.order_by == 1
      ? await fetcher(`/product-bulkquantities/${product?.data?.product?.id}`)
      : undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isInWishlist = wishlist?.data?.find((item: any) => {
    return item?.product?.id === product?.data?.product?.id;
  });

  if (product?.status !== 'success') notFound();

  return (
    <main>
      <ProductInfoBar slug={slug} />
      <div className="flex flex-col gap-2 px-2">
        <ProductPageClient
          bulkQuantities={bulkQuantities}
          product={product}
          isInWishlist={isInWishlist}
        />
        <div className="w-full grid grid-cols-8 gap-4 rounded-sm mt-4">
          <div className="bg-white px-4 pb-4 col-span-8 lg:col-span-6 rounded-sm">
            {/* <SellerRatingCard /> */}
            <ProductDescription slug={slug} />
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
