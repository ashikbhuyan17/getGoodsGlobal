function SkeletonBar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/80 ${className}`}
      aria-hidden
    />
  );
}

function ProductInfoBarSkeleton() {
  return (
    <header
      aria-label="Loading product header"
      className="flex w-full items-center justify-between border bg-white p-3 shadow-sm md:mt-[-7px]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SkeletonBar className="h-9 w-9 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBar className="h-4 w-4/5 max-w-md" />
          <SkeletonBar className="h-3 w-24" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <SkeletonBar className="h-8 w-8 rounded-full" />
        <SkeletonBar className="h-8 w-8 rounded-full" />
      </div>
    </header>
  );
}

function ProductGallerySkeleton() {
  return (
    <section
      aria-label="Loading product images"
      className="flex w-full flex-col gap-2 xl:flex-row"
    >
      <div className="order-2 flex gap-2 lg:order-1 lg:flex-col">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBar key={i} className="h-16 w-16 shrink-0 rounded-md" />
        ))}
      </div>
      <div className="order-1 w-full lg:order-2">
        <SkeletonBar className="mx-auto h-[min(78vw,420px)] w-full max-w-full rounded-lg sm:min-h-[260px] xl:max-h-[440px]" />
      </div>
    </section>
  );
}

function ProductOptionsSkeleton() {
  return (
    <section aria-label="Loading product options" className="w-full space-y-6">
      <div className="overflow-hidden rounded-t-md bg-gray-100">
        <div className="grid grid-cols-3 gap-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 px-4 py-6 text-center">
              <SkeletonBar className="mx-auto h-6 w-16" />
              <SkeletonBar className="mx-auto h-4 w-12" />
              <SkeletonBar className="mx-auto h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SkeletonBar className="h-4 w-28" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBar key={i} className="h-14 w-14 rounded-md" />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border-2 border-[#EEEEEE]">
        <div className="grid grid-cols-3 gap-1 p-1 py-2 sm:gap-3">
          {['Size', 'Price', 'Quantity'].map((label) => (
            <SkeletonBar key={label} className="h-9 w-full" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-3 items-center gap-2 border-t border-gray-100 px-2 py-3"
          >
            <SkeletonBar className="h-8 w-full" />
            <SkeletonBar className="mx-auto h-4 w-14" />
            <div className="flex justify-center gap-2">
              <SkeletonBar className="h-8 w-8 rounded-md" />
              <SkeletonBar className="h-4 w-6" />
              <SkeletonBar className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductSummarySkeleton() {
  return (
    <aside
      aria-label="Loading price summary"
      className="rounded-sm border bg-white px-4 py-4"
    >
      <div className="my-4 flex flex-col divide-y divide-gray-100">
        {['Quantity', 'Product price', 'Subtotal', 'Total'].map((label) => (
          <div key={label} className="flex justify-between py-2">
            <span className="sr-only">{label}</span>
            <SkeletonBar className="h-4 w-24" />
            <SkeletonBar className="h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <SkeletonBar className="h-11 w-full rounded-md" />
        <SkeletonBar className="h-11 w-full rounded-md" />
        <SkeletonBar className="h-11 w-full rounded-md" />
      </div>
    </aside>
  );
}

function ProductDescriptionSkeleton() {
  return (
    <section
      aria-label="Loading product description"
      className="rounded-sm bg-white px-4 pb-4"
    >
      <div className="flex gap-2 border-b py-3">
        {['Description', 'Reviews', 'Seller'].map((tab) => (
          <SkeletonBar key={tab} className="h-8 w-24 rounded-md" />
        ))}
      </div>
      <div className="space-y-3 py-4">
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-11/12" />
        <SkeletonBar className="h-4 w-4/5" />
        <SkeletonBar className="mt-2 h-32 w-full rounded-lg" />
      </div>
    </section>
  );
}

function ProductSuggestionsSkeleton() {
  return (
    <aside
      aria-label="Loading related products"
      className="mx-auto flex flex-col justify-center rounded-sm border bg-white p-4 text-center"
    >
      <SkeletonBar className="mx-auto h-6 w-32" />
      <div className="mt-4 flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 text-start">
            <SkeletonBar className="h-28 w-28 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <SkeletonBar className="h-5 w-24" />
              <SkeletonBar className="h-4 w-full" />
              <SkeletonBar className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function ProductLoadingSkeleton() {
  return (
    <main>
      <ProductInfoBarSkeleton />

      <div className="flex flex-col gap-2 px-2 pb-24 lg:pb-2">
        <p className="px-1 pt-3 text-center text-sm text-muted-foreground">
          Loading product details...
        </p>

        <div className="mt-4 grid w-full grid-cols-8 gap-4 rounded-sm">
          <div className="col-span-8 rounded-sm bg-white lg:col-span-6 2xl:col-span-5">
            <div className="mt-4 flex flex-col justify-between gap-4 overflow-x-hidden border-border p-2 xl:flex-row">
              <ProductGallerySkeleton />
              <ProductOptionsSkeleton />
            </div>
          </div>

          <div className="col-span-8 lg:col-span-2 2xl:col-span-3">
            <ProductSummarySkeleton />
          </div>
        </div>

        <div className="mt-4 grid w-full grid-cols-8 gap-4 rounded-sm">
          <div className="col-span-8 lg:col-span-5 xl:col-span-6">
            <ProductDescriptionSkeleton />
          </div>
          <div className="col-span-8 lg:col-span-3 xl:col-span-2">
            <ProductSuggestionsSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
