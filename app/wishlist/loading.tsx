import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';

export default function WishlistLoading() {
  return (
    <main className="min-h-screen space-y-5 max-md:pb-24">
      <div className="h-12 bg-gray-200 rounded animate-pulse mx-2 w-48" />
      <div className="px-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
