'use client';

import VideoCard from '@/components/home/VideoCard';

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

interface GallerySectionListProps {
  categories: GalleryCategory[];
}

export default function GallerySectionList({
  categories,
}: GallerySectionListProps) {
  if (!categories?.length) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No gallery content available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <section key={category.id} className="bg-white  rounded-md">
          <h2 className="text-base font-semibold py-2 px-4 text-gray-800">
            {category.name.toUpperCase()}
          </h2>
          <div className="border-t border-gray-200 my-2" />
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-4 pb-2 min-w-min p-4">
              {(category.banners ?? []).map((banner) => (
                <div
                  key={banner.id}
                  className="w-[280px] sm:w-[300px] shrink-0"
                >
                  <VideoCard
                    image={banner.image}
                    video={banner.link}
                    title={banner.title}
                    date={banner.created_at}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
