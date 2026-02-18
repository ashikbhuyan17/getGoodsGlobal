"use client";

import { useState, useMemo } from "react";
import CartOrderGroup from "@/components/cart/CartOrderGroup";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import { toast } from "sonner";

interface CartPageClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartProducts: any;
}

export default function CartPageClient({ cartProducts }: CartPageClientProps) {
  // Initialize all items as selected by default
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    cartProducts?.data?.forEach((product: { id: string }) => {
      initial[product.id] = true;
    });
    return initial;
  });

  const handleSelectChange = (productId: string, selected: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: selected,
    }));
  };

  // Calculate total only for selected items
  const selectedTotal = useMemo(() => {
    return cartProducts?.data?.reduce((sum: number, product: any) => {
      if (selectedItems[product.id]) {
        const itemTotal = product?.cartdetails?.reduce(
          (itemSum: number, item: { quantity: number; price: number }) => {
            return itemSum + Number(item?.quantity) * Number(item?.price);
          },
          0
        );
        return sum + itemTotal;
      }
      return sum;
    }, 0) || 0;
  }, [cartProducts?.data, selectedItems]);

  // Check if all items are deselected
  const allDeselected = useMemo(() => {
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;
    return selectedCount === 0 && cartProducts?.data?.length > 0;
  }, [selectedItems, cartProducts?.data?.length]);

  const handleCheckoutClick = () => {
    if (allDeselected) {
      toast.error("Please select at least one item from your cart to proceed.");
      return;
    }
    // Navigate to checkout
    window.location.href = "/checkout";
  };

  return (
    <>
      <div className="lg:col-span-2 space-y-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {cartProducts?.data?.map((product: any) => (
          <CartOrderGroup
            key={product?.id}
            orderId={`CRT-${product?.id}`}
            image={`${process.env.NEXT_PUBLIC_IMG_URL}/${product?.image}`}
            title={product?.product_name}
            product={product}
            isSelected={selectedItems[product.id] ?? true}
            onSelectChange={(selected) => handleSelectChange(product.id, selected)}
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
                colorImage={`${process.env.NEXT_PUBLIC_IMG_URL}/${cart?.color_image}`}
              />
            ))}
          </CartOrderGroup>
        ))}
      </div>

      {/* Cart Summary */}
      <CartSummary 
        total={selectedTotal} 
        allDeselected={allDeselected}
        onCheckoutClick={handleCheckoutClick}
      />
    </>
  );
}
