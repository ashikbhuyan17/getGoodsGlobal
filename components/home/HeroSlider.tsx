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
    <section className="group relative w-full overflow-hidden max-sm:h-[220px]">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full max-sm:h-[220px]"
        onMouseEnter={() => plugin.current.stop()}
        opts={{ loop: true }}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="ml-0 max-sm:h-[220px]">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {slideList.map((slide: any, i: number) => (
            <CarouselItem key={i} className="basis-full pl-0 max-sm:h-[220px]">
              <button
                type="button"
                className="relative block h-[220px] min-h-[220px] w-full overflow-hidden border-0 bg-neutral-100 p-0 aspect-auto touch-manipulation cursor-pointer active:scale-100 sm:h-auto sm:min-h-[200px] sm:max-h-none sm:aspect-[1920/670] md:min-h-[240px] md:aspect-[1920/560] lg:aspect-auto lg:h-[clamp(300px,calc(300px+(100vw-1024px)*100/256),400px)] lg:min-h-[300px] lg:max-h-[400px] xl:h-[clamp(400px,calc(400px+(100vw-1280px)*100/256),500px)] xl:min-h-[400px] xl:max-h-[500px] 2xl:h-[500px] 2xl:min-h-[500px] 2xl:max-h-[500px]"
                onClick={() => {
                  if (slide?.link) window.open(slide.link, '_blank');
                }}
                aria-label={`View slide ${slide?.id ?? i + 1}`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMG_URL}/${slide?.image}`}
                  alt={`Slide ${slide?.id ?? i + 1}`}
                  fill
                  priority={i === 0}
                  placeholder="empty"
                  draggable={false}
                  className="object-cover object-center transition-none select-none lg:object-contain lg:object-top xl:object-cover xl:object-center"
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

// 'use client';

// import * as React from 'react';
// import Image from 'next/image';
// import Autoplay from 'embla-carousel-autoplay';
// import {
//   Carousel,
//   type CarouselApi,
//   CarouselContent,
//   CarouselItem,
// } from '@/components/ui/carousel';
// import { CarouselCapsuleNav } from '@/components/common/CarouselCapsuleNav';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export default function HeroSlider({ slides }: { slides: any }) {
//   const slideList = Array.isArray(slides?.data) ? slides.data : [];
//   const [api, setApi] = React.useState<CarouselApi>();
//   const plugin = React.useRef(
//     Autoplay({ delay: 4000, stopOnInteraction: false }),
//   );

//   if (!slideList.length) return null;

//   return (
//     <section className="group relative w-full overflow-hidden">
//       <Carousel
//         setApi={setApi}
//         plugins={[plugin.current]}
//         className="w-full"
//         onMouseEnter={() => plugin.current.stop()}
//         opts={{ loop: true }}
//         onMouseLeave={() => plugin.current.play()}
//       >
//         <CarouselContent className="ml-0">
//           {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
//           {slideList.map((slide: any, i: number) => (
//             <CarouselItem key={i} className="basis-full pl-0">
//               <button
//                 type="button"
//                 className="relative block h-[240px] w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 sm:h-[320px] md:h-[400px] lg:h-auto"
//                 onClick={() => {
//                   if (slide?.link) window.open(slide.link, '_blank');
//                 }}
//                 aria-label={`View slide ${slide?.id ?? i + 1}`}
//               >
//                 <Image
//                   src={`${process.env.NEXT_PUBLIC_IMG_URL}/${slide?.image}`}
//                   alt={`Slide ${slide?.id ?? i + 1}`}
//                   width={1920}
//                   height={600}
//                   priority={i === 0}
//                   className="block h-full w-full object-fill object-center"
//                   sizes="100vw"
//                 />
//               </button>
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//       </Carousel>

//       {slideList.length > 1 && (
//         <CarouselCapsuleNav
//           api={api}
//           prevLabel="Previous slide"
//           nextLabel="Next slide"
//         />
//       )}
//     </section>
//   );
// }

// 'use client';

// import * as React from 'react';
// import Image from 'next/image';
// import Autoplay from 'embla-carousel-autoplay';
// import {
//   Carousel,
//   type CarouselApi,
//   CarouselContent,
//   CarouselItem,
// } from '@/components/ui/carousel';
// import { CarouselCapsuleNav } from '@/components/common/CarouselCapsuleNav';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export default function HeroSlider({ slides }: { slides: any }) {
//   const slideList = Array.isArray(slides?.data) ? slides.data : [];
//   const [api, setApi] = React.useState<CarouselApi>();
//   const plugin = React.useRef(
//     Autoplay({ delay: 4000, stopOnInteraction: false }),
//   );

//   if (!slideList.length) return null;

//   return (
//     <section className="group relative w-full overflow-hidden">
//       <Carousel
//         setApi={setApi}
//         plugins={[plugin.current]}
//         className="w-full"
//         onMouseEnter={() => plugin.current.stop()}
//         opts={{ loop: true }}
//         onMouseLeave={() => plugin.current.play()}
//       >
//         <CarouselContent className="ml-0">
//           {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
//           {slideList.map((slide: any, i: number) => (
//             <CarouselItem key={i} className="basis-full pl-0">
//               <button
//                 type="button"
//                 className="relative block w-full cursor-pointer border-0 bg-transparent p-0"
//                 onClick={() => {
//                   if (slide?.link) window.open(slide.link, '_blank');
//                 }}
//                 aria-label={`View slide ${slide?.id ?? i + 1}`}
//               >
//                 <Image
//                   src={`${process.env.NEXT_PUBLIC_IMG_URL}/${slide?.image}`}
//                   alt={`Slide ${slide?.id ?? i + 1}`}
//                   width={1920}
//                   height={600}
//                   priority={i === 0}
//                   className="block h-auto w-full object-contain object-center"
//                   sizes="100vw"
//                 />
//               </button>
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//       </Carousel>

//       {slideList.length > 1 && (
//         <CarouselCapsuleNav
//           api={api}
//           prevLabel="Previous slide"
//           nextLabel="Next slide"
//         />
//       )}
//     </section>
//   );
// }
