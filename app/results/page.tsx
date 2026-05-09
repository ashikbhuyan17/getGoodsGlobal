import ProductList from "@/components/common/ProductList";
import React from "react";

async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ search_query: string }>;
}) {
  const { search_query } = await searchParams;

  return (
    <div className="px-2">
      <ProductList slug={`/search-products/${search_query}`} />
    </div>
  );
}

export default SearchPage;
