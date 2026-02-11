"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import MinOrderModal from "./MinOrderModal";

export default function ActionButtons({
  isInWishlist,
  productId,
  shippingchargeId,
  sizes,
  color,
}: {
  color: any;
  sizes: any;
  shipping: any;
  shippingchargeId?: string | number;
  isInWishlist: any;
  productId: any;
}) {
  const router = useRouter();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [showMinOrderModal, setShowMinOrderModal] = useState(false);

  const getTotalQuantity = () => {
    if (typeof sizes !== "object" || sizes === null) return 0;
    return Object.entries(sizes).reduce(
      (sum, [, qty]) => sum + Number(qty || 0),
      0
    );
  };

  const buildBuyDetails = () => {
    if (typeof sizes !== "object" || sizes === null || !color?.id) return [];
    return Object.entries(sizes)
      .filter(([, qty]) => Number(qty || 0) > 0)
      .map(([size, quantity]) => ({
        color_id: String(color.id),
        size: String(size),
        quantity: String(quantity),
      }));
  };

  const handleOrder = async (btn: "ord" | "crt") => {
    const user: any = await fetcher("/user-profile");
    if (!user?.data?.id) {
      router.push("/signin");
      return;
    }
    if (btn === "crt") {
      router.push("/cart");
      return;
    }
    // Buy Now
    const totalQuantity = getTotalQuantity();
    if (totalQuantity < 1) {
      setShowMinOrderModal(true);
      return;
    }
    const buyDetails = buildBuyDetails();
    console.log("🚀 ~ handleOrder ~ buyDetails:", buyDetails)

    if (buyDetails.length === 0 || !shippingchargeId) {
      setShowMinOrderModal(true);
      return;
    }
    setIsBuyNowLoading(true);
    try {
      const res: any = await fetcher("/product-buy-now", {
        method: "POST",
        body: JSON.stringify({
          product_id: String(productId),
          shippingcharge_id: String(shippingchargeId),
          total_quantity: String(totalQuantity),
          buy_details: buyDetails,
        }),
      });
      const isSuccess =
        res?.status === true ||
        res?.status === "success" ||
        res?.success === true ||
        (res?.message &&
          String(res.message).toLowerCase().includes("success"));
      if (isSuccess) {
        toast.success(res?.message || "Added to buy successfully");
        router.push("/checkout?buyNow=1");
      } else {
        toast.error(res?.message || "Buy now failed. Try again.");
      }
    } catch (err) {
      toast.error("Buy now failed. Try again.");
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  const handleWishlist = async () => {
    setIsWishlistLoading(true);

    try {
      const user: any = await fetcher("/user-profile");
      if (!user?.data?.id) {
        router.push("/signin");
        return;
      }

      const endpoint = isInWishlist ? "/remove-wishlist" : "/add-to-wishlist";

      const res: any = await fetcher(endpoint, {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          user_id: user?.data?.id,
        }),
      });

      if (res?.status === true) {
        router.refresh();
      } else {
        toast.error("Failed to update wishlist.");
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
            className={cn(isInWishlist ? "text-red-600" : "text-gray-500")}
            fill={isInWishlist ? "#e7000b" : "none"}
          />
        )}
      </Button>

      <Button onClick={() => handleOrder("crt")} size="lg" className="flex-1">
        Add to Cart
      </Button>

      <Button
        disabled={isBuyNowLoading}
        onClick={() => handleOrder("ord")}
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
