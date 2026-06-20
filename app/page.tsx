/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react';
import CategorySection from '@/components/home/CategorySection';
import CategorySectionSkeleton from '@/components/home/CategorySectionSkeleton';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import FlashSaleSectionSkeleton from '@/components/home/FlashSaleSectionSkeleton';
import GallerySection, {
  type GallerySectionProps,
} from '@/components/home/GallerySection';
import HeroSlider from '@/components/home/HeroSlider';
import FrontCategoryProducts from '@/components/home/FrontCategoryProducts';
import FrontCategoryProductsSkeleton from '@/components/home/FrontCategoryProductsSkeleton';
import Footer from '@/components/common/Footer';
import { fetcher } from '@/lib/fetcher';
export const revalidate = 180;

export default async function Home() {
  const [slides, galleryData] = await Promise.all([
    fetcher('/mainslider', {}, 180, false),
    fetcher('/galleryslider', {}, 180, false).catch(() => null),
  ]);

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <HeroSlider slides={slides} />
      <div className="w-full min-w-0 max-w-full overflow-x-hidden space-y-2 px-2 pt-2 lg:space-y-3 lg:pt-3">
        <GallerySection
          galleryData={galleryData as GallerySectionProps['galleryData']}
        />
        <Suspense fallback={<FlashSaleSectionSkeleton />}>
          <FlashSaleSection />
        </Suspense>
        <Suspense fallback={<CategorySectionSkeleton />}>
          <CategorySection />
        </Suspense>
        <Suspense fallback={<FrontCategoryProductsSkeleton />}>
          <FrontCategoryProducts />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
