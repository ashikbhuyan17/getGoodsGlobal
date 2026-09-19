'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import MinOrderModal from './MinOrderModal';
import AddToCartModal from './AddToCartModal';
import { useProductStore } from '@/stores/useProductStore';
import { revalidateClient } from '@/action/revalidateClient';
import { useNavCountsStore } from '@/hooks/useNavCounts';
import { ensureLoggedIn } from '@/lib/ensureLoggedIn';
import { openSignInModal } from '@/lib/openSignIn';

export default function ActionButtons({ productId }: { productId: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [showMinOrderModal, setShowMinOrderModal] = useState(false);
  const [minOrderMessage, setMinOrderMessage] = useState<string>('');
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const variants = useProductStore((s) => s.variants);
  const totalQuantity = useProductStore((s) => s.totalQuantity());
  const shippingArea = useProductStore((s) => s.shippingArea);
  const shippingOptions = useProductStore((s) => s.shippingOptions);
  const isLoggedIn = useNavCountsStore((s) => s.isLoggedIn);

  useEffect(() => {
    let cancelled = false;

    async function loadWishlistState() {
      if (!isLoggedIn) return;
      try {
        const res: any = await fetcher('/wishlists');
        const found = res?.data?.find(
          (item: { product?: { id?: number } }) =>
            item?.product?.id === Number(productId),
        );
        if (!cancelled) setIsInWishlist(Boolean(found));
      } catch {
        if (!cancelled) setIsInWishlist(false);
      }
    }

    if (productId && isLoggedIn) loadWishlistState();

    return () => {
      cancelled = true;
    };
  }, [productId, isLoggedIn]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const buildCartDetails = () =>
    variants
      .filter((v) => v.quantity > 0)
      .map((v) => ({
        color_id: String(v.color_id),
        size: String(v.size),
        quantity: String(v.quantity),
      }));

  const validateOrderDetails = () => {
    const cartDetails = buildCartDetails();
    if (totalQuantity < 1 || cartDetails.length === 0) {
      setMinOrderMessage('সর্বনিম্ন 1 টি পণ্য অর্ডার করতে হবে');
      setShowMinOrderModal(true);
      return null;
    }
    const hasShippingOptions = shippingOptions?.length > 0;
    if (hasShippingOptions && !shippingArea?.id) {
      setMinOrderMessage('দয়া করে শিপিং মেথড সিলেক্ট করুন');
      setShowMinOrderModal(true);
      return null;
    }
    return cartDetails;
  };

  const handleAddToCart = async () => {
    const cartDetails = validateOrderDetails();
    if (!cartDetails) return;

    if (!(await ensureLoggedIn(router, pathname || '/'))) return;
    setIsAddToCartLoading(true);
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
        void useNavCountsStore.getState().refresh();
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
    if (isBuyNowLoading) return;

    const checkoutPath = '/checkout?buyNow=1';
    const cartDetails = validateOrderDetails();
    if (!cartDetails) return;

    if (!(await ensureLoggedIn(router, checkoutPath))) return;

    setIsBuyNowLoading(true);
    try {
      const res: any = await fetcher('/product-buy-now', {
        method: 'POST',
        body: JSON.stringify({
          product_id: String(productId),
          shippingcharge_id: 1,
          // shippingfee: Number(shippingArea?.amount ?? 0),
          total_quantity: String(totalQuantity),
          buy_details: cartDetails,
        }),
      });

      const isSuccess =
        res?.status === true ||
        res?.status === 'success' ||
        res?.success === true ||
        (res?.message &&
          String(res.message).toLowerCase().includes('success'));

      if (isSuccess) {
        toast.success(res?.message || 'Proceeding to checkout');
        window.location.assign(checkoutPath);
        return;
      }

      const needsLogin =
        res?.message &&
        /unauth|login|token/i.test(String(res.message));
      if (needsLogin) {
        openSignInModal(router, checkoutPath);
        return;
      }

      toast.error(res?.message || 'Buy now failed. Try again.');
    } catch {
      toast.error('Buy now failed. Try again.');
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  const handleWishlist = async () => {
    setIsWishlistLoading(true);
    try {
      if (!(await ensureLoggedIn(router, pathname || '/'))) return;

      const user: any = await fetcher('/user-profile');
      const userId = user?.data?.id;
      if (!userId) {
        openSignInModal(router, pathname || '/');
        return;
      }

      const endpoint = isInWishlist ? '/remove-wishlist' : '/add-to-wishlist';
      const res: any = await fetcher(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          user_id: userId,
        }),
      });

      if (res?.status === true) {
        const adding = !isInWishlist;
        setIsInWishlist(adding);
        useNavCountsStore.getState().bumpWishlist(adding ? 1 : -1);
      } else {
        toast.error('Failed to update wishlist.');
      }
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const renderWishIcon = (size = 20) =>
    isWishlistLoading ? (
      <Loader2 className="size-4 animate-spin" />
    ) : (
      <Heart
        size={size}
        strokeWidth={2}
        className={cn(isInWishlist ? 'text-red-600' : 'text-neutral-500')}
        fill={isInWishlist ? 'currentColor' : 'none'}
      />
    );

  return (
    <>
      {/* Large screens: same sizing as before (default Button lg; no extra h/min-w) */}
      <div className="mt-4 hidden flex-wrap gap-2 lg:flex">
        <Button
          disabled={isWishlistLoading}
          onClick={handleWishlist}
          variant="outline"
          size="lg"
          className="p-0 w-12"
        >
          {renderWishIcon()}
        </Button>

        <Button
          disabled={isAddToCartLoading}
          onClick={handleAddToCart}
          size="lg"
          className="flex-1"
        >
          {isAddToCartLoading ? (
            <Loader2 className="size-5 animate-spin" />
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
            <Loader2 className="size-5 animate-spin" />
          ) : (
            'Buy Now'
          )}
        </Button>
      </div>

      {/* Small screens: compact CTA pinned to the viewport (portaled so page overflow cannot clip it) */}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] w-full lg:hidden">
            <div
              className="pointer-events-auto border-t border-neutral-200/80 bg-white shadow-[0_-6px_20px_rgba(15,23,42,0.06)]"
              style={{
                paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom, 0px))',
              }}
            >
              <div className="mx-auto flex w-full max-w-3xl items-center gap-1.5 px-2.5 py-1.5">
                <Button
                  disabled={isWishlistLoading}
                  onClick={handleWishlist}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 shrink-0 rounded-lg border-neutral-200 p-0"
                  aria-label={
                    isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                  }
                >
                  {renderWishIcon(18)}
                </Button>

                <Button
                  disabled={isAddToCartLoading}
                  onClick={handleAddToCart}
                  size="sm"
                  className="h-9 min-w-0 flex-1 rounded-lg text-[13px] font-medium"
                >
                  {isAddToCartLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Add to Cart'
                  )}
                </Button>

                <Button
                  disabled={isBuyNowLoading}
                  onClick={handleBuyNow}
                  size="sm"
                  className="h-9 min-w-0 flex-1 rounded-lg bg-[#279ACE] text-[13px] font-medium hover:bg-[#1b8cbf]"
                >
                  {isBuyNowLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Buy Now'
                  )}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <MinOrderModal
        open={showMinOrderModal}
        onClose={() => setShowMinOrderModal(false)}
        message={minOrderMessage}
      />

      <AddToCartModal
        open={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
      />
    </>
  );
}
