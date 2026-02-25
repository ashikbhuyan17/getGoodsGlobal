import CartOrderGroupSkeleton from '@/components/cart/CartOrderGroupSkeleton';
import CartSummarySkeleton from '@/components/cart/CartSummarySkeleton';

export default function CartLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="h-12 bg-gray-200 rounded animate-pulse mx-4 w-48" />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <CartOrderGroupSkeleton key={i} />
            ))}
          </div>
          <div>
            <CartSummarySkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
