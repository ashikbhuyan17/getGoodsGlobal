"use client";

import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import MinOrderModal from "./MinOrderModal";
import { useProductStore } from "@/stores/useProductStore";

export default function ActionButtons({
  isInWishlist,
  productId,
}: {
  isInWishlist: boolean;
  productId: string | number;
}) {
  const router = useRouter();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [showMinOrderModal, setShowMinOrderModal] = useState(false);

  const variants = useProductStore((s) => s.variants);
  const totalQuantity = useProductStore((s) => s.totalQuantity)();
  const shippingArea = useProductStore((s) => s.shippingArea);

  const buildDetails = () =>
    variants
      .filter((v) => v.quantity > 0)
      .map((v) => ({
        color_id: String(v.color_id),
        size: String(v.size),
        quantity: String(v.quantity),
      }));

  const handleAddToCart = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await fetcher("/user-profile");
    if (!user?.data?.id) {
      router.push("/signin");
      return;
    }
    if (totalQuantity < 1) {
      setShowMinOrderModal(true);
      return;
    }
    const details = buildDetails();
    if (details.length === 0 || !shippingArea?.id) {
      setShowMinOrderModal(true);
      return;
    }
    setIsCartLoading(true);
    try {
      await fetcher("/product-add-to-cart", {
        method: "POST",
        body: JSON.stringify({
          product_id: String(productId),
          shippingcharge_id: String(shippingArea.id),
          total_quantity: String(totalQuantity),
          cart_details: details,
        }),
      });
      toast.success("Added to cart");
      router.push("/cart");
    } catch {
      toast.error("Failed to add to cart.");
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await fetcher("/user-profile");
    if (!user?.data?.id) {
      router.push("/signin");
      return;
    }
    if (totalQuantity < 1) {
      setShowMinOrderModal(true);
      return;
    }
    const details = buildDetails();
    if (details.length === 0 || !shippingArea?.id) {
      setShowMinOrderModal(true);
      return;
    }
    setIsBuyNowLoading(true);
    try {
      await fetcher("/product-add-to-cart", {
        method: "POST",
        body: JSON.stringify({
          product_id: String(productId),
          shippingcharge_id: String(shippingArea.id),
          total_quantity: String(totalQuantity),
          cart_details: details,
        }),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await fetcher("/product-buy-now", {
        method: "POST",
        body: JSON.stringify({
          product_id: String(productId),
          shippingcharge_id: String(shippingArea.id),
          total_quantity: String(totalQuantity),
          buy_details: details,
        }),
      });
      const ok =
        res?.status === true ||
        res?.status === "success" ||
        res?.success === true ||
        (res?.message &&
          String(res.message).toLowerCase().includes("success"));
      if (ok) {
        toast.success(res?.message || "Added to buy successfully");
        router.push("/checkout?buyNow=1");
      } else {
        toast.error(res?.message || "Buy now failed. Try again.");
      }
    } catch {
      toast.error("Buy now failed. Try again.");
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  const handleWishlist = async () => {
    setIsWishlistLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: any = await fetcher("/user-profile");
      if (!user?.data?.id) {
        router.push("/signin");
        return;
      }
      const endpoint = isInWishlist ? "/remove-wishlist" : "/add-to-wishlist";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await fetcher(endpoint, {
        method: "POST",
        body: JSON.stringify({ product_id: productId, user_id: user.data.id }),
      });
      if (res?.status === true) router.refresh();
      else toast.error("Failed to update wishlist.");
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
            className={cn(isInWishlist ? "text-red-600" : "text-gray-500")}
            fill={isInWishlist ? "#e7000b" : "none"}
          />
        )}
      </Button>

      <Button
        disabled={isCartLoading}
        onClick={handleAddToCart}
        size="lg"
        className="flex-1"
      >
        {isCartLoading ? (
          <Loader2 className="animate-spin size-5" />
        ) : (
          "Add to Cart"
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
          "Buy Now"
        )}
      </Button>

      <MinOrderModal
        open={showMinOrderModal}
        onClose={() => setShowMinOrderModal(false)}
      />
    </div>
  );
}
