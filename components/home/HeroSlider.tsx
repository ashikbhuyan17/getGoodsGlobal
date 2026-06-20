'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { CarouselCapsuleNav } from '@/components/common/CarouselCapsuleNav';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroSlider({ slides }: { slides: any }) {
  const slideList = Array.isArray(slides?.data) ? slides.data : [];
  const [api, setApi] = React.useState<CarouselApi>();
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  );

  if (!slideList.length) return null;

  return (
    <section className="group relative w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={() => plugin.current.stop()}
        opts={{ loop: true }}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="ml-0">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {slideList.map((slide: any, i: number) => (
            <CarouselItem key={i} className="basis-full pl-0">
              <button
                type="button"
                className="relative block w-full cursor-pointer border-0 bg-transparent p-0"
                onClick={() => {
                  if (slide?.link) window.open(slide.link, '_blank');
                }}
                aria-label={`View slide ${slide?.id ?? i + 1}`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMG_URL}/${slide?.image}`}
                  alt={`Slide ${slide?.id ?? i + 1}`}
                  width={1920}
                  height={600}
                  priority={i === 0}
                  className="block h-auto w-full object-contain object-center"
                  sizes="100vw"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {slideList.length > 1 && (
        <CarouselCapsuleNav
          api={api}
          prevLabel="Previous slide"
          nextLabel="Next slide"
        />
      )}
    </section>
  );
}
