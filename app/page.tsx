/* eslint-disable @typescript-eslint/no-explicit-any */
import CategorySection from "@/components/home/CategorySection";
import FeatureSection from "@/components/home/FeatureSection";
import GallerySection from "@/components/home/GallerySection";
import HeroSlider from "@/components/home/HeroSlider";
import ProductsSlider from "@/components/home/ProductsSlider";
import Footer from "@/components/common/Footer";
import { fetcher } from "@/lib/fetcher";

export default async function Home() {
  const slides: any = await fetcher("/mainslider");
  const frontCategory: any = await fetcher("/front-category-products");

  return (
    <div>
      <HeroSlider slides={slides} />
      <div className="px-2">
        <FeatureSection />
        <GallerySection />
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
