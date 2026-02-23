/* eslint-disable @typescript-eslint/no-explicit-any */
import CategorySection from '@/components/home/CategorySection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import FeatureSection from '@/components/home/FeatureSection';
import GallerySection from '@/components/home/GallerySection';
import HeroSlider from '@/components/home/HeroSlider';
import ProductsSlider from '@/components/home/ProductsSlider';
import Footer from '@/components/common/Footer';
import { fetcher } from '@/lib/fetcher';

export default async function Home() {
  const slides: any = await fetcher('/mainslider');
  const frontCategory: any = await fetcher('/front-category-products');
  // Fetch gallery slider data
  let galleryData: any = null;
  try {
    galleryData = await fetcher('/galleryslider');
  } catch (error) {
    console.error('Error fetching gallery slider:', error);
  }

  return (
    <div>
      <HeroSlider slides={slides} />
      <div className="px-2">
        <FeatureSection />
        <GallerySection galleryData={galleryData} />
        <FlashSaleSection />
        <CategorySection />
        <div className="space-y-4">
          {frontCategory?.data?.map((cat: any) => (
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
