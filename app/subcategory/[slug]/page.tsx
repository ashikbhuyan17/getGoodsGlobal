import ProductList from "@/components/common/ProductList";
import InfoBar from "@/components/shop/InfoBar";

async function ShopPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { max?: string; min?: string };
}) {
  const { slug } = await params;
  const { max, min } = await searchParams;

  return (
    <div className="px-2">
      <InfoBar slug={slug} />
      <ProductList
        max={Number(max) || 99999999}
        min={Number(min) || 0}
        slug={`/subcategory-products/${slug}`}
      />
    </div>
  );
}

export default ShopPage;
