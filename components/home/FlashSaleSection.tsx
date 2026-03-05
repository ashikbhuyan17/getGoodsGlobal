import Link from 'next/link';
import { fetcher } from '@/lib/fetcher';
import ProductCard from '@/components/common/ProductCard';

function getProductImage(product: {
  image?: { image?: string };
  PostImage?: string;
}): string {
  if (product?.image?.image) return product.image.image;
  try {
    const arr = JSON.parse(product?.PostImage ?? '[]');
    const first = arr?.[0];
    return first
      ? `public/images/product/slider/${first}`
      : '/placeholder-product.png';
  } catch {
    return '/placeholder-product.png';
  }
}

export default async function FlashSaleSection() {
  const res = await fetcher<{
    status?: string;
    data?: { data?: unknown[] };
  }>('/flash-sale?page=1');

  const products = (res?.data?.data ?? []) as {
    id: number;
    name: string;
    slug: string;
    new_price: string | number;
    old_price?: string | number;
    image?: { image?: string };
    PostImage?: string;
  }[];
  const displayProducts = products.slice(0, 6);

  if (displayProducts.length === 0) return null;

  return (
    <section className="">
      <div className="bg-white rounded-sm border border-gray-200 p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Flash Sale</h2>
            <p className="text-sm text-orange-500 font-medium">On Sale Now</p>
          </div>
          <Link
            href="/flash-sale"
            className="shrink-0 inline-flex items-center justify-center rounded border-2 border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors"
          >
            SHOP ALL PRODUCTS
          </Link>
        </div>

        {/* Product Grid - 6 products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              image={getProductImage(product)}
              title={product.name}
              newPrice={Number(product.new_price ?? 0)}
              oldPrice={
                product.old_price ? Number(product.old_price) : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
