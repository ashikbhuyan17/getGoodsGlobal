/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductsSlider from '@/components/home/ProductsSlider';
import { fetcher } from '@/lib/fetcher';
import { REVALIDATE_PRODUCTS } from '@/lib/utils';

export default async function FrontCategoryProducts() {
  const frontCategory = await fetcher(
    '/front-category-products',
    {},
    REVALIDATE_PRODUCTS,
    false,
  );

  const categories =
    (frontCategory as { data?: any[] })?.data?.filter(
      (cat) => Array.isArray(cat?.products) && cat.products.length > 0,
    ) ?? [];

  if (categories.length === 0) return null;

  return (
    <div className="w-full min-w-0 max-w-full space-y-2 lg:space-y-3">
      {categories.map((cat: any) => (
        <ProductsSlider
          title={cat?.name}
          image={cat?.image}
          categorySlug={cat?.slug}
          key={cat?.id}
          products={cat?.products}
        />
      ))}
    </div>
  );
}
