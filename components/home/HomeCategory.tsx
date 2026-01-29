import { fetcher } from "@/lib/fetcher";
import Image from "next/image";
import Link from "next/link";
async function HomeCategory({ slug, title }: { slug: string; title: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories: any = await fetcher(`/subcategories-by-category/${slug}`);

  return (
    <div className="rounded-xl bg-white shadow-sm p-4">
      <h3 className="font-bold text-primary py-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {categories?.data?.map(
          //   eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any, index: number) =>
            index < 4 && (
              <Link href={`/subcategory/${slug}`} key={item?.id}>
                <div className="border-0 shadow-none">
                  <div className="p-0">
                    <div className="relative w-full h-28 rounded-sm overflow-hidden">
                      <Image
                        src={
                          item?.image
                            ? `${process.env.NEXT_PUBLIC_IMG_URL}/${item?.image}`
                            : "https://skybuybd.com/_next/static/media/sneakers.2f787ceb.jpg"
                        }
                        alt={item?.subcategoryName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-start font-medium text-sm py-2">
                      {item?.subcategoryName}
                    </p>
                  </div>
                </div>
              </Link>
            )
        )}
      </div>
    </div>
  );
}

export default HomeCategory;
