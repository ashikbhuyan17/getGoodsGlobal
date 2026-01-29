import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import ProductCard from "@/components/common/ProductCard";
import Link from "next/link";
// import ProductCard from "@/components/common/ProductCard";
// import AnalyticsVisitors from "@/components/account/AnalyticsVisitors";

export default async function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wishlist: any = await fetcher("/wishlists");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dashboardOverview: any = await fetcher("/dashboard-overview");

  return (
    <div className="w-full bg-white rounded-sm">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        {/* Stats */}
        {[
          {
            name: "Pending",
            value: dashboardOverview?.data?.pendingOrders || 0,
          },
          {
            name: "Processing",
            value: dashboardOverview?.data?.ProcessingOrders || 0,
          },
          {
            name: "Completed",
            value: dashboardOverview?.data?.completeOrders || 0,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 flex gap-4 border items-center justify-between rounded-xl"
          >
            <div>
              <p className="text-lg font-medium">{item.name}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </div>
          </div>
        ))}

        {/* Manager Card */}
        <Card className="p-4 flex items-center gap-4 border rounded-xl">
          <div className="flex items-center gap-3">
            <Image
              src="/chat-user.svg"
              width={60}
              height={60}
              alt="manager"
              className="object-contain"
            />
            <div>
              <p className="font-semibold text-sm text-gray-800">
                Open a Support Ticket
              </p>
              <p className="text-xs my-2 text-gray-500">
                Submit issues fast and get timely support through tickets.
              </p>
              <Link prefetch href="/account/tickets/create">
                <Button className="w-full">Get Help Now</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Order Statistics */}
      {/* <div className="p-4">
        <p className="font-semibold text-gray-800 mb-2">Order Statistics</p>
        <div className="h-64 border rounded-xl flex items-center justify-center text-gray-400">
          <AnalyticsVisitors />
        </div>
      </div> */}

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
  );
}
