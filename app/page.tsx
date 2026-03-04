/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react';
import CategorySection from '@/components/home/CategorySection';
import CategorySectionSkeleton from '@/components/home/CategorySectionSkeleton';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import FeatureSection from '@/components/home/FeatureSection';
import GallerySection, {
  type GallerySectionProps,
} from '@/components/home/GallerySection';
import HeroSlider from '@/components/home/HeroSlider';
import ProductsSlider from '@/components/home/ProductsSlider';
import Footer from '@/components/common/Footer';
import { fetcher } from '@/lib/fetcher';

// Home page cache - 3 min, no API hit on back navigation
const HOME_CACHE = 180;

export default async function Home() {
  const [slides, frontCategory, galleryData] = await Promise.all([
    fetcher('/mainslider', {}, HOME_CACHE),
    fetcher('/front-category-products', { cache: 'no-store' }),
    fetcher('/galleryslider', {}, HOME_CACHE).catch(() => null),
  ]);

  return (
    <div>
      <HeroSlider slides={slides} />
      <div className="px-2 space-y-2 lg:space-y-3 pt-2 lg:pt-3">
        {/* <FeatureSection /> */}
        <GallerySection
          galleryData={galleryData as GallerySectionProps['galleryData']}
        />
        <FlashSaleSection />
        <Suspense fallback={<CategorySectionSkeleton />}>
          <CategorySection />
        </Suspense>
        <div className="space-y-2 lg:space-y-3">
          {(frontCategory as { data?: unknown[] })?.data?.map((cat: any) => (
            <ProductsSlider
              title={cat?.name}
              image={cat?.image}
              key={cat?.id}
              products={cat?.products}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
