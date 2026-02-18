'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const DEBOUNCE_MS = 1000;

export interface OrderStatusOption {
  id: number;
  name: string;
  slug: string;
  status: string;
}

interface OrdersTopBarProps {
  orderStatuses: OrderStatusOption[];
}

function buildUrl(status: string, keyword: string): string {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (keyword.trim()) params.set('keyword', keyword.trim());
  const qs = params.toString();
  return `/account/orders${qs ? `?${qs}` : ''}`;
}

export default function OrdersTopBar({ orderStatuses }: OrdersTopBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get('status') ?? '';
  const keywordParam = searchParams.get('keyword') ?? '';

  const [keyword, setKeyword] = useState(keywordParam);

  useEffect(() => {
    setKeyword(keywordParam);
  }, [keywordParam]);

  useEffect(() => {
    if (keyword === keywordParam) return;
    const timer = setTimeout(() => {
      router.push(buildUrl(statusParam, keyword));
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [keyword, keywordParam, statusParam, router]);

  const handleStatusSelect = useCallback(
    (value: string) => {
      router.push(buildUrl(value === 'all' ? '' : value, keyword));
    },
    [keyword, router],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push(buildUrl(statusParam, keyword));
    },
    [statusParam, keyword, router],
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
        <h1 className="text-lg font-bold text-black">Orders</h1>
      </div>

      <div className="flex items-center gap-3 max-lg:flex-wrap">
        <Select
          value={statusParam ? String(statusParam) : 'all'}
          onValueChange={handleStatusSelect}
        >
          <SelectTrigger className="w-[300px] h-10 border rounded-lg bg-white text-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">All</SelectItem>
            {orderStatuses.map((opt) => (
              <SelectItem key={opt.id} value={String(opt.id)}>
                {opt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Order ID"
            className="border-y border-r-0 border-l rounded-l-md px-3 py-1 w-[180px] sm:w-[220px]"
          />
          <Button
            type="submit"
            size="default"
            className="rounded-l-none -ml-px"
          >
            Search
          </Button>
        </form>
      </div>
    </div>
  );
}
