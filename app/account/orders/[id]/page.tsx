import React from 'react';
import { fetcher } from '@/lib/fetcher';
import { notFound } from 'next/navigation';
import OrderInfoBar from '@/components/account/orders/OrderInfoBar';
import OrderDetailsCard from '@/components/account/orders/OrderDetailsCard';
import OrderProductDetails from '@/components/account/orders/OrderProductDetails';
import OrderPaymentsCard from '@/components/account/orders/OrderPaymentsCard';
import OrderTimeline from '@/components/account/orders/OrderTimeline';

/** Normalize API response: supports { data: [...] } or raw array */
function getOrderFromResponse(res: unknown) {
  const arr = Array.isArray(res) ? res : (res as { data?: unknown[] })?.data;
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
}

/** Normalize order-level fields; prefer shipping/status when nested objects exist */
function normalizeOrderData(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const shipping = raw?.shipping as Record<string, unknown> | undefined;
  const status = raw?.status as Record<string, unknown> | undefined;

  return {
    ...raw,
    order_status: status?.name ?? 'N/A',
    name: shipping?.name ?? 'N/A',
    phone: shipping?.phone ?? 'N/A',
    email: raw?.email ?? 'N/A',
    address: shipping?.address ?? 'N/A',
    district: shipping?.district ?? 'N/A',
    city: shipping?.city ?? 'N/A',
    country: shipping?.country ?? 'N/A',
    delivery_method: shipping?.area ?? 'N/A',
    shipping_method: shipping?.area ?? 'N/A',
    advance_payment: raw?.advance ?? raw?.paid_partial_payment_amount,
    shipping_charge: raw?.shipping_charge ?? raw?.shippingcharge,
    total_weight: raw?.total_weight ?? raw?.delivered_weight,
    delivered_weight: raw?.delivered_weight,
    payment_method:
      raw?.payment_method ?? raw?.order_type ?? 'Cash On Delivery',
    paid_partial_payment_amount:
      raw?.paid_partial_payment_amount ?? raw?.advance,
    paid_amount: raw?.paid_partial_payment_amount ?? raw?.advance,
  };
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetcher<unknown>(`/order-track/${id}`);
  const rawOrder = getOrderFromResponse(res);
  if (!rawOrder) notFound();

  const data = normalizeOrderData(
    rawOrder as Record<string, unknown>,
  ) as Record<string, unknown>;
  const orderId = data?.invoice_id
    ? `ORD-${String(data.invoice_id)}`
    : `ORD-${id}`;

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
            <OrderProductDetails
              products={
                ((data?.products as unknown[]) || []) as Record<
                  string,
                  unknown
                >[]
              }
              orderData={data}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payments Card */}
            <OrderPaymentsCard payment={data} />

            {/* Order Timeline */}
            <OrderTimeline
              timeline={
                (data?.timeline ??
                  data?.order_status_history ??
                  []) as unknown[] as Record<string, unknown>[]
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
