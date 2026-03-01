import { fetcher } from '@/lib/fetcher';
import GalleryTopBar from '@/components/gallery/GalleryTopBar';
import GallerySectionList from '@/components/gallery/GallerySectionList';

const HOME_CACHE = 180;

interface Banner {
  id: number;
  category_id: string;
  title: string;
  image: string;
  link: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface GalleryCategory {
  id: number;
  name: string;
  icon: string;
  status: string;
  banners: Banner[];
}

type GalleryApiResponse =
  | GalleryCategory[]
  | { status?: string; data?: GalleryCategory[] };

function normalizeGalleryData(
  raw: GalleryApiResponse | null,
): GalleryCategory[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return (raw as { data?: GalleryCategory[] })?.data ?? [];
}

export default async function GalleryPage() {
  const raw = await fetcher<GalleryApiResponse>(
    '/galleryslider',
    {},
    HOME_CACHE,
  ).catch(() => null);
  const categories = normalizeGalleryData(raw);

  return (
    <div className="min-h-screen bg-background pb-20">
      <GalleryTopBar />
      <div className="px-4 py-6">
        <GallerySectionList categories={categories} />
      </div>
    </div>
  );
}
