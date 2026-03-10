"use client";
import CartOrderGroup from "@/components/cart/CartOrderGroup";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import OrderForm from "@/components/checkout/OrderForm";
import ShippingMethodSection, { type ShippingOption } from "@/components/checkout/ShippingMethodSection";
import { useState, useMemo } from "react";
function CheckoutClient({
  cartProducts,
  user,
  isBuyNow = false,
  shippingOptions = [],
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartProducts: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  isBuyNow?: boolean;
  shippingOptions?: ShippingOption[];
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
  const [selectedShipping, setSelectedShipping] = useState<{
    id: number;
    name: string;
    amount: number;
  } | null>(null);

  // cart-products: cartdetails; buy-products: buydetails (API returns buydetails)
  const normalizedProducts = useMemo(() => {
    const list = cartProducts?.data ?? [];
    return list.map((p: Record<string, unknown>) => ({
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

  const grandTotal = productsWithTotals.reduce(
    (sum: number, product: { totalPrice: number }) => {
      return sum + product.totalPrice;
    },
    0
  );

  const cartIds = isBuyNow ? undefined : productsWithTotals.map((p: { id: string | number }) => Number(p.id));

  return (
    <div className="mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <OrderForm formData={formData} setFormData={setFormData} />
        <ShippingMethodSection
          options={shippingOptions}
          selectedId={selectedShipping?.id ?? null}
          onSelect={(opt) =>
            setSelectedShipping(
              opt
                ? {
                  id: opt.id,
                  name: opt.name,
                  amount: Number(opt.amount) || 0,
                }
                : null
            )
          }
        />
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
      <CartSummary
        formData={formData}
        total={grandTotal}
        flashSale={cartProducts?.flashSale}
        orderConditionHtml={cartProducts?.order_condition}
        shippingCharge={selectedShipping?.amount ?? 0}
        shippingChargeID={selectedShipping?.id}
        requiresShippingSelection={shippingOptions.length > 0}
        page="checkout"
        cartIds={cartIds}
        isBuyNow={isBuyNow}
      />
    </div>
  );
}

export default CheckoutClient;
