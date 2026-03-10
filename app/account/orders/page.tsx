import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OrderProductCell from '@/components/account/orders/OrderProductCell';
import { formatDate } from '@/hooks/format-date';
import { fetcher } from '@/lib/fetcher';
import Link from 'next/link';
import OrdersTopBar from '@/components/account/orders/OrdersTopBar';
import { Database } from 'lucide-react';
import OrderChatButton from '@/components/account/orders/OrderChatButton';

function buildOrdersSlug(status?: string, keyword?: string): string {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (keyword?.trim()) params.set('keyword', keyword.trim());
  const qs = params.toString();
  return `/user-order-history${qs ? `?${qs}` : ''}`;
}

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; keyword?: string }>;
}) {
  const params = await searchParams;

  const [statusRes, ordersRes] = await Promise.all([
    fetcher<{
      data?: { id: number; name: string; slug: string; status: string }[];
    }>('/order-status', { cache: 'no-store' }),
    fetcher<{ data?: unknown[] }>(
      buildOrdersSlug(params.status, params.keyword),
      { cache: 'no-store' },
    ),
  ]);

  const orderStatuses = statusRes?.data || [];
  const orders = ordersRes?.data || [];

  const statusMap = Object.fromEntries(
    orderStatuses.map((s) => [String(s.id), s.name]),
  );

  const formatStatus = (status: string | number) => {
    const label = statusMap[String(status)] ?? 'Unknown';
    const colorMap: Record<string, string> = {
      '1': 'text-yellow-700 bg-yellow-100',
      '2': 'text-blue-700 bg-blue-100',
      '3': 'text-green-700 bg-green-100',
      '6': 'text-green-700 bg-green-100',
      '9': 'text-green-700 bg-green-100',
      '4': 'text-red-700 bg-red-100',
      '22': 'text-blue-700 bg-blue-100',
    };
    const color = colorMap[String(status)] ?? 'text-gray-500 bg-gray-100';
    return { label, color };
  };

  return (
    <div className="w-full space-y-4 pb-20">
      <OrdersTopBar orderStatuses={orderStatuses} />

      <div className="px-2">
        <Card className="rounded shadow">
          {/* <div className="px-2">
            <Button className="rounded px-6 py-2">Select All to Pay</Button>
          </div> */}
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Invoice ID</th>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Paid</th>
                  <th className="py-3 px-4 font-semibold">Due</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2">
                          <Database className="w-6 h-6 mx-auto my-3 text-gray-400" />
                        </div>
                        No orders found
                      </div>
                    </td>
                  </tr>
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  orders.map((order: any) => {
                    const totalPrice = Number(order?.amount || 0);
                    const paidAmount = Number(
                      order?.paid_partial_payment_amount || 0,
                    );
                    const dueAmount =
                      order?.payment_due_amount != null
                        ? Number(order.payment_due_amount)
                        : totalPrice - paidAmount;

                    const firstItem = order?.order_details?.[0];
                    const status = formatStatus(order?.order_status ?? '');
                    const isPartiallyPaid = status.label
                      ?.toLowerCase()
                      .includes('partially');

                    return (
                      <tr
                        key={order?.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium">
                            {order?.invoice_id}
                          </span>
                          <span className="block text-xs font-medium mt-0.5 text-gray-500">
                            {formatDate(order?.created_at)}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <OrderProductCell
                            imageUrl={firstItem?.product_color_image ?? null}
                            title={firstItem?.product_name ?? 'Product'}
                          />
                        </td>

                        <td className="py-3 px-4">৳{totalPrice}</td>

                        <td className="py-3 px-4">৳{paidAmount}</td>

                        <td className="py-3 px-4">৳{dueAmount}</td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {paidAmount <= 0 && (
                              <Link
                                prefetch
                                href={`/payment/${order?.invoice_id}`}
                              >
                                <Button
                                  size="sm"
                                  className="rounded bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Pay
                                </Button>
                              </Link>
                            )}

                            <Link
                              prefetch
                              href={`/account/orders/${order?.invoice_id}`}
                            >
                              <Button size="sm" className="rounded">
                                Details
                              </Button>
                            </Link>
                            {isPartiallyPaid && (
                              <OrderChatButton invoiceId={order?.invoice_id} />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
