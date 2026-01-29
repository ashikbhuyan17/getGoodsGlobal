import { Star } from "lucide-react";
import InfoBarBack from "../common/InfoBarBack";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";

export default async function ProductInfoBar({ slug }: { slug: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product: any = await fetcher(`/product-details/${slug}`);

  const stock = product?.data?.product?.stock;

  return (
    <div className="flex items-center justify-between border rounded-xl p-3 bg-white shadow-sm w-full">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <InfoBarBack />
        <div>
          <h2 className="text-sm font-medium text-black">
            {product?.data?.product?.name}
          </h2>

          <div className="flex items-center gap-3 mt-1">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded",
                stock === 0
                  ? "bg-red-50 text-red-600"
                  : stock < 10
                  ? "bg-yellow-50 text-yellow-600"
                  : "bg-green-50 text-green-600"
              )}
            >
              {product?.data?.product?.stock} items in stock
            </span>

            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400" />
              ))}
            </div>

            <span className="text-sm font-semibold text-black">5/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
