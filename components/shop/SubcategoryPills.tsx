import { fetcher } from '@/lib/fetcher';
import { REVALIDATE_CATALOG } from '@/lib/utils';
import {
  SubcategoryPillsClient,
  type SubcategoryPillItem,
} from '@/components/shop/SubcategoryPillsClient';

interface SubcategoryPillsProps {
  categorySlug: string;
  /** When on subcategory page, pass the current subcategory slug to highlight it */
  activeSubcategorySlug?: string | null;
}

export async function SubcategoryPills({
  categorySlug,
  activeSubcategorySlug = null,
}: SubcategoryPillsProps) {
  const res = await fetcher<{ status?: string; data?: SubcategoryPillItem[] }>(
    `/subcategories-by-category/${categorySlug}`,
    {},
    REVALIDATE_CATALOG,
    false,
  );

  if (res?.status === 'error' || !res?.data) {
    return null;
  }

  const subcategories = res.data ?? [];

  if (subcategories.length === 0) return null;

  return (
    <SubcategoryPillsClient
      categorySlug={categorySlug}
      subcategories={subcategories}
      activeSubcategorySlug={activeSubcategorySlug}
    />
  );
}
