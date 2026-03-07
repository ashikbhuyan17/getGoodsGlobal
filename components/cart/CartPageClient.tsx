'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import CartOrderGroup from '@/components/cart/CartOrderGroup';
import CartItemRow from '@/components/cart/CartItemRow';
import CartSummary from '@/components/cart/CartSummary';
import { toast } from 'sonner';
import { cartOrderProducts } from '@/lib/fetcher';

interface CartPageClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartProducts: any;
}

export default function CartPageClient({ cartProducts }: CartPageClientProps) {
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

  const handleSelectChange = (productId: string, selected: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: selected,
    }));
  };

  // Calculate total only for selected items
  const selectedTotal = useMemo(() => {
    return (
      cartProducts?.data?.reduce(
        (
          sum: number,
          product: {
            id: string;
            cartdetails?: { quantity: number; price: number }[];
          },
        ) => {
          if (selectedItems[product.id]) {
            const itemTotal = product?.cartdetails?.reduce(
              (itemSum: number, item: { quantity: number; price: number }) => {
                return itemSum + Number(item?.quantity) * Number(item?.price);
              },
              0,
            );
            return sum + (itemTotal ?? 0);
          }
          return sum;
        },
        0,
      ) || 0
    );
  }, [cartProducts?.data, selectedItems]);

  // Check if all items are deselected
  const allDeselected = useMemo(() => {
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;
    return selectedCount === 0 && cartProducts?.data?.length > 0;
  }, [selectedItems, cartProducts?.data?.length]);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const router = useRouter();

  const handleCheckoutClick = async () => {
    if (allDeselected) {
      toast.error('Please select at least one item from your cart to proceed.');
      return;
    }
    const data = (cartProducts?.data ?? []) as { id: string }[];
    const selectedCartIds = data
      .filter((p) => selectedItems[p.id])
      .map((p) => String(p.id));
    if (!selectedCartIds.length) {
      toast.error('Please select at least one item from your cart to proceed.');
      return;
    }
    setCheckoutLoading(true);
    try {
      const result = await cartOrderProducts(selectedCartIds);
      const success =
        result?.status === true ||
        result?.status === 'success' ||
        (result?.message &&
          String(result.message).toLowerCase().includes('success'));
      if (success) {
        router.push(`/checkout?cart_ids=${selectedCartIds.join(',')}`);
      } else {
        toast.error(result?.message || 'Failed to proceed to checkout.');
      }
    } catch {
      toast.error('Failed to proceed to checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

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
        total={selectedTotal}
        allDeselected={allDeselected}
        onCheckoutClick={handleCheckoutClick}
        isCheckoutLoading={checkoutLoading}
        flashSale={cartProducts?.flashSale}
      />
    </>
  );
}
