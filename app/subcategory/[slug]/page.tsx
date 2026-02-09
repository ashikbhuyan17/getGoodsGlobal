import { fetcher } from "@/lib/fetcher";
import { permanentRedirect } from "next/navigation";

async function SubcategoryRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ max?: string; min?: string }>;
}) {
  const { slug } = await params;
  const { max, min } = await searchParams;

  let categorySlug: string | null = null;
  const normalizedSlug = decodeURIComponent(slug);
  try {
    const menuCategories: {
      status?: string;
      data?: { slug: string; subcategories?: { slug: string }[] }[];
    } = await fetcher("/menu-categories");
    
    // Handle API error (server down, invalid JSON, etc.)
    if (menuCategories?.status === 'error' || !menuCategories?.data) {
      permanentRedirect("/");
    }
    
    const data = menuCategories.data;
    if (Array.isArray(data)) {
      const parent = data.find((cat) =>
        cat.subcategories?.some(
          (s) => decodeURIComponent(s.slug || "") === normalizedSlug
        )
      );
      if (parent) categorySlug = parent.slug;
    }
  } catch {
    // fallback: redirect to home if we can't resolve parent
    permanentRedirect("/");
  }

  if (!categorySlug) {
    permanentRedirect("/");
  }

  const search = new URLSearchParams();
  if (min != null) search.set("min", min);
  if (max != null) search.set("max", max);
  const q = search.toString();
  const path = `/category/${categorySlug}/subcategory/${slug}${q ? `?${q}` : ""}`;
  permanentRedirect(path);
}

export default SubcategoryRedirectPage;
