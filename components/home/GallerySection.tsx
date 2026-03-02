'use client';

import { useState, useMemo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import VideoCard from './VideoCard';
import { Button } from '@/components/ui/button';
import { Images, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// API Response Types
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

interface GalleryApiResponse {
  status: string;
  message: string;
  data: GalleryCategory[];
}

export interface GallerySectionProps {
  galleryData: GalleryApiResponse | null;
}

function GallerySection({ galleryData }: GallerySectionProps) {
  // Get categories from API (API already sends filtered data)
  const categories = useMemo(() => {
    if (!galleryData?.data || !Array.isArray(galleryData.data)) {
      return [];
    }

    return galleryData.data.map((category) => ({
      id: String(category.id),
      name: category.name,
      icon: category.icon,
    }));
  }, [galleryData]);

  // Get default selected category (first category)
  const defaultCategory = categories.length > 0 ? categories[0].id : null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategory,
  );

  // Ensure selectedCategory is valid, fallback to first category
  const activeCategory = useMemo(() => {
    if (
      !selectedCategory ||
      !categories.some((cat) => cat.id === selectedCategory)
    ) {
      return defaultCategory;
    }
    return selectedCategory;
  }, [selectedCategory, categories, defaultCategory]);

  // Get banners for selected category (ID match - API already sends filtered data)
  const filteredBanners = useMemo(() => {
    if (!galleryData?.data || !activeCategory) {
      return [];
    }

    const category = galleryData.data.find(
      (cat) => String(cat.id) === activeCategory,
    );

    if (!category) return [];

    return category.banners || [];
  }, [galleryData, activeCategory]);

  return (
    <div className="bg-white px-4 py-4 pb-6 rounded-sm border-border max-w-[94vw] select-none">
      {/* Category Filter Navigation */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const iconUrl = `${process.env.NEXT_PUBLIC_IMG_URL}/${category.icon}`;

          return (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={isActive ? 'default' : 'outline'}
              className={cn(
                'whitespace-nowrap flex items-center gap-2 rounded px-3 py-2 h-auto',
                isActive
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200',
              )}
            >
              <Image
                src={iconUrl}
                alt={category.name}
                width={16}
                height={16}
                className="w-4 h-4 object-contain"
              />
              <span className="text-sm font-medium">{category.name}</span>
            </Button>
          );
        })}
        {/* View Sky Gallery Button */}
        <Button
          asChild
          variant="outline"
          className="ml-auto whitespace-nowrap flex items-center gap-2 rounded-lg px-4 py-2 h-auto bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
        >
          <Link href="/gallery" prefetch className="flex items-center gap-2">
            <Images className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">View Sky Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Video Carousel */}
      <div className="relative">
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredBanners.length > 0 ? (
              filteredBanners.map((banner) => (
                <CarouselItem
                  key={banner.id}
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <div className="w-full">
                    <VideoCard
                      image={banner.image}
                      video={banner.link}
                      title={banner.title}
                      date={banner.created_at}
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <div className="w-full py-8 text-center text-muted-foreground">
                No videos found in this category
              </div>
            )}
          </CarouselContent>
          {filteredBanners.length > 0 && (
            <>
              <CarouselPrevious className="left-0 md:-left-12" />
              <CarouselNext className="right-0 md:-right-12" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}

export default GallerySection;
