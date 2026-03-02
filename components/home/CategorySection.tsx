import { fetcher } from '@/lib/fetcher';
import HomeCategory from './HomeCategory';

export default async function CategorySection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories: any = await fetcher('/categories');

  return (
    <section className="rounded-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 gap-2">
        {categories?.data?.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (category: any, index: number) =>
            index < 4 && (
              <HomeCategory
                key={category?.id}
                slug={category?.slug}
                title={category?.name}
              />
            ),
        )}
      </div>
    </section>
  );
}
