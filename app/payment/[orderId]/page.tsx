/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { fetcher } from '@/lib/fetcher';
import { notFound } from 'next/navigation';
import PaymentPageClient from './_components/PaymentPageClient';

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order: any = await fetcher(`/order-track/${orderId}`);

  // if (!order?.data || order.data.length < 1) {
  //   notFound();
  // }

  const orderData = order.data[0];
  const total = Number(orderData?.amount ?? 0);
  const paid = Number(orderData?.paid_partial_payment_amount ?? 0);
  const initialPayable = Math.max(0, total - paid);
  const payable = initialPayable;
  const orderLabel = orderData?.invoice_id
    ? `SKY${orderData.invoice_id}`
    : orderId
      ? `SKY${orderId}`
      : '—';
  const advance = orderData?.advance ?? '50%';
  const invoiceId = orderData?.invoice_id ?? orderId;

  return (
    <div className="min-h-screen space-y-4">
      <div className="bg-white p-3 -mt-1 flex items-center">
        <h1 className="text-lg font-bold text-gray-900">Payment</h1>
      </div>
      <div className="px-2">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Section – Order Details (server, same page) */}
          <div className="lg:col-span-3">
            <Card className="rounded shadow">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Order</th>
                      <th className="py-3 px-4 font-semibold">Total</th>
                      <th className="py-3 px-4 font-semibold">Advance</th>
                      <th className="py-3 px-4 font-semibold">Paid</th>
                      <th className="py-3 px-4 font-semibold">Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <Link
                          href={`/account/orders/${invoiceId}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {orderLabel}
                        </Link>
                      </td>
                      <td className="py-3 px-4">৳{total}</td>
                      <td className="py-3 px-4">{advance}</td>
                      <td className="py-3 px-4">৳{paid}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span>৳{payable}</span>
                          <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium inline-block w-fit">
                            ৳{payable}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Right Section – client (interactive) */}
          <PaymentPageClient initialPayable={initialPayable} />
        </div>
      </div>
    </div>
  );
}
