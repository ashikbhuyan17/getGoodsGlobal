import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';

export default function SubcategoryLoading() {
  return (
    <div className="min-h-screen space-y-5">
      <div className="h-12 bg-gray-200 rounded animate-pulse mx-2 w-48" />
      <div className="px-2">
        <div className="bg-white rounded-sm border-border p-4 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
