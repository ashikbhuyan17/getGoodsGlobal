// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import VideoCard from "./VideoCard";
// import { fetcher } from "@/lib/fetcher";

// async function GallerySection() {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const Videos: any = await fetcher("/galleryslider");
//   console.log("🚀 ~ GallerySection ~ Videos:", Videos)

//   return (
//     <div className="bg-white px-4 py-2 pb-4 rounded-sm border-border max-w-[94vw] select-none">
//       <Carousel>
//         <CarouselContent>
//           {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
//           {Videos?.data?.map((video: any) => (
//             <CarouselItem
//               className="basis-1/2 sm:basis-1/4 lg:basis-1/6"
//               key={video?.id}
//             >
//               <VideoCard image={video?.image} video={video?.link} />
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//       </Carousel>
//     </div>
//   );
// }

// export default GallerySection;


"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import VideoCard from "./VideoCard";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Percent,
  Ship,
  Handshake,
  Calendar,
  Images,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Demo data matching API response format
const demoVideos = {
  status: "success",
  message: "Gallery Sliders",
  data: [
    {
      id: 1,
      category_id: "1",
      category_name: "Latest",
      category_icon: Sparkles,
      category_color: "text-teal-600",
      image: "public/uploads/banner/1763791364WhatsApp Image 2025-11-22 at 12.02.02 PM.jpeg",
      link: "vSQ6w7koei8",
      title: "Hongkong Shipment Loading 21-01-2026",
      status: "1",
      created_at: "2026-01-21T06:02:44.000000Z",
      updated_at: "2026-01-21T06:02:44.000000Z",
    },
    {
      id: 2,
      category_id: "3",
      category_name: "Shipment",
      category_icon: Ship,
      category_color: "text-blue-600",
      image: "public/uploads/banner/17673282212ecd8df8-51e9-4b48-9cf8-d2fca9f61404.jpg",
      link: "F_VRE-rB_Ss",
      title: "Sea Shipment Loading 21-01-2026",
      status: "1",
      created_at: "2026-01-21T05:58:45.000000Z",
      updated_at: "2026-01-21T04:30:21.000000Z",
    },
    {
      id: 3,
      category_id: "3",
      category_name: "Shipment",
      category_icon: Ship,
      category_color: "text-blue-600",
      image: "public/uploads/banner/1763791364WhatsApp Image 2025-11-22 at 12.02.02 PM.jpeg",
      link: "vSQ6w7koei8",
      title: "Guangzhou Shipment Loading 20-01-2026",
      status: "1",
      created_at: "2026-01-20T06:02:44.000000Z",
      updated_at: "2026-01-20T06:02:44.000000Z",
    },
    {
      id: 4,
      category_id: "3",
      category_name: "Shipment",
      category_icon: Ship,
      category_color: "text-blue-600",
      image: "public/uploads/banner/17673282212ecd8df8-51e9-4b48-9cf8-d2fca9f61404.jpg",
      link: "F_VRE-rB_Ss",
      title: "Guangzhou Shipment Unloading 18-01-2026",
      status: "1",
      created_at: "2026-01-18T05:58:45.000000Z",
      updated_at: "2026-01-18T04:30:21.000000Z",
    },
    {
      id: 5,
      category_id: "3",
      category_name: "Shipment",
      category_icon: Ship,
      category_color: "text-blue-600",
      image: "public/uploads/banner/1763791364WhatsApp Image 2025-11-22 at 12.02.02 PM.jpeg",
      link: "vSQ6w7koei8",
      title: "Guangzhou Shipment Loading 17-01-2026",
      status: "1",
      created_at: "2026-01-17T06:02:44.000000Z",
      updated_at: "2026-01-17T06:02:44.000000Z",
    },
    {
      id: 6,
      category_id: "2",
      category_name: "Offer",
      category_icon: Percent,
      category_color: "text-orange-600",
      image: "public/uploads/banner/17673282212ecd8df8-51e9-4b48-9cf8-d2fca9f61404.jpg",
      link: "F_VRE-rB_Ss",
      title: "1 Day Ramadan Stock Offer",
      status: "1",
      created_at: "2026-01-15T05:58:45.000000Z",
      updated_at: "2026-01-15T04:30:21.000000Z",
    },
    {
      id: 7,
      category_id: "3",
      category_name: "Shipment",
      category_icon: Ship,
      category_color: "text-blue-600",
      image: "public/uploads/banner/1763791364WhatsApp Image 2025-11-22 at 12.02.02 PM.jpeg",
      link: "vSQ6w7koei8",
      title: "Hongkong Shipment Loading 14-01-2026",
      status: "1",
      created_at: "2026-01-14T06:02:44.000000Z",
      updated_at: "2026-01-14T06:02:44.000000Z",
    },
    {
      id: 8,
      category_id: "1",
      category_name: "Latest",
      category_icon: Sparkles,
      category_color: "text-teal-600",
      image: "public/uploads/banner/17673282212ecd8df8-51e9-4b48-9cf8-d2fca9f61404.jpg",
      link: "F_VRE-rB_Ss",
      title: "New Product Launch Event",
      status: "1",
      created_at: "2026-01-22T05:58:45.000000Z",
      updated_at: "2026-01-22T04:30:21.000000Z",
    },
    {
      id: 9,
      category_id: "4",
      category_name: "Collaboration",
      category_icon: Handshake,
      category_color: "text-green-600",
      image: "public/uploads/banner/1763791364WhatsApp Image 2025-11-22 at 12.02.02 PM.jpeg",
      link: "vSQ6w7koei8",
      title: "Partnership Announcement",
      status: "1",
      created_at: "2026-01-19T06:02:44.000000Z",
      updated_at: "2026-01-19T06:02:44.000000Z",
    },
    {
      id: 10,
      category_id: "5",
      category_name: "Event",
      category_icon: Calendar,
      category_color: "text-green-600",
      image: "public/uploads/banner/17673282212ecd8df8-51e9-4b48-9cf8-d2fca9f61404.jpg",
      link: "F_VRE-rB_Ss",
      title: "Annual Company Event 2026",
      status: "1",
      created_at: "2026-01-16T05:58:45.000000Z",
      updated_at: "2026-01-16T04:30:21.000000Z",
    },
  ],
};

