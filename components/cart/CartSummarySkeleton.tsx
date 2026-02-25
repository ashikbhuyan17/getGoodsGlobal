export default function CartSummarySkeleton() {
  return (
    <div className="rounded-lg p-6 space-y-4 bg-white border border-gray-200">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
    </div>
  );
}
