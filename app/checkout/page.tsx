import { fetcher } from '@/lib/fetcher';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export const dynamic = 'force-dynamic';

type SearchParams = { buyNow?: string; cart_ids?: string };

async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isBuyNow = params?.buyNow === '1';

  const cartProductsPromise: Promise<{
    data?: unknown[];
    status?: string;
    message?: string;
  }> = isBuyNow
    ? fetcher('/buy-products')
    : params?.cart_ids?.trim()
      ? (() => {
          const ids = params.cart_ids
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean);
          const query = ids
            .map((id) => `cart_ids[]=${encodeURIComponent(id)}`)
            .join('&');
          return fetcher(`/cart-order-products?${query}`);
        })()
      : Promise.resolve({ data: [], status: 'success' });

  const [cartProducts, user, shippingArea] = await Promise.all([
    cartProductsPromise,
    fetcher('/user-profile'),
    fetcher('/shipping-area').catch(() => ({ status: false, data: [] })),
  ]);

  const shippingOptions =
    (
      shippingArea as {
        data?: {
          id: number;
          name: string;
          amount: string;
          to_amount: string;
        }[];
      }
    )?.data ?? [];

  return (
    <div className="min-h-screen min-w-0 px-2 pb-20 pt-8 lg:pb-8">
      <CheckoutClient
        user={user}
        cartProducts={cartProducts}
        isBuyNow={isBuyNow}
        shippingOptions={shippingOptions}
      />
    </div>
  );
}

export default CheckoutPage;
