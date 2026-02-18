'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const DEBOUNCE_MS = 1000;

const STATUS_MAP: Record<string, string> = {
  processing: '4',
  'on-delivery': '3',
  delivered: '2',
  cancelled: '1',
};

type FilterType =
  | 'processing'
  | 'on-delivery'
  | 'delivered'
  | 'cancelled'
  | 'all';

export default function DeliveryTopBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get('status') ?? '';
  const keywordParam = searchParams.get('keyword') ?? '';

  const activeFilter: FilterType =
    statusParam === '4'
      ? 'processing'
      : statusParam === '3'
        ? 'on-delivery'
        : statusParam === '2'
          ? 'delivered'
          : statusParam === '1'
            ? 'cancelled'
            : 'all';

  const buildUrl = useCallback(
    (filter: FilterType, kw: string) => {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', STATUS_MAP[filter] ?? '');
      if (kw.trim()) params.set('keyword', kw.trim());
      const qs = params.toString();
      return `/account/delivery${qs ? `?${qs}` : ''}`;
    },
    [],
  );

  const [keyword, setKeyword] = useState(keywordParam);

  useEffect(() => {
    setKeyword(keywordParam);
  }, [keywordParam]);

  useEffect(() => {
    if (keyword === keywordParam) return;
    const timer = setTimeout(() => {
      router.push(buildUrl(activeFilter, keyword));
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [keyword, keywordParam, activeFilter, buildUrl, router]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'processing', label: 'Processing' },
    { key: 'on-delivery', label: 'On Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'all', label: 'All' },
  ];

  const handleFilterClick = (filter: FilterType) => {
    router.push(buildUrl(filter, keyword));
  };

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push(buildUrl(activeFilter, keyword));
    },
    [activeFilter, keyword, buildUrl, router],
  );

  return (
    <div className="bg-white border-b shadow-sm p-3 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="icon"
          className="rounded-lg w-9 h-9 bg-gray-100 hover:bg-gray-200 border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-lg font-bold text-black">Delivery</h1>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => handleFilterClick(filter.key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeFilter === filter.key
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            )}
          >
            {filter.label}
          </button>
        ))}
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            name="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Order ID"
            className="border-y border-r-0 border-l rounded-l-md px-3 py-1 w-[180px] sm:w-[220px]"
          />
          <Button type="submit" size="default" className="rounded-l-none">
            Search
          </Button>
        </form>
      </div>
    </div>
  );
}
