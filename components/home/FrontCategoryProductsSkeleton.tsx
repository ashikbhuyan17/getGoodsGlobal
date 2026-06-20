export default function FrontCategoryProductsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <section
          key={i}
          className="animate-pulse space-y-3 rounded-sm bg-white p-3"
        >
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, j) => (
              <div
                key={j}
                className="h-56 w-44 shrink-0 rounded-xl bg-gray-200"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
