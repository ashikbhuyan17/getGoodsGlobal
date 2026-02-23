import { fetcher } from '@/lib/fetcher';
import FlashSaleProductGrid from './_components/FlashSaleProductGrid';
import FlashSaleLoadMore from './_components/FlashSaleLoadMore';
import type { ProductItem } from './_components/FlashSaleProductGrid';

type FlashSaleRes = {
  status?: string;
  data?: {
    data?: unknown[];
    current_page?: number;
    last_page?: number;
    next_page_url?: string | null;
  };
};

export default async function FlashSalePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const loadedPages = Math.max(
    1,
    Math.min(10, parseInt(pageParam ?? '1', 10) || 1),
  );

  const responses = await Promise.all(
    Array.from({ length: loadedPages }, (_, i) =>
      fetcher<FlashSaleRes>(`/flash-sale?page=${i + 1}`),
    ),
  );

  const products = responses.flatMap(
    (r) => (r?.data?.data ?? []) as ProductItem[],
  );
  const lastPage = responses[0]?.data?.last_page ?? 1;
  const currentPage = loadedPages;

  return (
    <div className="min-h-screen pb-20">
      <div className="px-2 py-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">Flash Sale</h1>
          <p className="text-sm text-orange-500 font-medium">On Sale Now</p>
        </div>
        <div className="bg-white px-2 py-4 rounded">
          <FlashSaleProductGrid products={products} />
          <FlashSaleLoadMore currentPage={currentPage} lastPage={lastPage} />
        </div>
      </div>
    </div>
  );
}
