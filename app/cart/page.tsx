import CartOrderGroup from "@/components/cart/CartOrderGroup";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import CartEmptyState from "@/components/cart/CartEmptyState";
import CartInfoBar from "@/components/cart/CartInfoBar";
import { fetcher } from "@/lib/fetcher";

export default async function CartPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartProducts: any = await fetcher("/cart-products");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productsWithTotals = cartProducts?.data?.map((product: any) => {
    const itemTotal = product?.cartdetails?.reduce(
      (sum: number, item: { quantity: number; price: number }) => {
        return sum + Number(item?.quantity) * Number(item?.price);
      },
      0
    );

    return {
      ...product,
      totalPrice: itemTotal,
    };
  });

  const grandTotal = productsWithTotals.reduce(
    (sum: number, product: { totalPrice: number }) => {
      return sum + product.totalPrice;
    },
    0
  );

  if (cartProducts?.data?.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <CartInfoBar />
        <div className="container mx-auto px-4 py-6 md:py-8">
          <CartEmptyState />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <CartInfoBar />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order 1 */}

            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {cartProducts?.data?.map((product: any) => (
              <CartOrderGroup
                key={product?.id}
                orderId={`CRT-${product?.id}`}
                image={`${process.env.NEXT_PUBLIC_IMG_URL}/${product?.image}`}
                title={product?.product_name}
                product={product}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {product?.cartdetails?.map((cart: any) => (
                  <CartItemRow
                    key={cart?.id}
                    id={cart?.id}
                    color={cart?.color}
                    qty={Number(cart?.quantity)}
                    price={Number(cart?.price)}
                    size={cart?.size}
                  />
                ))}
              </CartOrderGroup>
            ))}
          </div>

          {/* Cart Summary */}
          <CartSummary total={grandTotal} />
        </div>
      </div>
    </main>
  );
}
