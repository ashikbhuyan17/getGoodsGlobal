function SkeletonBar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/80 ${className}`}
      aria-hidden
    />
  );
}

function FieldSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className={`space-y-2 ${wide ? 'md:col-span-2' : ''}`}>
      <SkeletonBar className="h-3.5 w-20" />
      <SkeletonBar className="h-10 w-full rounded-lg" />
    </div>
  );
}

function OrderFormSkeleton() {
  return (
    <section
      aria-label="Loading delivery details"
      className="rounded-lg border border-gray-200 bg-white p-4 md:p-6"
    >
      <SkeletonBar className="mb-4 h-5 w-36" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton wide />
      </div>
    </section>
  );
}

function ShippingMethodSkeleton() {
  return (
    <section
      aria-label="Loading shipping methods"
      className="rounded-lg border border-gray-200 bg-white p-4 md:p-6"
    >
      <SkeletonBar className="mb-3 h-5 w-40" />
      <div className="space-y-2">
        {['Inside Dhaka', 'Outside Dhaka', 'Express'].map((label) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
          >
            <div className="flex items-center gap-3">
              <SkeletonBar className="h-4 w-4 rounded-sm" />
              <span className="sr-only">{label}</span>
              <SkeletonBar className="h-4 w-28" />
            </div>
            <SkeletonBar className="h-4 w-10" />
          </div>
        ))}
      </div>
    </section>
  );
}

function CheckoutOrderGroupSkeleton() {
  return (
    <section
      aria-label="Loading order items"
      className="space-y-4 rounded-lg bg-white p-4 md:p-6"
    >
      <div className="flex items-center gap-4">
        <SkeletonBar className="h-16 w-16 shrink-0 rounded-md" />
        <div className="flex-1 space-y-2">
          <SkeletonBar className="h-5 w-3/5 max-w-xs" />
          <SkeletonBar className="h-4 w-24" />
        </div>
        <SkeletonBar className="hidden h-5 w-16 sm:block" />
      </div>
      <div className="space-y-3 border-t border-gray-100 pt-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <SkeletonBar className="h-14 w-14 shrink-0 rounded-md" />
              <div className="space-y-2">
                <SkeletonBar className="h-4 w-16" />
                <SkeletonBar className="h-3.5 w-24" />
              </div>
            </div>
            <SkeletonBar className="h-4 w-14" />
          </div>
        ))}
      </div>
    </section>
  );
}

function CheckoutSummarySkeleton() {
  return (
    <aside
      aria-label="Loading order summary"
      className="rounded-lg bg-white lg:mb-0 max-lg:pb-4"
    >
      <div className="border-b border-gray-200 p-2 text-center lg:p-4">
        <SkeletonBar className="mx-auto h-5 w-32" />
      </div>
      <div className="space-y-3 p-2 lg:p-6">
        <div className="space-y-3">
          {['Product Price', 'Shipping Charge', 'Final price'].map((label) => (
            <div
              key={label}
              className="grid grid-cols-[1fr_auto] items-center gap-2"
            >
              <span className="sr-only">{label}</span>
              <SkeletonBar className="h-4 w-28" />
              <SkeletonBar className="h-4 w-16" />
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <SkeletonBar className="h-10 flex-1 rounded-md" />
          <SkeletonBar className="h-10 w-20 rounded-md" />
        </div>

        <SkeletonBar className="hidden h-12 w-full rounded-md lg:block" />
      </div>

      <div className="pointer-events-none fixed inset-x-0 z-60 px-2 pt-1 max-md:bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] md:bottom-0 md:hidden md:pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
        <div className="pointer-events-none mx-auto max-w-3xl space-y-2 rounded-xl border border-gray-200/90 bg-white/95 p-2 shadow-lg">
          <div className="flex items-center justify-between gap-2 px-0.5">
            <SkeletonBar className="h-3.5 w-24" />
            <SkeletonBar className="h-4 w-20" />
          </div>
          <SkeletonBar className="h-10 w-full rounded-md" />
        </div>
      </div>
    </aside>
  );
}

export default function CheckoutLoadingSkeleton() {
  return (
    <div className="min-h-screen min-w-0 px-2 pb-36 pt-8 lg:pb-8">
      <div className="mx-auto grid min-w-0 grid-cols-1 gap-8 px-1 md:px-4 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <OrderFormSkeleton />
          <ShippingMethodSkeleton />
          <CheckoutOrderGroupSkeleton />
          <CheckoutOrderGroupSkeleton />
        </div>

        <CheckoutSummarySkeleton />
      </div>
    </div>
  );
}
