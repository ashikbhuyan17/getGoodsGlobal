import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DeliveryTopBar from '@/components/account/delivery/DeliveryTopBar';

// Demo data matching the image
const demoDeliveries = [
  {
    invoice: 'SD1770031409618',
    date: '02/02/2026',
    time: '05:23 PM',
    orders: 'SKY243412',
    method: 'Steadfast',
    amount: 2134,
    paid: 0,
    due: 2134,
  },
  {
    invoice: 'SD1770031409619',
    date: '03/02/2026',
    time: '10:15 AM',
    orders: 'SKY243413',
    method: 'Steadfast',
    amount: 3500,
    paid: 1500,
    due: 2000,
  },
  {
    invoice: 'SD1770031409620',
    date: '04/02/2026',
    time: '02:45 PM',
    orders: 'SKY243414',
    method: 'Steadfast',
    amount: 1800,
    paid: 1800,
    due: 0,
  },
];

export default function DeliveryPage() {
  return (
    <div className="w-full space-y-4 pb-20">
      {/* Top Bar */}
      <DeliveryTopBar />

      <div className="px-2">
        <Card className="rounded shadow">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Invoice</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Orders</th>
                  <th className="py-3 px-4 font-semibold">Method</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Paid</th>
                  <th className="py-3 px-4 font-semibold">Due</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {demoDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2" />
                        No deliveries found
                      </div>
                    </td>
                  </tr>
                ) : (
                  demoDeliveries.map((delivery) => (
                    <tr
                      key={delivery.invoice}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Invoice Column */}
                      <td className="py-3 px-4">
                        <Link
                          href={`/account/delivery/${delivery.invoice}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {delivery.invoice}
                        </Link>
                      </td>

                      {/* Date Column */}
                      <td className="py-3 px-4">
                        <span className="block">{delivery.date}</span>
                        <span className="block text-xs text-gray-500">
                          {delivery.time}
                        </span>
                      </td>

                      {/* Orders Column */}
                      <td className="py-3 px-4">
                        <Link
                          href={`/account/orders/${delivery.orders.replace('SKY', '')}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {delivery.orders}
                        </Link>
                      </td>

                      {/* Method Column */}
                      <td className="py-3 px-4">
                        <Badge className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded-md text-xs font-medium border-0">
                          {delivery.method}
                        </Badge>
                      </td>

                      {/* Amount Column */}
                      <td className="py-3 px-4">৳{delivery.amount}</td>

                      {/* Paid Column */}
                      <td className="py-3 px-4">৳{delivery.paid}</td>

                      {/* Due Column */}
                      <td className="py-3 px-4">৳{delivery.due}</td>

                      {/* Action Column */}
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 text-white rounded px-3 py-1 text-xs"
                          >
                            Pay
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded px-3 py-1 text-xs"
                          >
                            Invoice
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-xs"
                          >
                            Request
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button className="p-2 rounded hover:bg-gray-100 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button className="bg-teal-600 text-white px-4 py-2 rounded text-sm font-medium">
            1
          </button>
          <button className="p-2 rounded hover:bg-gray-100 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
