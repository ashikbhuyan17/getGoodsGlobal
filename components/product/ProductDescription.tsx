import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { fetcher } from '@/lib/fetcher';
import { AddReview } from './AddReview';

export default async function ProductDescription({
  product,
  slug, // eslint-disable-line @typescript-eslint/no-unused-vars -- passed from page
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  slug: string;
}) {
  const p = product?.data?.product;

  // user + reviews in parallel (product from page)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, reviewsRes]: any[] = await Promise.all([
    fetcher('/user-profile'),
    fetcher(`/product-review-list?product_id=${p?.id}`),
  ]);

  const reviews = reviewsRes?.data?.data || [];

  // Calculate average rating
  const avg =
    reviews.length > 0
      ? reviews.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sum: number, r: any) => sum + Number(r?.ratting || 0),
        0,
      ) / reviews.length
      : 0;

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
        // disabled
        >
          Reviews
        </TabsTrigger>
      </TabsList>

      {/* SPECIFICATION */}
      <TabsContent value="spec">
        <div className="border border-gray-200 rounded-sm p-4">
          <div
            dangerouslySetInnerHTML={{
              __html: p?.short_des ?? '',
            }}
          />
        </div>
      </TabsContent>

      {/* DESCRIPTION */}
      <TabsContent value="desc">
        <div className="border border-gray-200 rounded-sm p-4">
          <div
            dangerouslySetInnerHTML={{
              __html: p?.description ?? '',
            }}
          />
        </div>
      </TabsContent>

      {/* REVIEWS */}
      <TabsContent value="reviews">
        <div className="border border-gray-200 rounded-sm p-4 space-y-6">
          {/* Header: avg rating + total + add review */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold">{avg.toFixed(1)}</span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < avg
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-500">
                {reviews?.length} {reviews?.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
            {user?.status === true && (
              <AddReview
                productId={p?.id}
                email={user?.data?.email}
                name={user?.data?.name}
              />
            )}
          </div>

          {/* Review List */}
          {reviews?.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reviews?.map((review: any, index: number) => (
              <div
                key={index}
                className="border border-gray-100 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {review?.name?.slice(0, 2)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold">{review?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{review?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < (Number(review?.ratting) || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>

                <p className="text-gray-700 mt-2">
                  {review?.review || 'No comment.'}
                </p>
              </div>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
