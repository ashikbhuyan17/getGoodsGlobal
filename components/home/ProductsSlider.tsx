'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { CarouselCapsuleNav } from '@/components/common/CarouselCapsuleNav';
import ProductCard from '../common/ProductCard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductsSlider({
  title,
  image,
  categorySlug,
  products,
}: {
  title: string;
  image: string;
  categorySlug: string;
  products: any;
}) {
  const productList = Array.isArray(products) ? products : [];
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  if (productList.length === 0) return null;

  const categoryHref = `/category/${categorySlug}`;

  return (
    <section className="w-full min-w-0 max-w-full bg-white px-2 sm:px-4 py-2 pb-4 rounded-sm border-border select-none">
      <div className="mx-1 sm:mx-2 my-4 flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-primary font-bold text-lg">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMG_URL}/${image}`}
            alt={title}
            width={28}
            height={28}
            className="shrink-0"
          />
          <h2 className="truncate">{title}</h2>
        </div>
        {categorySlug ? (
          <Link
            href={categoryHref}
            scroll
            className="shrink-0 text-xs font-medium text-primary underline-offset-2 hover:underline sm:text-sm"
          >
            Shop More
          </Link>
        ) : null}
      </div>

      <div className="group relative w-full min-w-0 max-w-full overflow-hidden">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full max-w-full min-w-0"
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {productList.map((product: any) => (
              <CarouselItem
                key={product?.id}
                className="min-w-0 basis-1/2 pl-2 sm:basis-1/3 sm:pl-3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <div className="min-w-0 w-full [&_a]:block [&_a>*]:w-full [&_a>*]:max-w-full">
                  <ProductCard
                    title={product?.name}
                    slug={product?.slug}
                    image={product?.image?.image}
                    newPrice={product?.new_price}
                    oldPrice={product?.old_price}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {productList.length > 3 && (
          <CarouselCapsuleNav
            api={carouselApi}
            prevLabel={`Previous ${title} products`}
            nextLabel={`Next ${title} products`}
          />
        )}
      </div>
    </section>
  );
}

export default ProductsSlider;
