'use client';

import Link from 'next/link';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface SubcategoryPillItem {
  id: number;
  subcategoryName: string;
  slug: string;
}

interface SubcategoryPillsClientProps {
  categorySlug: string;
  subcategories: SubcategoryPillItem[];
  activeSubcategorySlug?: string | null;
}

const PILL_GAP = 8;
const MORE_BUTTON_MIN_WIDTH = 88;
const MIN_VISIBLE_PILLS = 4;

function normalizeSlug(slug: string) {
  return decodeURIComponent(slug || '');
}

function pillHref(categorySlug: string, subSlug: string) {
  return `/category/${categorySlug}/subcategory/${subSlug}`;
}

function pillClassName(isActive: boolean, className?: string) {
  return cn(
    'inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium',
    'border transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-1',
    isActive
      ? 'border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/15 hover:bg-primary/90'
      : 'border-border/70 bg-background text-foreground/90 shadow-sm hover:border-primary/35 hover:bg-primary/5 hover:text-foreground active:scale-[0.98]',
    className,
  );
}

function moreButtonClassName(hasActiveInOverflow: boolean, className?: string) {
  return cn(
    'group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-1',
    hasActiveInOverflow
      ? 'border-primary/50 bg-primary/10 text-primary shadow-sm hover:bg-primary/15'
      : 'border-border/80 bg-muted/50 text-foreground/85 shadow-sm hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]',
    className,
  );
}

function MoreButtonLabel({ count }: { count: number }) {
  return (
    <>
      <span>More</span>
      <span
        className={cn(
          'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5',
          'bg-primary text-[11px] font-semibold leading-none tabular-nums text-primary-foreground',
        )}
        aria-hidden
      >
        {count}
      </span>
      <ChevronDown className="size-3.5 shrink-0 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </>
  );
}

function SubcategoryPillLink({
  categorySlug,
  sub,
  isActive,
  className,
}: {
  categorySlug: string;
  sub: SubcategoryPillItem;
  isActive: boolean;
  className?: string;
}) {
  return (
    <Link
      href={pillHref(categorySlug, sub.slug)}
      className={pillClassName(isActive, className)}
    >
      {sub.subcategoryName}
    </Link>
  );
}

export function SubcategoryPillsClient({
  categorySlug,
  subcategories,
  activeSubcategorySlug = null,
}: SubcategoryPillsClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const moreMeasureRef = useRef<HTMLButtonElement>(null);

  const activeSlug = activeSubcategorySlug
    ? normalizeSlug(activeSubcategorySlug)
    : '';

  const [visibleCount, setVisibleCount] = useState(subcategories.length);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const available = container.clientWidth;
    const moreWidth =
      moreMeasureRef.current?.offsetWidth ?? MORE_BUTTON_MIN_WIDTH;
    const children = Array.from(measure.children) as HTMLElement[];

    const rowWidth = (pillCount: number, withMore: boolean) => {
      let used = 0;
      for (let i = 0; i < pillCount; i++) {
        const child = children[i];
        if (!child) return Infinity;
        used += child.offsetWidth + (i > 0 ? PILL_GAP : 0);
      }
      if (withMore && pillCount < subcategories.length) {
        used += PILL_GAP + moreWidth;
      }
      return used;
    };

    let count = 0;
    for (let n = 1; n <= subcategories.length; n++) {
      if (rowWidth(n, n < subcategories.length) <= available) {
        count = n;
      }
    }

    if (count === 0 && subcategories.length > 0) {
      count = 1;
    }

    const hasOverflow = count < subcategories.length;
    if (hasOverflow) {
      const minVisible = Math.min(MIN_VISIBLE_PILLS, subcategories.length);
      if (count < minVisible) {
        for (let n = minVisible; n >= 1; n--) {
          if (rowWidth(n, true) <= available) {
            count = n;
            break;
          }
        }
      }
    }

    setVisibleCount((prev) => (prev === count ? prev : count));
  }, [subcategories]);

  useLayoutEffect(() => {
    recalculate();
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => recalculate());
    ro.observe(container);
    return () => ro.disconnect();
  }, [recalculate]);

  const visible = subcategories.slice(0, visibleCount);
  const overflow = subcategories.slice(visibleCount);
  const showMore = overflow.length > 0;
  const overflowHasActive = overflow.some(
    (s) => normalizeSlug(s.slug) === activeSlug,
  );
  const moreBtnClass = moreButtonClassName(overflowHasActive);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-w-0 rounded-xl border border-border/60 bg-muted/30 p-2"
    >
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute flex gap-2"
      >
        {subcategories.map((sub) => {
          const isActive = normalizeSlug(sub.slug) === activeSlug;
          return (
            <SubcategoryPillLink
              key={sub.id}
              categorySlug={categorySlug}
              sub={sub}
              isActive={isActive}
            />
          );
        })}
      </div>

      {subcategories.length > MIN_VISIBLE_PILLS && (
        <button
          ref={moreMeasureRef}
          type="button"
          tabIndex={-1}
          aria-hidden
          className={cn(moreBtnClass, 'pointer-events-none invisible absolute')}
        >
          <MoreButtonLabel
            count={Math.max(1, subcategories.length - MIN_VISIBLE_PILLS)}
          />
        </button>
      )}

      <div className="flex w-full min-w-0 items-center justify-start gap-2 overflow-hidden">
        <div className="relative flex min-w-0 max-w-full shrink items-center gap-2 overflow-hidden">
          {showMore && (
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-linear-to-l from-muted/30 to-transparent"
              aria-hidden
            />
          )}
          {visible.map((sub) => {
            const isActive = normalizeSlug(sub.slug) === activeSlug;
            return (
              <SubcategoryPillLink
                key={sub.id}
                categorySlug={categorySlug}
                sub={sub}
                isActive={isActive}
              />
            );
          })}
        </div>

        {showMore && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={moreBtnClass}
                aria-label={`More, ${overflow.length} more subcategories`}
              >
                <MoreButtonLabel count={overflow.length} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="max-h-72 min-w-48 max-w-[min(100vw-2rem,22rem)] rounded-xl p-1.5 shadow-lg"
            >
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal text-muted-foreground">
                {overflow.length} more{' '}
                {overflow.length === 1 ? 'subcategory' : 'subcategories'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {overflow.map((sub) => {
                const isActive = normalizeSlug(sub.slug) === activeSlug;
                return (
                  <DropdownMenuItem
                    key={sub.id}
                    asChild
                    className="rounded-lg p-0 focus:bg-transparent"
                  >
                    <Link
                      href={pillHref(categorySlug, sub.slug)}
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm transition-colors',
                        isActive
                          ? 'bg-primary/10 font-semibold text-primary'
                          : 'font-medium text-foreground hover:bg-muted',
                      )}
                    >
                      {isActive && (
                        <Check
                          className="size-4 shrink-0 text-primary"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                      )}
                      <span className={cn(!isActive && 'pl-6')}>
                        {sub.subcategoryName}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
