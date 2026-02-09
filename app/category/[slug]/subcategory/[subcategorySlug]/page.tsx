import ProductList from "@/components/common/ProductList";
import InfoBar from "@/components/shop/InfoBar";
import { SubcategoryPills } from "@/components/shop/SubcategoryPills";

async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subcategorySlug: string }>;
  searchParams: Promise<{ max?: string; min?: string }>;
}) {
  const { slug: categorySlug, subcategorySlug } = await params;
  const { max, min } = await searchParams;

  return (
    <div className="min-h-screen space-y-5">
      <InfoBar slug={subcategorySlug} />
      <div className="px-2">
        <div className="bg-white rounded-sm border-border p-4 space-y-3">
          <SubcategoryPills
            categorySlug={categorySlug}
            activeSubcategorySlug={subcategorySlug}
          />
          <ProductList
            max={Number(max) || 99999999}
            min={Number(min) || 0}
            slug={`/subcategory-products/${subcategorySlug}`}
            categorySlug={categorySlug}
          />
        </div>
      </div>
    </div>
  );
}

export default SubcategoryPage;
