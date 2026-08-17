import { fetcher } from '@/lib/fetcher';
import { fetchLocations } from '@/lib/locations';
import CheckoutClient from '@/components/checkout/CheckoutClient';

type SearchParams = { buyNow?: string; cart_ids?: string };

async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isBuyNow = params?.buyNow === '1';

  // Cart: cart-order-products with selected ids from URL. Buy Now: buy-products. No /cart-products.
  let cartProducts: { data?: unknown[]; status?: string; message?: string };
  if (isBuyNow) {
    cartProducts = await fetcher('/buy-products');
  } else if (params?.cart_ids?.trim()) {
    const ids = params.cart_ids
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    const query = ids
      .map((id) => `cart_ids[]=${encodeURIComponent(id)}`)
      .join('&');
    cartProducts = await fetcher(`/cart-order-products?${query}`);
  } else {
    cartProducts = { data: [], status: 'success' };
  }

  const [user, shippingArea, locations] = await Promise.all([
    fetcher('/user-profile'),
    fetcher('/shipping-area').catch(() => ({ status: false, data: [] })),
    fetchLocations(),
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
        locations={locations}
      />
    </div>
  );
}

export default CheckoutPage;
