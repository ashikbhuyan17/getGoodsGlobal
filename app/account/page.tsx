import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import ProductCard from '@/components/common/ProductCard';
import StatusCards from '@/components/account/StatusCards';
import Link from 'next/link';

export default async function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wishlist: any = await fetcher('/wishlists');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dashboardOverview: any = await fetcher('/dashboard-overview');

  const pending = dashboardOverview?.data?.pendingOrders ?? 0;
  const processing = dashboardOverview?.data?.ProcessingOrders ?? 0;
  const completed = dashboardOverview?.data?.completeOrders ?? 0;

  return (
    <div className="w-full rounded space-y-4 px-2">
      {/* Status cards + Support in one div (bg, shadow); Support on right */}
      <StatusCards
        pending={pending}
        processing={processing}
        completed={completed}
        rightSlot={
          <div className="flex flex-col gap-3 h-full">
            <div className="flex items-center gap-3">
              <Image
                src="/chat-user.svg"
                width={60}
                height={60}
                alt="manager"
                className="object-contain shrink-0"
              />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-800">
                  Open a Support Ticket
                </p>
                <p className="text-xs mt-1 text-gray-500">
                  Submit issues fast and get timely support through tickets.
                </p>
              </div>
            </div>
            <Link prefetch href="/account/support/create" className="mt-auto">
              <Button className="w-full">Get Help Now</Button>
            </Link>
          </div>
        }
      />

      <div className="bg-white rounded-sm">
        {/* Favorites */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-800">Your Favorites</p>
            <Button variant="outline" className="h-7 text-xs px-3 rounded-lg">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {wishlist?.data?.map((item: any, i: number) => (
              <ProductCard
                title={item?.product?.name}
                slug={item?.product?.slug}
                image={item?.product?.image?.image}
                newPrice={item?.product?.new_price}
                oldPrice={item?.product?.old_price}
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
