import { fetcher } from "@/lib/fetcher";
import Image from "next/image";

interface FeaturedBanner {
  image_one: string;
  title_one: string;
  image_two: string;
  title_two: string;
  image_three: string;
  title_three: string;
  image_four: string;
  title_four: string;
}

export default async function FeatureSection() {
  const featuredItems = await fetcher<{ data: FeaturedBanner }>(
    "/featuredbanner"
  );

  const items = [
    {
      image: featuredItems?.data?.image_one,
      title: featuredItems?.data?.title_one,
    },
    {
      image: featuredItems?.data?.image_two,
      title: featuredItems?.data?.title_two,
    },
    {
      image: featuredItems?.data?.image_three,
      title: featuredItems?.data?.title_three,
    },
    {
      image: featuredItems?.data?.image_four,
      title: featuredItems?.data?.title_four,
    },
  ];

  return (
    <section className="py-4">
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <a
            key={index}
            href="https://skyone.global/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-md shadow-sm border border-border p-4 flex flex-col items-center justify-center text-center transition hover:shadow-md"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${item.image}`}
              alt={item.title}
              width={120}
              height={60}
              className="object-contain mb-2"
            />
            <p className="text-gray-800 text-sm font-medium">
              {item.title}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}


