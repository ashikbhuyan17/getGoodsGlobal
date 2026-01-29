"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

const PRICE_RANGES: PriceRange[] = [
  { id: "range-1", label: "৳0 - ৳500", min: 0, max: 500 },
  { id: "range-2", label: "৳500 - ৳1000", min: 500, max: 1000 },
  { id: "range-3", label: "৳1000 - ৳1500", min: 1000, max: 1500 },
  { id: "range-4", label: "৳1500 - ৳2000", min: 1500, max: 2000 },
  { id: "range-5", label: "৳2000 - ৳5000", min: 2000, max: 5000 },
  { id: "range-6", label: "৳5000 - ৳10000", min: 5000, max: 10000 },
];

interface FilterSidebarSheetProps {
  children: React.ReactNode;
}

export function FilterSidebarSheet({ children }: FilterSidebarSheetProps) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRanges, setSelectedRanges] = useState<string>("");
  const router = useRouter();

  const handleRangeToggle = (rangeId: string) => {
    setSelectedRanges(rangeId);
  };

  const handleApplyFilters = () => {
    console.log({
      minPrice,
      maxPrice,
      selectedRanges,
    });
    if (!minPrice && !maxPrice) {
      const ranges = PRICE_RANGES?.find((rng) => rng?.id === selectedRanges);
      router.push(`?min=${ranges?.min}&max=${ranges?.max}`);
    } else {
      router.push(
        `?min=${minPrice ? minPrice : 0}&max=${maxPrice ? maxPrice : 9999999}`
      );
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="border-b border-gray-200 px-6 py-4 flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-semibold text-gray-900">
            Filters
          </SheetTitle>
          <div className="w-5" />
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Price Input Section */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Price Ranges Section */}
          <div>
            <h3 className="text-sm font-semibold text-teal-700 mb-4">
              Price Ranges
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.id}
                  onClick={() => handleRangeToggle(range.id)}
                  className={`flex items-center gap-3 p-1.5 rounded-lg transition-colors ${
                    selectedRanges.includes(range.id)
                      ? "bg-gray-200"
                      : "bg-gray-100 hover:bg-gray-150"
                  }`}
                >
                  {/* Radio Circle */}
                  <div>
                    <Check
                      className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors ${
                        selectedRanges.includes(range.id)
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-gray-300 bg-transparent"
                      }`}
                    />
                  </div>
                  {/* Label */}
                  <span className="text-xs font-medium text-gray-900">
                    {range.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Button */}
        <div className="border-t border-gray-200 p-6">
          <Button
            onClick={handleApplyFilters}
            className="w-full font-semibold py-2 rounded-lg"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
