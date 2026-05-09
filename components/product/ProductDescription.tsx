import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Store } from 'lucide-react';
import { fetcher } from '@/lib/fetcher';
import { AddReview } from './AddReview';

function formatReviewDate(iso: string | undefined): string | null {
  if (!iso || typeof iso !== 'string') return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function normalizeFeedback(raw: unknown): string {
  if (typeof raw === 'string') return raw.trim();
  if (raw != null && raw !== '') return String(raw).trim();
  return '';
}

function StarRow({
  value,
  size = 16,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const rounded = Math.min(5, Math.max(0, Math.round(Number(value) || 0)));
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={label ?? `${rounded} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < rounded
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-100 text-gray-200'
          }
        />
      ))}
    </div>
  );
}

export default async function ProductDescription({
  product,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  slug: string;
}) {
  const p = product?.data?.product;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, reviewsRes]: any[] = await Promise.all([
    fetcher('/user-profile'),
    fetcher(`/product-review-list?product_id=${p?.id}`),
  ]);

  const rawList = reviewsRes?.data?.data || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviews = [...rawList].sort((a: any, b: any) => {
    const ta = new Date(a?.created_at || 0).getTime();
    const tb = new Date(b?.created_at || 0).getTime();
    return tb - ta;
  });

  const avg =
    reviews.length > 0
      ? reviews.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sum: number, r: any) => sum + Number(r?.ratting || 0),
          0,
        ) / reviews.length
      : 0;

  const avgStarsRounded = Math.min(5, Math.max(0, Math.round(avg)));

  return (
    <Tabs defaultValue="spec" className="mt-4 w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          value="spec"
        >
          Specification
        </TabsTrigger>

        <TabsTrigger
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          value="desc"
        >
          Description
        </TabsTrigger>

        <TabsTrigger
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          value="reviews"
        >
          Reviews
          {reviews.length > 0 ? (
            <span className="ml-1.5 rounded-full bg-gray-200/80 px-2 py-0.5 text-[11px] font-medium text-gray-700 tabular-nums data-[state=active]:bg-primary-foreground/20 data-[state=active]:text-primary-foreground">
              {reviews.length}
            </span>
          ) : null}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="spec" className="w-full">
        <div className="w-full rounded-sm border border-gray-200 p-4">
          <div
            className="w-full max-w-full overflow-x-auto wrap-break-word [&_img]:h-auto [&_img]:max-w-full [&_img]:object-contain [&_table]:w-full [&_iframe]:max-w-full"
            dangerouslySetInnerHTML={{
              __html: p?.short_des ?? '',
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="desc" className="w-full">
        <div className="w-full rounded-sm border border-gray-200 p-4">
          <div
            className="w-full max-w-full overflow-x-auto wrap-break-word [&_img]:h-auto [&_img]:max-w-full [&_img]:object-contain [&_table]:w-full [&_iframe]:max-w-full"
            dangerouslySetInnerHTML={{
              __html: p?.description ?? '',
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="outline-none">
        <div className="rounded-2xl border border-gray-200/90 bg-linear-to-b from-gray-50/80 to-white p-4 sm:p-6 shadow-sm">
          {/* Summary */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
            <div className="flex flex-1 flex-col gap-5 sm:flex-row sm:items-center">
              <div
                className="flex h-21 w-21 shrink-0 flex-col items-center justify-center rounded-2xl border border-amber-100/80 bg-linear-to-br from-amber-50 to-orange-50/60 shadow-sm"
                aria-hidden
              >
                <span className="text-[2rem] font-bold leading-none tracking-tight text-gray-900 tabular-nums">
                  {reviews.length > 0 ? avg.toFixed(1) : '—'}
                </span>
                <StarRow
                  value={avgStarsRounded}
                  size={12}
                  label={`Average ${avg.toFixed(1)} out of 5`}
                />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-base font-semibold text-gray-900">
                  Customer reviews
                </p>
                <StarRow
                  value={avgStarsRounded}
                  size={18}
                  label={`Average ${avg.toFixed(1)} out of 5 stars`}
                />
                <p className="text-sm text-gray-600">
                  {reviews.length === 0
                    ? 'No reviews yet — be the first to share your experience.'
                    : `Based on ${reviews.length} verified ${
                        reviews.length === 1 ? 'review' : 'reviews'
                      }.`}
                </p>
              </div>
            </div>
            {user?.status === true && (
              <div className="flex shrink-0 items-start lg:border-l lg:border-gray-200/80 lg:pl-8">
                <AddReview
                  productId={p?.id}
                  email={user?.data?.email}
                  name={user?.data?.name}
                />
              </div>
            )}
          </div>

          <div className="my-8 h-px w-full bg-gray-200/70" />

          {/* List */}
          {reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 text-center">
              <p className="text-sm font-medium text-gray-900">
                No reviews yet
              </p>
              <p className="mt-1 text-sm text-gray-600">
                When customers leave feedback, it will appear here with any
                seller responses.
              </p>
            </div>
          ) : (
            <ul className="m-0 list-none space-y-0 divide-y divide-gray-100 p-0">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {reviews.map((review: any, index: number) => {
                const feedbackText = normalizeFeedback(review?.feedback);
                const hasFeedback = feedbackText.length > 0;
                const displayName = review?.name?.trim() || 'Customer';
                const initials =
                  displayName
                    .split(/\s+/)
                    .map((w: string) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || 'C';
                const dateLabel = formatReviewDate(review?.created_at);
                const ratingNum = Number(review?.ratting) || 0;

                return (
                  <li
                    key={review?.id ?? index}
                    className="py-8 first:pt-2 last:pb-0"
                  >
                    <article className="flex gap-4 sm:gap-5">
                      <Avatar className="h-11 w-11 shrink-0 ring-2 ring-white shadow-md sm:h-12 sm:w-12">
                        <AvatarFallback className="bg-gray-100 text-sm font-semibold text-gray-700">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1 space-y-3">
                        <header className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 sm:gap-y-0">
                          <h3 className="text-base font-semibold text-gray-900">
                            {displayName}
                          </h3>
                          {dateLabel ? (
                            <time
                              className="text-xs text-gray-500"
                              dateTime={review?.created_at}
                            >
                              {dateLabel}
                            </time>
                          ) : null}
                        </header>

                        <StarRow
                          value={ratingNum}
                          size={15}
                          label={`${ratingNum} out of 5 stars`}
                        />

                        <blockquote className="m-0 border-0 p-0 text-[15px] leading-7 text-gray-800">
                          {review?.review?.trim() ? (
                            review.review.trim()
                          ) : (
                            <span className="text-gray-400 italic">
                              No written comment.
                            </span>
                          )}
                        </blockquote>

                        {hasFeedback ? (
                          <div className="relative pt-1">
                            <div
                              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                              role="region"
                              aria-label="Seller response"
                            >
                              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/90 px-4 py-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white">
                                  <Store
                                    className="h-3.5 w-3.5"
                                    strokeWidth={2}
                                    aria-hidden
                                  />
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                                    Seller response
                                  </p>
                                  <p className="text-[11px] text-gray-500">
                                    Official reply from the store
                                  </p>
                                </div>
                              </div>
                              <div className="px-4 py-4 sm:px-5">
                                <p className="text-sm leading-7 text-gray-800">
                                  {feedbackText}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
