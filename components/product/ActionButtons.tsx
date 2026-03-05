'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import MinOrderModal from './MinOrderModal';
import AddToCartModal from './AddToCartModal';
import { useProductStore } from '@/stores/useProductStore';
import { revalidateClient } from '@/action/revalidateClient';

export default function ActionButtons({
  isInWishlist,
  productId,
}: {
  isInWishlist: any;
  productId: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [showMinOrderModal, setShowMinOrderModal] = useState(false);
  const [minOrderMessage, setMinOrderMessage] = useState<string>('');
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const variants = useProductStore((s) => s.variants);
  const totalQuantity = useProductStore((s) => s.totalQuantity());
  const shippingArea = useProductStore((s) => s.shippingArea);
  const shippingOptions = useProductStore((s) => s.shippingOptions);

  const buildCartDetails = () =>
    variants
      .filter((v) => v.quantity > 0)
      .map((v) => ({
        color_id: String(v.color_id),
        size: String(v.size),
        quantity: String(v.quantity),
      }));

  const checkAuthAndValidate = async () => {
    const user: any = await fetcher('/user-profile');
    if (!user?.data?.id) {
      router.push(`/signin?redirect=${encodeURIComponent(pathname || '/')}`);
      return false;
    }
    const cartDetails = buildCartDetails();
    if (totalQuantity < 1 || cartDetails.length === 0) {
      setMinOrderMessage('সর্বনিম্ন 1 টি পণ্য অর্ডার করতে হবে');
      setShowMinOrderModal(true);
      return false;
    }
    const hasShippingOptions = shippingOptions?.length > 0;
    if (hasShippingOptions && !shippingArea?.id) {
      setMinOrderMessage('দয়া করে শিপিং মেথড সিলেক্ট করুন');
      setShowMinOrderModal(true);
      return false;
    }
    return { user, cartDetails };
  };

  const handleAddToCart = async () => {
    const validated = await checkAuthAndValidate();
    if (!validated) return;

    const { cartDetails } = validated;
    setIsAddToCartLoading(true);
    console.log({
      product_id: String(productId),
      shippingcharge_id: shippingArea?.id,
      shippingfee: Number(shippingArea?.amount ?? 0),
      total_quantity: String(totalQuantity),
      cart_details: cartDetails,
    });
    try {
      const res: any = await fetcher('/product-add-to-cart', {
        method: 'POST',
        body: JSON.stringify({
          product_id: String(productId),
          shippingcharge_id: 1,
          // shippingfee: Number(shippingArea?.amount ?? 0),
          total_quantity: String(totalQuantity),
          cart_details: cartDetails,
        }),
      });
      const isSuccess =
        res?.status === true ||
        res?.status === 'success' ||
        res?.success === true ||
        (res?.message && String(res.message).toLowerCase().includes('success'));

      if (isSuccess) {
        await revalidateClient('/cart');
        setShowAddToCartModal(true);
      } else {
        toast.error(res?.message || 'Failed to add to cart.');
      }
    } catch {
      toast.error('Failed to add to cart.');
    } finally {
      setIsAddToCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    const validated = await checkAuthAndValidate();
    if (!validated) return;

    const { cartDetails } = validated;
    setIsBuyNowLoading(true);
    try {
      const addRes: any = await fetcher('/product-add-to-cart', {
        method: 'POST',
        body: JSON.stringify({
          product_id: String(productId),
          shippingcharge_id: 1,
          // shippingcharge_id: shippingArea?.id,
          // shippingfee: Number(shippingArea?.amount ?? 0),
          total_quantity: String(totalQuantity),
          cart_details: cartDetails,
        }),
      });
      const addSuccess =
        addRes?.status === true ||
        addRes?.status === 'success' ||
        addRes?.success === true ||
        (addRes?.message &&
          String(addRes.message).toLowerCase().includes('success'));

      if (!addSuccess) {
        toast.error(addRes?.message || 'Failed to add to cart.');
        return;
      }

      const buyRes: any = await fetcher('/product-buy-now', {
        method: 'POST',
        body: JSON.stringify({
          product_id: String(productId),
          shippingcharge_id: String(shippingArea?.id),
          shippingfee: Number(shippingArea?.amount ?? 0),
          total_quantity: String(totalQuantity),
          buy_details: cartDetails,
        }),
      });
      const buySuccess =
        buyRes?.status === true ||
        buyRes?.status === 'success' ||
        buyRes?.success === true ||
        (buyRes?.message &&
          String(buyRes.message).toLowerCase().includes('success'));

      if (buySuccess) {
        toast.success(buyRes?.message || 'Proceeding to checkout');
        window.location.href = '/checkout?buyNow=1';
      } else {
        toast.error(buyRes?.message || 'Buy now failed. Try again.');
      }
    } catch {
      toast.error('Buy now failed. Try again.');
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  const handleWishlist = async () => {
    setIsWishlistLoading(true);
    try {
      const user: any = await fetcher('/user-profile');
      if (!user?.data?.id) {
        router.push(`/signin?redirect=${encodeURIComponent(pathname || '/')}`);
        return;
      }

      const endpoint = isInWishlist ? '/remove-wishlist' : '/add-to-wishlist';
      const res: any = await fetcher(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          user_id: user?.data?.id,
        }),
      });

      if (res?.status === true) {
        router.refresh();
      } else {
        toast.error('Failed to update wishlist.');
      }
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        disabled={isWishlistLoading}
        onClick={handleWishlist}
        variant="outline"
        size="lg"
        className="p-0 w-12"
      >
        {isWishlistLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Heart
            size={22}
            className={cn(isInWishlist ? 'text-red-600' : 'text-gray-500')}
            fill={isInWishlist ? '#e7000b' : 'none'}
          />
        )}
      </Button>

      <Button
        disabled={isAddToCartLoading}
        onClick={handleAddToCart}
        size="lg"
        className="flex-1"
      >
        {isAddToCartLoading ? (
          <Loader2 className="animate-spin size-5" />
        ) : (
          'Add to Cart'
        )}
      </Button>

      <Button
        disabled={isBuyNowLoading}
        onClick={handleBuyNow}
        size="lg"
        className="flex-1 bg-[#279ACE] hover:bg-[#1b8cbf]"
      >
        {isBuyNowLoading ? (
          <Loader2 className="animate-spin size-5" />
        ) : (
          'Buy Now'
        )}
      </Button>

      <MinOrderModal
        open={showMinOrderModal}
        onClose={() => setShowMinOrderModal(false)}
        message={minOrderMessage}
      />

      <AddToCartModal
        open={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
      />
    </div>
  );
}
