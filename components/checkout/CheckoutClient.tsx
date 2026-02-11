"use client";
import CartOrderGroup from "@/components/cart/CartOrderGroup";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import OrderForm from "@/components/checkout/OrderForm";
import { useState, useMemo } from "react";
function CheckoutClient({
  cartProducts,
  user,
  isBuyNow = false,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartProducts: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  isBuyNow?: boolean;
}) {
  const [formData, setFormData] = useState({
    name: user?.data?.name,
    phone: user?.data?.phone,
    address: user?.data?.address ?? "",
    district: user?.data?.district ?? "",
    city: user?.data?.city ?? "",
    customer_id: user?.data?.id,
    payment_method: "Cash On Delivery",
  });

  // cart-products: cartdetails; buy-products: buydetails (API returns buydetails)
  const normalizedProducts = useMemo(() => {
    const list = cartProducts?.data ?? [];
    return list.map((p: any) => ({
      ...p,
      cartdetails: p?.cartdetails ?? p?.buydetails ?? p?.buy_details ?? [],
    }));
  }, [cartProducts?.data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productsWithTotals = normalizedProducts?.map((product: any) => {
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
  }) ?? [];
  console.log("🚀 ~ CheckoutClient ~ productsWithTotals:", productsWithTotals)

  const grandTotal = productsWithTotals.reduce(
    (sum: number, product: { totalPrice: number }) => {
      return sum + product.totalPrice;
    },
    0
  );

  return (
    <div className="mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <OrderForm formData={formData} setFormData={setFormData} />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {productsWithTotals?.map((product: any) => (
          <CartOrderGroup
            page="checkout"
            key={product?.id}
            orderId={`CRT-${product?.id}`}
            image={`${process.env.NEXT_PUBLIC_IMG_URL}/${product?.image}`}
            title={product?.product_name}
            product={product}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {product?.cartdetails?.map((cart: any) => (
              <CartItemRow
                id={cart?.id}
                page="checkout"
                key={cart?.id}
                color={cart?.color ?? product?.color ?? ""}
                qty={Number(cart?.quantity)}
                price={Number(cart?.price)}
                size={cart?.size}
                colorImage={`${process.env.NEXT_PUBLIC_IMG_URL}/${cart?.color_image}`}
              />
            ))}
          </CartOrderGroup>
        ))}
      </div>

      {/* Cart Summary */}
      <CartSummary formData={formData} total={grandTotal} page="checkout" />
    </div>
  );
}

export default CheckoutClient;
