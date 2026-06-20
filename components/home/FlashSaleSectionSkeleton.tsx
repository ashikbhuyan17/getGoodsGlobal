export default function FlashSaleSectionSkeleton() {
  return (
    <section className="animate-pulse space-y-3 rounded-sm bg-white p-3">
      <div className="h-6 w-40 rounded bg-gray-200" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-56 w-44 shrink-0 rounded-xl bg-gray-200" />
        ))}
      </div>
    </section>
  );
}
