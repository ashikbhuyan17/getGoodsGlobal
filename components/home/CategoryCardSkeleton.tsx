export default function CategoryCardSkeleton() {
  return (
    <div className="rounded-xl bg-white shadow-sm p-4 border border-gray-200">
      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="relative w-full h-28 rounded-sm bg-gray-200 animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
