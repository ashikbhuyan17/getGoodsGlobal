import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SubcategoryItem {
  id: number;
  subcategoryName: string;
  slug: string;
  category_id?: string;
  image?: string | null;
}

interface SubcategoryPillsProps {
  categorySlug: string;
  /** When on subcategory page, pass the current subcategory slug to highlight it */
  activeSubcategorySlug?: string | null;
}

export async function SubcategoryPills({
  categorySlug,
  activeSubcategorySlug = null,
}: SubcategoryPillsProps) {
  const res = await fetcher<{ status?: string; data?: SubcategoryItem[] }>(
    `/subcategories-by-category/${categorySlug}`
  );

  // Handle error response (server down, invalid JSON, etc.)
  if (res?.status === 'error' || !res?.data) {
    return null; // Silently hide pills if API fails
  }

  const subcategories = res.data ?? [];

  if (subcategories.length === 0) return null;

  return (
    <div >
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {subcategories.map((sub) => {
          const subSlug = decodeURIComponent(sub.slug || "");
          const activeSlug = activeSubcategorySlug ? decodeURIComponent(activeSubcategorySlug) : "";
          const isActive = activeSlug !== "" && subSlug === activeSlug;
          return (
            <Link
              key={sub.id}
              href={`/category/${categorySlug}/subcategory/${sub.slug}`}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors",
                "border border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100",
                isActive &&
                "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              )}
            >
              {sub.subcategoryName}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
