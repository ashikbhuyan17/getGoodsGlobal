import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "../common/ProductCard";
import Image from "next/image";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductsSlider({ title, image, products }: { title: string; image: string, products: any }) {
  return (
    <div className="bg-white px-4 py-2 pb-4 rounded-sm border-border max-w-[94vw] select-none">
      <div className="flex items-center gap-2 text-primary font-bold text-lg mx-2 my-4">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMG_URL}/${image}`}
          alt={title}
          width={28}
          height={28}
        />
        <h2>{title}</h2>
      </div>
      <Carousel>
        <CarouselContent>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {products?.map((product: any) => (
            <CarouselItem
              className="basis-1/2 sm:basis-1/4 lg:basis-1/6"
              key={product?.id}
            >
              <ProductCard
                title={product?.name}
                slug={product?.slug}
                image={product?.image?.image}
                newPrice={product?.new_price}
                oldPrice={product?.old_price}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default ProductsSlider;
