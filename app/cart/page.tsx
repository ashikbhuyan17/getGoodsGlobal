/* eslint-disable @typescript-eslint/no-explicit-any */
import CartEmptyState from '@/components/cart/CartEmptyState';
import CartInfoBar from '@/components/cart/CartInfoBar';
import CartPageClient from '@/components/cart/CartPageClient';
import { fetcher } from '@/lib/fetcher';

export default async function CartPage() {
  const cartProducts: any = await fetcher('/cart-products');

  if (cartProducts?.data?.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <CartInfoBar />
        <div className="container mx-auto px-2 py-3 sm:px-4 sm:py-6 lg:py-8">
          <CartEmptyState />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12 lg:pb-0">
      <CartInfoBar />
      <div className="container mx-auto px-2 pt-3 pb-0 sm:px-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-8">
          <CartPageClient cartProducts={cartProducts} />
        </div>
      </div>
    </main>
  );
}
