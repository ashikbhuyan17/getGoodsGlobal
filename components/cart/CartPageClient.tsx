'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import CartOrderGroup from '@/components/cart/CartOrderGroup';
import CartItemRow from '@/components/cart/CartItemRow';
import CartSummary from '@/components/cart/CartSummary';
import { toast } from 'sonner';

interface CartPageClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartProducts: any;
}

export default function CartPageClient({ cartProducts }: CartPageClientProps) {
  const router = useRouter();

  // Initialize all items as selected by default
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      cartProducts?.data?.forEach((product: { id: string }) => {
        initial[product.id] = true;
      });
      return initial;
    },
  );

  useEffect(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      cartProducts?.data?.forEach((product: { id: string }) => {
        if (next[product.id] === undefined) next[product.id] = true;
      });
      return next;
    });
  }, [cartProducts?.data]);

  const handleSelectChange = (productId: string, selected: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: selected,
    }));
  };

  // Calculate total and quantity together for selected items
  const selectedSummary = useMemo(() => {
    return (
      cartProducts?.data?.reduce(
        (
          acc: { total: number; quantity: number },
          product: {
            id: string;
            cartdetails?: { quantity: number; price: number }[];
          },
        ) => {
          if (!selectedItems[product.id]) return acc;

          const { itemTotal, itemQty } =
            product?.cartdetails?.reduce(
              (
                itemAcc: { itemTotal: number; itemQty: number },
                item: { quantity: number; price: number },
              ) => ({
                itemTotal:
                  itemAcc.itemTotal + Number(item?.quantity) * Number(item?.price),
                itemQty: itemAcc.itemQty + Number(item?.quantity),
              }),
              { itemTotal: 0, itemQty: 0 },
            ) ?? { itemTotal: 0, itemQty: 0 };

          return {
            total: acc.total + itemTotal,
            quantity: acc.quantity + itemQty,
          };
        },
        { total: 0, quantity: 0 },
      ) ?? { total: 0, quantity: 0 }
    );
  }, [cartProducts?.data, selectedItems]);

  // Check if all items are deselected
  const allDeselected = useMemo(() => {
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;
    return selectedCount === 0 && cartProducts?.data?.length > 0;
  }, [selectedItems, cartProducts?.data?.length]);

  const [removeLoading, setRemoveLoading] = useState(false);

  const selectedCartIds = useMemo(() => {
    const data = (cartProducts?.data ?? []) as { id: string }[];
    return data
      .filter((p) => selectedItems[p.id])
      .map((p) => String(p.id));
  }, [cartProducts?.data, selectedItems]);

  useEffect(() => {
    if (selectedCartIds.length === 0) return;
    router.prefetch(`/checkout?cart_ids=${selectedCartIds.join(',')}`);
  }, [router, selectedCartIds]);

  const handleCheckoutClick = useCallback(() => {
    if (allDeselected) {
      toast.error('Please select at least one item from your cart to proceed.');
      return;
    }
    if (!selectedCartIds.length) {
      toast.error('Please select at least one item from your cart to proceed.');
      return;
    }

    router.push(`/checkout?cart_ids=${selectedCartIds.join(',')}`);
  }, [allDeselected, router, selectedCartIds]);

  return (
    <>
      {removeLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center gap-3 rounded-lg bg-white px-6 py-4 shadow-lg">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="text-sm font-medium text-gray-700">
              Removing from cart...
            </span>
          </div>
        </div>
      )}
      <div className="lg:col-span-2 space-y-3 lg:space-y-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {cartProducts?.data?.map((product: any) => (
          <CartOrderGroup
            key={product?.id}
            orderId={`CRT-${product?.id}`}
            image={`${process.env.NEXT_PUBLIC_IMG_URL}/${product?.image}`}
            title={product?.product_name}
            slug={product?.slug}
            product={product}
            isSelected={selectedItems[product.id] ?? true}
            onSelectChange={(selected) =>
              handleSelectChange(product.id, selected)
            }
            onRemoveLoading={setRemoveLoading}
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
                onRemoveLoading={setRemoveLoading}
              />
            ))}
          </CartOrderGroup>
        ))}
      </div>

      {/* Cart Summary */}
      <CartSummary
        page="cart"
        total={selectedSummary.total}
        totalQuantity={selectedSummary.quantity}
        allDeselected={allDeselected}
        onCheckoutClick={handleCheckoutClick}
        priceSummary={cartProducts?.priceSummary}
      />
    </>
  );
}
