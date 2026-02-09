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
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <section className="relative -mt-2 md:-mr-4 max-h-[60vh] h-auto w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full md:rounded-2xl"
        onMouseEnter={() => plugin.current.stop()}
        opts={{ loop: true }}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {slides?.data?.map((slide: any, i: number) => (
            <CarouselItem
              onClick={() => window.open(slide?.link, '_blank')}
              key={i}
            >
              <div className="relative w-full cursor-pointer">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMG_URL}/${slide?.image}`}
                  alt={`Slide ${slide?.id}`}
                  width={1200}
                  height={1200}
                  priority={i === 0}
                  className="object-cover object-center w-full"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
