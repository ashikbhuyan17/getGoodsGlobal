import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OrderProductCell from '@/components/account/orders/OrderProductCell';
import { formatDate } from '@/hooks/format-date';
import { fetcher } from '@/lib/fetcher';
import Link from 'next/link';

export default async function OrderPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await fetcher('/user-order-history');
  const orders = res?.data || [];

  const formatStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      '1': { label: 'Pending', color: 'text-yellow-700 bg-yellow-100' },
      '2': { label: 'Processing', color: 'text-blue-700 bg-blue-100' },
      '3': { label: 'Delivered', color: 'text-green-700 bg-green-100' },
    };

    return (
      statusMap[status] || {
        label: 'Unknown',
        color: 'text-gray-500 bg-gray-100',
      }
    );
  };

  return (
    <div className="w-full space-y-4 px-2">
      <div className="flex justify-start">
        <Button className="rounded px-6 py-2">Select All to Pay</Button>
      </div>

      <Card className="rounded shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-3 px-4 font-semibold">Order ID</th>
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
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2" />
                      No orders found
                    </div>
                  </td>
                </tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                orders.map((order: any) => {
                  const totalPrice = Number(order?.amount || 0);
                  const paidAmount = Number(
                    order?.paid_partial_payment_amount || 0
                  );
                  const dueAmount = totalPrice - paidAmount;

                  const totalItems = order?.order_details?.reduce(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (sum: number, item: any) => sum + Number(item?.qty),
                    0
                  );

                  return (
                    <tr key={order?.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <span className="font-medium">
                          ORD-{order?.invoice_id}
                        </span>
                        <span className="block text-xs font-medium mt-0.5">
                          {formatDate(order?.created_at)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <OrderProductCell
                          imageUrl={
                            order?.order_details?.[0]?.product_image ?? null
                          }
                          title={
                            order?.order_details?.[0]?.product_name ?? 'Product'
                          }
                        />
                      </td>

                      <td className="py-3 px-4">৳{totalPrice}</td>

                      <td className="py-3 px-4">৳{paidAmount}</td>

                      <td className="py-3 px-4">৳{dueAmount}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${formatStatus(order?.order_status).color
                            }`}
                        >
                          {formatStatus(order?.order_status).label}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <Link
                          prefetch
                          href={`/account/orders/${order?.invoice_id}`}
                        >
                          <Button size="sm" className="rounded">
                            Details
                          </Button>
                        </Link>
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
  );
}
