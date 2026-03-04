'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroSlider({ slides }: { slides: any }) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  );

  return (
    <section className="relative w-full overflow-hidden max-md:mt-2 md:-mt-[7px]">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={() => plugin.current.stop()}
        opts={{ loop: true }}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="-ml-0">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {slides?.data?.map((slide: any, i: number) => (
            <CarouselItem
              onClick={() => window.open(slide?.link, '_blank')}
              key={i}
              className="pl-0"
            >
              <div className="relative w-full aspect-[16/9] md:aspect-[16/6] lg:aspect-[16/5]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMG_URL}/${slide?.image}`}
                  alt={`Slide ${slide?.id}`}
                  fill
                  priority={i === 0}
                  className="object-cover object-center cursor-pointer"
                  sizes="100vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
