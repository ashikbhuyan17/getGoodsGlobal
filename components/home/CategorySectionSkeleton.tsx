import CategoryCardSkeleton from './CategoryCardSkeleton';

export default function CategorySectionSkeleton() {
  return (
    <section className="py-4 rounded-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
