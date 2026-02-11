import { fetcher } from "@/lib/fetcher";
import CheckoutClient from "@/components/checkout/CheckoutClient";

type SearchParams = { buyNow?: string };

async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isBuyNow = params?.buyNow === "1";

  // Cart theke gele cart-products, Buy Now theke gele buy-products
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartProducts: any = await fetcher(
    isBuyNow ? "/buy-products" : "/cart-products"
  );
  const user = await fetcher("/user-profile");

  return (
    <div className="min-h-screen py-8 px-2">
      <CheckoutClient
        user={user}
        cartProducts={cartProducts}
        isBuyNow={isBuyNow}
      />
    </div>
  );
}

export default CheckoutPage;
