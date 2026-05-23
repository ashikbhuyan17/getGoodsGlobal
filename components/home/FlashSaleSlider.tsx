'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { CarouselCapsuleNav } from '@/components/common/CarouselCapsuleNav';
import ProductCard from '@/components/common/ProductCard';

export type FlashSaleProduct = {
  id: number;
  name: string;
  slug: string;
  new_price: string | number;
  old_price?: string | number;
  image?: { image?: string };
  PostImage?: string;
};

export function getFlashProductImage(product: FlashSaleProduct): string {
  if (product?.image?.image) return product.image.image;
  try {
    const arr = JSON.parse(product?.PostImage ?? '[]');
    const first = arr?.[0];
    return first
      ? `public/images/product/slider/${first}`
      : '/placeholder-product.png';
  } catch {
    return '/placeholder-product.png';
  }
}

export default function FlashSaleSlider({
  products,
}: {
  products: FlashSaleProduct[];
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  if (products.length === 0) return null;

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-sm border border-gray-200 bg-white px-2 py-2 pb-4 sm:px-4 select-none">
      <div className="mb-3 flex min-w-0 items-center justify-between gap-3 px-1 sm:mb-4 sm:px-2">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-gray-900 sm:text-xl">
            Flash Sale
          </h2>
          <p className="text-xs font-medium text-orange-500 sm:text-sm">
            On Sale Now
          </p>
        </div>
        <Link
          href="/flash-sale"
          className="shrink-0 text-xs font-medium text-primary underline-offset-2 hover:underline sm:text-sm"
        >
          Shop More
        </Link>
      </div>

      <div className="group relative w-full min-w-0 max-w-full overflow-hidden">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: 'start',
            loop: false,
            dragFree: true,
          }}
          className="w-full max-w-full min-w-0"
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="min-w-0 basis-[42%] pl-2 sm:basis-[32%] sm:pl-3 md:basis-[24%] lg:basis-[18%] xl:basis-[15%]"
              >
                <div className="min-w-0 w-full [&_a]:block [&_a>*]:w-full [&_a>*]:max-w-full">
                  <ProductCard
                    slug={product.slug}
                    image={getFlashProductImage(product)}
                    title={product.name}
                    newPrice={Number(product.new_price ?? 0)}
                    oldPrice={
                      product.old_price != null
                        ? Number(product.old_price)
                        : undefined
                    }
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {products.length > 2 && (
          <CarouselCapsuleNav
            api={carouselApi}
            prevLabel="Previous flash sale products"
            nextLabel="Next flash sale products"
          />
        )}
      </div>
    </section>
  );
}
