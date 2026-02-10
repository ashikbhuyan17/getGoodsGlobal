'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type FilterType =
  | 'processing'
  | 'on-delivery'
  | 'delivered'
  | 'cancelled'
  | 'all';

interface DeliveryTopBarProps {
  onFilterChange?: (filter: FilterType) => void;
  onSearch?: (orderId: string) => void;
}

export default function DeliveryTopBar({
  onFilterChange,
  onSearch,
}: DeliveryTopBarProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('processing');
  const [searchValue, setSearchValue] = useState('');

  const filters: { key: FilterType; label: string }[] = [
    { key: 'processing', label: 'Processing' },
    { key: 'on-delivery', label: 'On Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'all', label: 'All Invoices' },
  ];

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const handleSearch = () => {
    onSearch?.(searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white border-b shadow-sm p-3 flex items-center justify-between gap-4 flex-wrap">
      {/* Left Section - Back Button + Title */}
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

      {/* Middle Section - Filter Tabs */}
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
        <div className="flex">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Order ID"
            className="border-y border-r-0 border-l rounded-md px-3 py-1 w-[300px]"
          />
          <Button
            onClick={handleSearch}
            size="default"
            className="bg-primary hover:bg-primary/95 ml-[-10px]"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
