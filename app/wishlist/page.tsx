import { fetcher } from "@/lib/fetcher";
import WishlistInfoBar from "@/components/wishlist/WishlistInfoBar";
import WishlistEmptyState from "@/components/wishlist/WishlistEmptyState";
import WishlistProductCard from "@/components/wishlist/WishlistProductCard";

export default async function WishlistPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wishlist: any = await fetcher("/wishlists");

  const hasItems = wishlist?.data && wishlist?.data?.length > 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <WishlistInfoBar />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        {!hasItems ? (
          <WishlistEmptyState />
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                My Wishlist
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {wishlist?.data?.length} {wishlist?.data?.length === 1 ? "item" : "items"} saved
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {wishlist?.data?.map((item: any, index: number) => (
                <WishlistProductCard
                  key={item?.id || index}
                  id={item?.id}
                  productId={item?.product?.id}
                  slug={item?.product?.slug}
                  image={item?.product?.image?.image}
                  title={item?.product?.name}
                  newPrice={item?.product?.new_price}
                  oldPrice={item?.product?.old_price}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
