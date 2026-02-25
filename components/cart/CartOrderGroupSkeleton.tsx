export default function CartOrderGroupSkeleton() {
  return (
    <div className="rounded-lg p-6 space-y-4 bg-white">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse shrink-0" />
        <div className="flex-1 flex gap-4">
          <div className="w-24 h-24 rounded-md bg-gray-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="space-y-2 pl-10">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded bg-gray-200 animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
