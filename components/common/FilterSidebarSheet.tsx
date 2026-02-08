"use client";

import { useState, useEffect } from "react";
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
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sync state with URL params when sheet opens
  useEffect(() => {
    if (!open) return;

    const urlMin = searchParams.get("min");
    const urlMax = searchParams.get("max");

    // If no URL params, clear all state
    if (!urlMin && !urlMax) {
      setMinPrice("");
      setMaxPrice("");
      setSelectedRanges("");
      return;
    }

    const min = urlMin ? Number(urlMin) : 0;
    const max = urlMax ? Number(urlMax) : 99999999;

    // Check if URL params match any price range
    const matchingRange = PRICE_RANGES.find(
      (range) => range.min === min && range.max === max
    );

    if (matchingRange) {
      // If matches a range, select that range and clear manual inputs
      setSelectedRanges(matchingRange.id);
      setMinPrice("");
      setMaxPrice("");
    } else {
      // If doesn't match a range, show in manual inputs and clear range selection
      setSelectedRanges("");
      setMinPrice(min === 0 ? "" : String(min));
      setMaxPrice(max === 99999999 ? "" : String(max));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleRangeToggle = (rangeId: string) => {
    // Toggle: if same range clicked, deselect it
    if (selectedRanges === rangeId) {
      setSelectedRanges("");
      setMinPrice("");
      setMaxPrice("");
      // Clear filters from URL
      router.push(pathname);
      router.refresh();
      return;
    }

    setSelectedRanges(rangeId);
    // Clear manual price inputs when selecting a range
    setMinPrice("");
    setMaxPrice("");
    
    // Update URL immediately when range is selected
    const ranges = PRICE_RANGES?.find((rng) => rng?.id === rangeId);
    if (ranges) {
      const url = `${pathname}?min=${ranges.min}&max=${ranges.max}`;
      router.push(url);
      router.refresh();
    }
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    // Update state first
    if (type === "min") {
      setMinPrice(value);
      // Clear selected range when manual input changes
      if (selectedRanges) setSelectedRanges("");
    } else {
      setMaxPrice(value);
      // Clear selected range when manual input changes
      if (selectedRanges) setSelectedRanges("");
    }

    // Get updated values for URL
    const newMinPrice = type === "min" ? value : minPrice;
    const newMaxPrice = type === "max" ? value : maxPrice;

    // Update URL with current values
    // If both are empty, use defaults (which means no filter)
    const currentMin = newMinPrice ? Number(newMinPrice) : 0;
    const currentMax = newMaxPrice ? Number(newMaxPrice) : 99999999;
    
    // Only add query params if at least one is not default
    if (currentMin > 0 || currentMax < 99999999) {
      const url = `${pathname}?min=${currentMin}&max=${currentMax}`;
      router.push(url);
      router.refresh();
    } else {
      // If both are defaults, clear filters from URL
      router.push(pathname);
      router.refresh();
    }
  };

  const handleClearRange = () => {
    // Clear selected range and price inputs
    setSelectedRanges("");
    setMinPrice("");
    setMaxPrice("");
    // Clear filters from URL
    router.push(pathname);
    router.refresh();
  };

  const handleApplyFilters = () => {
    // Close the sheet after applying filters
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
                  onChange={(e) => handlePriceChange("min", e.target.value)}
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
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Price Ranges Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-teal-700">
                Price Ranges
              </h3>
              {(selectedRanges || minPrice || maxPrice) && (
                <button
                  onClick={handleClearRange}
                  className="text-xs text-red-600 hover:text-red-700 font-medium underline"
                >
                  Clear Range
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.id}
                  onClick={() => handleRangeToggle(range.id)}
                  className={`flex items-center gap-3 p-1.5 rounded-lg transition-colors ${
                    selectedRanges === range.id
                      ? "bg-gray-200"
                      : "bg-gray-100 hover:bg-gray-150"
                  }`}
                >
                  {/* Radio Circle */}
                  <div>
                    <Check
                      className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors ${
                        selectedRanges === range.id
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
