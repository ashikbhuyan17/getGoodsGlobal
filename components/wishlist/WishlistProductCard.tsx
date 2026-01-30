"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WishlistProductCardProps {
  id: number;
  productId: number;
  slug: string;
  image: string;
  title: string;
  newPrice: number;
  oldPrice?: number;
}

export default function WishlistProductCard({
  id,
  productId,
  slug,
  image,
  title,
  newPrice,
  oldPrice,
}: WishlistProductCardProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsRemoving(true);

    try {
      const user: any = await fetcher("/user-profile");
      if (!user?.data?.id) {
        router.push("/signin");
        return;
      }

      const res: any = await fetcher("/remove-wishlist", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          user_id: user?.data?.id,
        }),
      });

      if (res?.status === true) {
        setIsRemoved(true);
        toast.success("Removed from wishlist");
        router.refresh();
      } else {
        toast.error("Failed to remove from wishlist");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsRemoving(false);
    }
  };

  if (isRemoved) {
    return null;
  }

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
      <CardContent className="p-0">
        {/* Image Section */}
        <Link href={`/product/${slug}`} prefetch className="block">
          <div className="relative aspect-square bg-gray-50 w-full overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${image}`}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Remove Button - Top Right */}
            <div className="absolute top-2 right-2 z-10">
              <Button
                onClick={handleRemove}
                disabled={isRemoving}
                size="icon"
                variant="secondary"
                className={cn(
                  "h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all",
                  "opacity-0 group-hover:opacity-100",
                  isRemoving && "opacity-100"
                )}
              >
                {isRemoving ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                ) : (
                  <Heart className="h-4 w-4 text-red-600 fill-red-600" />
                )}
              </Button>
            </div>
          </div>
        </Link>

        {/* Info Section */}
        <div className="p-3 space-y-2">
          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#ff0050] font-bold text-base">
              ৳{newPrice}
            </span>
            {oldPrice && oldPrice > newPrice && (
              <span className="text-gray-400 font-medium text-sm line-through">
                ৳{oldPrice}
              </span>
            )}
          </div>
          
          {/* Title */}
          <Link href={`/product/${slug}`} prefetch>
            <h3 className="text-sm text-gray-700 font-medium leading-tight line-clamp-2 hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
