"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export default function ActionButtons({
  isInWishlist,
  productId,
}: {
  color: any;
  sizes: any;
  shipping: any;
  isInWishlist: any;
  productId: any;
}) {
  const router = useRouter();

  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const handleOrder = async (btn: "ord" | "crt") => {
    const user: any = await fetcher("/user-profile");
    if (!user?.data?.id) {
      router.push("/signin");
      return;
    }
    router.push(btn === "crt" ? "/cart" : "/checkout");
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
        onClick={() => handleOrder("ord")}
        size="lg"
        className="flex-1 bg-[#279ACE] hover:bg-[#1b8cbf]"
      >
        Buy Now
      </Button>
    </div>
  );
}
