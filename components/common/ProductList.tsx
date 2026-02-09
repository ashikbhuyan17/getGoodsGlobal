/* eslint-disable @typescript-eslint/no-explicit-any */
// import PaginationComponent from "./Pagination";
import { fetcher } from "@/lib/fetcher";
import ProductCard from "./ProductCard";
import { Package, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function getClearFiltersHref(
  slug: string,
  categorySlug?: string | null
): string {
  if (slug.startsWith("/subcategory-products/") && categorySlug) {
    const subSlug = slug.replace("/subcategory-products/", "");
    return `/category/${categorySlug}/subcategory/${subSlug}`;
  }
  return slug
    .replace("/category-products/", "/category/")
    .replace("/subcategory-products/", "/subcategory/");
}

async function ProductList({
  slug,
  max,
  min,
  categorySlug,
}: {
  slug: string;
  max?: number;
  min?: number;
  /** When listing subcategory products, pass category slug for correct Clear Filters link */
  categorySlug?: string | null;
}) {
  const products: any = await fetcher(slug);

  // Handle error response (server down, invalid JSON, etc.)
  // If API fails, treat as empty array so empty state shows
  const productsData = products?.status === 'error' || !products?.data ? [] : products.data;

  // Filter products based on price range
  // Only filter if max is less than default value (indicating a real filter was applied)
  // Don't filter if both are default values (min=0, max=99999999)
  const isDefaultFilter = min === 0 && max === 99999999;
  const shouldFilter =
    typeof min === "number" &&
    typeof max === "number" &&
    !isDefaultFilter &&
    max < 99999999; // Filter if max is less than default value

  const filterdProduct = shouldFilter
    ? productsData?.filter((product: any) => {
      const price = Number(product?.new_price) || 0;
      return price >= (min || 0) && price <= max;
    })
    : productsData || [];

  // Show empty state if no products
  if (!filterdProduct || filterdProduct.length === 0) {
    return (
      <div className="bg-white mt-4 p-6 pb-4 rounded-sm border-border max-w-[94vw]">
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                {shouldFilter ? (
                  <Search className="h-10 w-10 text-gray-400" />
                ) : (
                  <Package className="h-10 w-10 text-gray-400" />
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {shouldFilter ? "No products found" : "No products available"}
            </h2>

            <p className="text-sm text-gray-600 mb-8 max-w-sm">
              {shouldFilter
                ? "Try adjusting your price filter to see more products."
                : "There are no products in this category at the moment. Check back later!"}
            </p>

            {shouldFilter && (
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href={getClearFiltersHref(slug, categorySlug)}>
                  Clear Filters
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filterdProduct?.map((product: any) => {
          return <div key={product?.id}>
            <ProductCard
              title={product?.name}
              slug={product?.slug}
              image={product?.images[0]?.image}
              newPrice={product?.new_price}
              oldPrice={product?.old_price}
            />
          </div>;
        })}
      </div>
      {/* <div className="my-10">
        <PaginationComponent currentPage={1} totalPages={6} />
      </div> */}
    </div>
  );
}

export default ProductList;
