'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type StatusType =
  | 'all'
  | 'cancelled'
  | 'pending-payment'
  | 'pending-sea-order-confirmation'
  | 'confirmed-sea-order-ready-to-payment'
  | 'waiting-for-agent-feedback'
  | 'partially-paid'
  | 'urgent-purchase';

interface OrdersTopBarProps {
  onFilterChange?: (status: StatusType) => void;
  onSearch?: (orderId: string) => void;
}

const statusOptions: { key: StatusType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'pending-payment', label: 'Pending Payment' },
  {
    key: 'pending-sea-order-confirmation',
    label: 'Pending Sea Order Confirmation',
  },
  {
    key: 'confirmed-sea-order-ready-to-payment',
    label: 'Confirmed Sea Order - Ready to Payment',
  },
  { key: 'waiting-for-agent-feedback', label: 'Waiting for Agent Feedback' },
  { key: 'partially-paid', label: 'Partially Paid' },
  { key: 'urgent-purchase', label: 'Urgent Purchase' },
];

export default function OrdersTopBar({
  onFilterChange,
  onSearch,
}: OrdersTopBarProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    onFilterChange?.(value as StatusType);
  };

  // Show placeholder when empty, otherwise show selected value
  const displayValue = selectedStatus === '' ? undefined : selectedStatus;

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
        <h1 className="text-lg font-bold text-black">Orders</h1>
      </div>

      {/* Right Section - Filter by Status + Order ID Search */}
      <div className="flex items-center gap-3">
        {/* Filter by Status Dropdown */}
        <Select
          value={selectedStatus || undefined}
          onValueChange={handleStatusSelect}
        >
          <SelectTrigger className="w-[300px] h-10 border rounded-lg bg-white text-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {statusOptions.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Order ID Search */}
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
