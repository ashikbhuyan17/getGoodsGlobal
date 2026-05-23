import ProductList from '@/components/common/ProductList';
import InfoBar from '@/components/shop/InfoBar';
import { SubcategoryPills } from '@/components/shop/SubcategoryPills';

async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ max?: string; min?: string }>;
}) {
  const { slug } = await params;
  const { max, min } = await searchParams;

  return (
    <div className="min-h-screen space-y-5 max-lg:pb-16">
      <div>
        <InfoBar slug={slug} />
      </div>
      <div className="px-2">
        <div className="bg-white rounded-sm border-border p-2 sm:p-4 space-y-3">
          <SubcategoryPills categorySlug={slug} />
          <ProductList
            max={Number(max) || 99999999}
            min={Number(min) || 0}
            slug={`/category-products/${slug}`}
          />
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
