import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function ProductCard({
  slug,
  image,
  title,
  newPrice,
  oldPrice,
}: {
  slug: string;
  image: string;
  title: string;
  newPrice: number;
  oldPrice?: number;
}) {
  return (
    <Link href={`/product/${slug}`} prefetch>
      <Card className="max-w-72 p-0 rounded-xl overflow-hidden shadow-none hover:shadow-md transition-all border border-gray-200">
        <CardContent className="p-0">
          {/* Image Section */}
          <div className="relative aspect-square bg-gray-50 w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${image}`}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              className="object-cover"
            />
          </div>

          {/* Info Section */}
          <div className="mt-1 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#ff0050] font-bold text-lg">
                ৳{newPrice}
              </span>
              {oldPrice && (
                <span className="text-[#80807B] font-bold text-sm line-through">
                  ৳{oldPrice}
                </span>
              )}
            </div>
            <div>
              <div className="text-[13px] text-[#80807B] font-medium leading-tight line-clamp-1">
                {title}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
