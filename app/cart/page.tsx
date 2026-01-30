import CartOrderGroup from "@/components/cart/CartOrderGroup";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import { fetcher } from "@/lib/fetcher";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function CartPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartProducts: any = await fetcher("/cart-products");
  console.log("🚀 ~ CartPage ~ cartProducts:", cartProducts)

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
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="py-16 flex flex-col items-center justify-center text-center">
          <CardContent className="flex flex-col items-center gap-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            Salary Month{" "}
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Looks like you haven’t added anything yet.
            </p>
            <Button asChild>
              <Link href="/">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-2">
      <div className="mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
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
  );
}
