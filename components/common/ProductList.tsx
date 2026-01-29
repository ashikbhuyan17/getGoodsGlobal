/* eslint-disable @typescript-eslint/no-explicit-any */
// import PaginationComponent from "./Pagination";
import { fetcher } from "@/lib/fetcher";
import ProductCard from "./ProductCard";

async function ProductList({
  slug,
  max,
  min,
}: {
  slug: string;
  max?: number;
  min?: number;
}) {
  const products: any = await fetcher(slug);

  const filterdProduct =
    max && min
      ? products?.data?.filter(
        (product: any) =>
          product?.new_price <= max && product?.new_price >= min
      )
      : products?.data;

  return (
    <div className="bg-white mt-4 p-6 pb-4 rounded-sm border-border max-w-[94vw]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filterdProduct?.map((product: any) => (
          <div key={product?.id}>
            <ProductCard
              title={product?.name}
              slug={product?.slug}
              image={product?.images[0]?.image}
              newPrice={product?.new_price}
              oldPrice={product?.old_price}
            />
          </div>
        ))}
      </div>
      {/* <div className="my-10">
        <PaginationComponent currentPage={1} totalPages={6} />
      </div> */}
    </div>
  );
}

export default ProductList;
