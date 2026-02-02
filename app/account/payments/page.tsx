import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ImagePreview from "@/components/common/ImagePreview";

// Demo data matching the image
const demoPayments = [
  {
    paymentId: "SP1769848937483",
    date: "31/01/2026 02:42 PM",
    orders: [
      { orderId: "SKY251721", amount: 1575 },
    ],
    amount: 1575,
    method: "Bank",
    status: "Approved",
  },
  {
    paymentId: "SP1769800166778",
    date: "31/01/2026 01:09 AM",
    orders: [
      { orderId: "SKY251247", amount: 573 },
      { orderId: "SKY251298", amount: 550 },
      { orderId: "SKY251299", amount: 1147 },
      { orderId: "SKY251300", amount: 545 },
      { orderId: "SKY251301", amount: 618 },
      { orderId: "SKY251302", amount: 551 },
      { orderId: "SKY251303", amount: 560 },
      { orderId: "SKY251304", amount: 608 },
      { orderId: "SKY251305", amount: 1031 },
      { orderId: "SKY251306", amount: 518 },
      { orderId: "SKY251307", amount: 1359 },
      { orderId: "SKY251308", amount: 1164 },
      { orderId: "SKY251311", amount: 501 },
    ],
    amount: 9357,
    method: "Bank",
    status: "Approved",
  },
  {
    paymentId: "SP1769799525316",
    date: "31/01/2026 12:58 AM",
    orders: [
      { orderId: "SKY251298", amount: 550 },
      { orderId: "SKY251299", amount: 1147 },
      { orderId: "SKY251300", amount: 545 },
      { orderId: "SKY251301", amount: 618 },
      { orderId: "SKY251302", amount: 551 },
      { orderId: "SKY251303", amount: 560 },
      { orderId: "SKY251304", amount: 604 },
      { orderId: "SKY251305", amount: 1031 },
      { orderId: "SKY251306", amount: 518 },
    ],
    amount: 6124,
    method: "Balance",
    status: "Approved",
  },
];

export default function PaymentsPage() {
  return (
    <div className="w-full space-y-4 px-2 pb-20">
      <Card className="rounded shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-3 px-4 font-semibold">Payment ID</th>
                <th className="py-3 px-4 font-semibold">Orders</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Method</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {demoPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2" />
                      No payments found
                    </div>
                  </td>
                </tr>
              ) : (
                demoPayments.map((payment) => (
                  <tr key={payment.paymentId} className="hover:bg-gray-50 transition">
                    {/* Payment ID Column */}
                    <td className="py-3 px-4">
                      <Link
                        href={`/account/payments/${payment.paymentId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {payment.paymentId}
                      </Link>
                      <span className="block text-xs font-medium mt-0.5 text-gray-500">
                        {payment.date}
                      </span>
                    </td>

                    {/* Orders Column */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-0.5">
                        {payment.orders.map((order, index) => (
                          <Link
                            key={index}
                            href={`/account/orders/${order.orderId.replace("SKY", "")}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                          >
                            {order.orderId} - ৳{order.amount}
                          </Link>
                        ))}
                      </div>
                    </td>

                    {/* Amount Column */}
                    <td className="py-3 px-4">৳{payment.amount}</td>

                    {/* Method Column */}
                    <td className="py-3 px-4">
                      {payment.method === "Bank" ? (
                        <div className="flex flex-col items-start gap-1.5">
                          <ImagePreview
                            src="/placeholder-product.png"
                            alt="Bank Receipt"
                            width={32}
                            height={32}
                            className="shrink-0 rounded"
                          />
                          <Badge className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-md text-xs font-medium border-0">
                            Bank
                          </Badge>
                        </div>
                      ) : (
                        <Badge className="bg-gray-900 text-white hover:bg-gray-800 px-3 py-1 rounded-md text-xs font-medium border-0">
                          Balance
                        </Badge>
                      )}
                    </td>

                    {/* Status Column */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded text-sm font-medium bg-green-600 text-white">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
