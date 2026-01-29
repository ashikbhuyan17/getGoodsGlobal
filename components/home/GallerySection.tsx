import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import VideoCard from "./VideoCard";
import { fetcher } from "@/lib/fetcher";

async function GallerySection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Videos: any = await fetcher("/galleryslider");

  return (
    <div className="bg-white px-4 py-2 pb-4 rounded-sm border-border max-w-[94vw] select-none">
      <Carousel>
        <CarouselContent>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {Videos?.data?.map((video: any) => (
            <CarouselItem
              className="basis-1/2 sm:basis-1/4 lg:basis-1/6"
              key={video?.id}
            >
              <VideoCard image={video?.image} video={video?.link} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default GallerySection;
