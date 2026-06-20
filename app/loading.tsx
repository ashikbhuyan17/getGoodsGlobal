import CategorySectionSkeleton from '@/components/home/CategorySectionSkeleton';
import FlashSaleSectionSkeleton from '@/components/home/FlashSaleSectionSkeleton';
import FrontCategoryProductsSkeleton from '@/components/home/FrontCategoryProductsSkeleton';

export default function HomeLoading() {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <div className="aspect-[16/6] w-full animate-pulse bg-gray-200" />
      <div className="space-y-2 px-2 pt-2 lg:space-y-3 lg:pt-3">
        <div className="h-40 animate-pulse rounded-sm bg-gray-100" />
        <FlashSaleSectionSkeleton />
        <CategorySectionSkeleton />
        <FrontCategoryProductsSkeleton />
      </div>
    </div>
  );
}
