import { fetcher } from '@/lib/fetcher';
import { REVALIDATE_PRODUCTS } from '@/lib/utils';
import FlashSaleSlider, {
  type FlashSaleProduct,
} from '@/components/home/FlashSaleSlider';

export default async function FlashSaleSection() {
  const res = await fetcher<{
    status?: string;
    data?: { data?: FlashSaleProduct[] };
  }>('/flash-sale?page=1', {}, REVALIDATE_PRODUCTS, false);

  const products = res?.data?.data ?? [];

  if (products.length === 0) return null;

  return <FlashSaleSlider products={products} />;
}
