import { fetcher } from "@/lib/fetcher";
import CheckoutClient from "@/components/checkout/CheckoutClient";

type SearchParams = { buyNow?: string; cart_ids?: string };

async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isBuyNow = params?.buyNow === "1";

  // Cart: cart-order-products with selected ids from URL. Buy Now: buy-products. No /cart-products.
  let cartProducts: { data?: unknown[]; status?: string; message?: string };
  if (isBuyNow) {
    cartProducts = await fetcher("/buy-products");
  } else if (params?.cart_ids?.trim()) {
    const ids = params.cart_ids.split(",").map((id) => id.trim()).filter(Boolean);
    const query = ids.map((id) => `cart_ids[]=${encodeURIComponent(id)}`).join("&");
    cartProducts = await fetcher(`/cart-order-products?${query}`);
  } else {
    cartProducts = { data: [], status: "success" };
  }
  console.log("🚀 ~ CheckoutPage ~ cartProducts:", cartProducts)

  const [user, shippingArea] = await Promise.all([
    fetcher("/user-profile"),
    fetcher("/shipping-area").catch(() => ({ status: false, data: [] })),
  ]);

  const shippingOptions = (shippingArea as { data?: { id: number; name: string; amount: string; to_amount: string }[] })?.data ?? [];

  return (
    <div className="min-h-screen py-8 px-2">
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