// Video type definition
interface VideoItem {
  id: number;
  category_id: string;
  category_name: string;
  category_icon: typeof Sparkles;
  category_color: string;
  image: string;
  link: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Comment out API call - using demo data instead
  // const Videos = await fetcher("/galleryslider");
  // console.log("🚀 ~ GallerySection ~ Videos:", Videos);

  const Videos = demoVideos;

  // Extract unique categories from video data
  const getCategoriesFromVideos = () => {
    const categoryMap = new Map<
      string,
      { id: string; name: string; icon: typeof Sparkles; color: string }
    >();

    // Add "Latest" (All) category first
    categoryMap.set("all", {
      id: "all",
      name: "Latest",
      icon: Sparkles,
      color: "text-teal-600",
    });

    // Extract unique categories from videos
    // Skip category_id "1" (Latest) since we already have "all" for Latest
    Videos?.data?.forEach((video: VideoItem) => {
      if (video.category_id !== "1" && !categoryMap.has(video.category_id)) {
        categoryMap.set(video.category_id, {
          id: video.category_id,
          name: video.category_name,
          icon: video.category_icon,
          color: video.category_color,
        });
      }
    });

    return Array.from(categoryMap.values());
  };

  const categories = getCategoriesFromVideos();

  // Filter videos by selected category
  const filteredVideos =
    selectedCategory === "all" // Latest shows all
      ? Videos?.data || []
      : Videos?.data?.filter(
          (video: VideoItem) => video.category_id === selectedCategory
        ) || [];

  return (
    <div className="bg-white px-4 py-4 pb-6 rounded-sm border-border max-w-[94vw] select-none">
      {/* Category Filter Navigation */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={isActive ? "default" : "outline"}
              className={cn(
                "whitespace-nowrap flex items-center gap-2 rounded-lg px-4 py-2 h-auto",
                isActive
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  isActive ? "text-white" : category.color
                )}
              />
              <span className="text-sm font-medium">{category.name}</span>
            </Button>
          );
        })}
        {/* View Sky Gallery Button */}
        <Button
          variant="outline"
          className="ml-auto whitespace-nowrap flex items-center gap-2 rounded-lg px-4 py-2 h-auto bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
        >
          <Images className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">View Sky Gallery</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Video Carousel */}
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video: VideoItem) => (
                <CarouselItem
                  key={video.id}
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <VideoCard
                    image={video.image}
                    video={video.link}
                    title={video.title}
                    date={video.created_at}
                  />
                </CarouselItem>
              ))
            ) : (
              <div className="w-full py-8 text-center text-muted-foreground">
                No videos found in this category
              </div>
            )}
          </CarouselContent>
          {filteredVideos.length > 0 && (
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
