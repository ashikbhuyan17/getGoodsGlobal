"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function SearchBar() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search_query") ?? "");
  const router = useRouter();

  const handleSearch = () => {
    if (value?.trim().length >= 1) {
      router.push(`/results?search_query=${encodeURIComponent(value.trim())}`);
    }
  };
  return (
    <div className="relative flex-1">
      <Input
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        value={value}
        type="text"
        placeholder="Search Product"
        className="w-full bg-white py-2 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-0"
      />
      <button
        type="button"
        onClick={handleSearch}
        aria-label="Search"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-gray-900"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}

export default SearchBar;
