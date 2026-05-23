'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const navBtnClass =
  'absolute top-1/2 z-30 flex h-7 w-9 items-center justify-center rounded-full border-0 bg-white/80 text-gray-700 shadow-md backdrop-blur-[2px] transition-[opacity,background-color] duration-200 hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 pointer-events-none group-hover:pointer-events-auto max-md:pointer-events-auto [&_svg]:size-3.5';

type CarouselCapsuleNavProps = {
  api: CarouselApi | undefined;
  prevLabel?: string;
  nextLabel?: string;
};

export function CarouselCapsuleNav({
  api,
  prevLabel = 'Previous',
  nextLabel = 'Next',
}: CarouselCapsuleNavProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-20 overflow-hidden',
        'opacity-0 transition-opacity duration-200',
        'group-hover:opacity-100',
        'max-md:opacity-100',
      )}
    >
      <button
        type="button"
        aria-label={prevLabel}
        onClick={(e) => {
          e.stopPropagation();
          api?.scrollPrev();
        }}
        className={cn(navBtnClass, 'left-0 transform-[translate(-30%,-50%)]')}
      >
        <ChevronLeft strokeWidth={2.5} />
      </button>
      <button
        type="button"
        aria-label={nextLabel}
        onClick={(e) => {
          e.stopPropagation();
          api?.scrollNext();
        }}
        className={cn(navBtnClass, 'right-0 transform-[translate(30%,-50%)]')}
      >
        <ChevronRight strokeWidth={2.5} />
      </button>
    </div>
  );
}
