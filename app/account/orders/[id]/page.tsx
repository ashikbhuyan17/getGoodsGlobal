import React from "react";
import { fetcher } from "@/lib/fetcher";
import { notFound } from "next/navigation";
import OrderInfoBar from "@/components/account/orders/OrderInfoBar";
import OrderDetailsCard from "@/components/account/orders/OrderDetailsCard";
import OrderProductDetails from "@/components/account/orders/OrderProductDetails";
import OrderPaymentsCard from "@/components/account/orders/OrderPaymentsCard";
import OrderTimeline from "@/components/account/orders/OrderTimeline";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order: any = await fetcher(`/order-track/${id}`);

  if (!order?.data || order?.data?.length < 1) {
    notFound();
  }

  const data = order?.data?.[0];
  const orderId = data?.invoice_id ? `SKY${data.invoice_id}` : `SKY${id}`;

  return (
    <div className="">
      {/* Order Info Bar */}
      <OrderInfoBar orderId={orderId} />

      <div className="py-3 px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details Card */}
            <OrderDetailsCard data={data} />

            {/* Product Details */}
            <OrderProductDetails orderDetails={data?.order_details || []} orderData={data} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payments Card */}
            <OrderPaymentsCard payment={data} />

            {/* Order Timeline */}
            <OrderTimeline timeline={data?.timeline || data?.order_status_history || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
