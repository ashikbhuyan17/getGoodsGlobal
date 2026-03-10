import { fetcher } from '@/lib/fetcher';
import { formatPriceInt } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

async function ProductSuggestions({ slug }: { slug: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: any = await fetcher(`/related-products/${slug}`, {}, 60);
  return (
    <div className="p-4 rounded-sm border bg-white flex flex-col justify-center text-center mx-auto">
      <h1 className="w-full text-xl font-semibold">Suggestions</h1>
      <div className="mt-4 flex flex-col gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {products?.data?.map((product: any) => (
          <Link key={product?.id} href={`/product/${product?.slug}`}>
            <div className="flex items-center gap-2">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMG_URL}/${product?.image?.image}`}
                alt={slug}
                width={1200}
                height={1200}
                className="w-28 h-28 rounded-lg"
              />
              <div className="text-start space-y-1">
                <div className="flex gap-2">
                  <h2 className="text-lg font-semibold text-red-500">
                    ৳{formatPriceInt(product?.new_price ?? 0)}
                  </h2>
                  <h2 className="text-lg font-semibold text-zinc-300 line-through">
                    ৳{formatPriceInt(product?.old_price ?? 0)}
                  </h2>
                </div>
                <h2 className="line-clamp-1">{product?.name}</h2>
                <span className="text-primary text-sm font-semibold">
                  {product?.stock} items in stock
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductSuggestions;
