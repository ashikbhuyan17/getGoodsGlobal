import { fetcher } from "@/lib/fetcher";
import CheckoutClient from "@/components/checkout/CheckoutClient";
async function CheckoutPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartProducts: any = await fetcher("/cart-products");
  const user = await fetcher("/user-profile");

  return (
    <div className="min-h-screen py-8 px-2">
      <CheckoutClient user={user} cartProducts={cartProducts} />
    </div>
  );
}

export default CheckoutPage;
