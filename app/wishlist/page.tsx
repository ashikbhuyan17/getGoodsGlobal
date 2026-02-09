/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcher } from '@/lib/fetcher';
import WishlistInfoBar from '@/components/wishlist/WishlistInfoBar';
import WishlistEmptyState from '@/components/wishlist/WishlistEmptyState';
import WishlistProductCard from '@/components/wishlist/WishlistProductCard';

export default async function WishlistPage() {
  const wishlist: any = await fetcher('/wishlists');

  const hasItems = wishlist?.data && wishlist?.data?.length > 0;

  return (
    <main className="min-h-screen space-y-5 max-md:pb-24">
      <WishlistInfoBar />

      <div className="px-2">
        {!hasItems ? (
          <WishlistEmptyState />
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {wishlist?.data?.map((item: any, index: number) => {
                // Handle image - try image.image first, then PostImage array, then fallback
                let productImage = item?.product?.image?.image;
                if (!productImage && item?.product?.PostImage) {
                  try {
                    const postImages = JSON.parse(item.product.PostImage);
                    productImage =
                      Array.isArray(postImages) && postImages.length > 0
                        ? postImages[0]
                        : null;
                  } catch {
                    productImage = null;
                  }
                }

                return (
                  <WishlistProductCard
                    key={item?.id || index}
                    id={item?.id}
                    productId={item?.product?.id}
                    slug={item?.product?.slug}
                    image={productImage || ''}
                    title={item?.product?.name}
                    newPrice={item?.product?.new_price}
                    oldPrice={item?.product?.old_price}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
