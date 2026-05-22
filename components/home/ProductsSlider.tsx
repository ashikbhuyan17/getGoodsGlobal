'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from '../common/ProductCard';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductsSlider({
  title,
  image,
  products,
}: {
  title: string;
  image: string;
  products: any;
}) {
  const productList = Array.isArray(products) ? products : [];

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden bg-white px-2 sm:px-4 py-2 pb-4 rounded-sm border-border select-none">
      <div className="flex min-w-0 items-center gap-2 text-primary font-bold text-lg mx-1 sm:mx-2 my-4">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMG_URL}/${image}`}
          alt={title}
          width={28}
          height={28}
          className="shrink-0"
        />
        <h2 className="truncate">{title}</h2>
      </div>

      <div className="relative w-full min-w-0 max-w-full overflow-hidden">
        <Carousel
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

          {productList.length > 5 && (
            <>
              <CarouselPrevious
                variant="default"
                className="left-1! -translate-y-1/2! top-1/2 z-20 size-9 rounded-full border-0 shadow-md"
              />
              <CarouselNext
                variant="default"
                className="right-1! left-auto! -translate-y-1/2! top-1/2 z-20 size-9 rounded-full border-0 shadow-md"
              />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}

export default ProductsSlider;
