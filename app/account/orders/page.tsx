import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";

export default async function OrdersTable() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await fetcher("/user-order-history");
  const orders = res?.data || [];

  const formatStatus = (status: string) => {
    switch (status) {
      case "1":
        return "Pending";
      case "2":
        return "Processing";
      case "3":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-start mb-4">
        <Button className="rounded-xl px-6 py-2">Select All to Pay</Button>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Products</th>
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
                    <tr
                      key={order?.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">ORD-{order?.invoice_id}</td>

                      <td className="py-3 px-4">{totalItems} items</td>

                      <td className="py-3 px-4">৳{totalPrice}</td>

                      <td className="py-3 px-4">৳{paidAmount}</td>

                      <td className="py-3 px-4">৳{dueAmount}</td>

                      <td className="py-3 px-4">
                        {formatStatus(order?.order_status)}
                      </td>

                      <td className="py-3 px-4">
                        <Link
                          prefetch
                          href={`/account/orders/${order?.invoice_id}`}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                          >
                            View
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
