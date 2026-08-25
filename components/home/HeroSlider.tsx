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

type HeroSlide = {
  id?: number;
  image?: string;
  link?: string;
  title?: string;
};

type HeroSlidesResponse = {
  data?:
    | HeroSlide[]
    | {
        mainslider?: HeroSlide[];
        mobileslider?: HeroSlide[];
      };
};

function parseHeroSlides(slides: HeroSlidesResponse | null | undefined) {
  const data = slides?.data;

  if (Array.isArray(data)) {
    return { mainSlides: data, mobileSlides: data };
  }

  const mainSlides = Array.isArray(data?.mainslider) ? data.mainslider : [];
  const mobileSlides = Array.isArray(data?.mobileslider)
    ? data.mobileslider
    : mainSlides;

  return {
    mainSlides,
    mobileSlides: mobileSlides.length ? mobileSlides : mainSlides,
  };
}

function MobileHeroSlider({ slideList }: { slideList: HeroSlide[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  );

  return (
    <section className="group relative w-full overflow-hidden lg:hidden">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={() => plugin.current.stop()}
        opts={{ loop: slideList.length > 1 }}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="ml-0">
          {slideList.map((slide, i) => (
            <CarouselItem key={slide.id ?? i} className="basis-full pl-0">
              <button
                type="button"
                className="m-0 block w-full overflow-hidden border-0 bg-transparent p-0 leading-[0] touch-manipulation cursor-pointer active:scale-100"
                onClick={() => {
                  if (slide?.link && slide.link !== '#') {
                    window.open(slide.link, '_blank');
                  }
                }}
                aria-label={`View slide ${slide?.id ?? i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${process.env.NEXT_PUBLIC_IMG_URL}/${slide?.image}`}
                  alt={slide?.title || `Slide ${slide?.id ?? i + 1}`}
                  className="block h-auto w-full"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
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

function DesktopHeroSlider({ slideList }: { slideList: HeroSlide[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  );

  return (
    <section className="group relative hidden w-full overflow-hidden lg:block">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={() => plugin.current.stop()}
        opts={{ loop: slideList.length > 1 }}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="ml-0">
          {slideList.map((slide, i) => (
            <CarouselItem key={slide.id ?? i} className="basis-full pl-0">
              <button
                type="button"
                className="relative block w-full overflow-hidden border-0 bg-neutral-100 p-0 touch-manipulation cursor-pointer active:scale-100 lg:aspect-auto lg:h-[clamp(300px,calc(100vw*570/1920),570px)] lg:min-h-[300px] lg:max-h-[570px]"
                onClick={() => {
                  if (slide?.link) window.open(slide.link, '_blank');
                }}
                aria-label={`View slide ${slide?.id ?? i + 1}`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMG_URL}/${slide?.image}`}
                  alt={slide?.title || `Slide ${slide?.id ?? i + 1}`}
                  fill
                  priority={i === 0}
                  placeholder="empty"
                  draggable={false}
                  className="object-cover object-center transition-none select-none"
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

export default function HeroSlider({
  slides,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slides: any;
}) {
  const { mainSlides, mobileSlides } = parseHeroSlides(slides);

  if (!mainSlides.length && !mobileSlides.length) return null;

  const mobileList = mobileSlides.length ? mobileSlides : mainSlides;
  const desktopList = mainSlides.length ? mainSlides : mobileSlides;

  return (
    <>
      <MobileHeroSlider slideList={mobileList} />
      <DesktopHeroSlider slideList={desktopList} />
    </>
  );
}
