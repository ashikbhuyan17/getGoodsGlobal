import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Demo data following payment table UI structure
const demoRefunds = [
  { orderId: "SKY232677", date: "24/01/2026 05:26 PM", amount: 550, method: "Balance" },
  { orderId: "SKY231477", date: "20/01/2026 01:31 PM", amount: 1436, method: "Balance" },
  { orderId: "SKY236347", date: "18/01/2026 11:15 AM", amount: 570, method: "Balance" },
  { orderId: "SKY231472", date: "15/01/2026 03:42 PM", amount: 930, method: "Balance" },
  { orderId: "SKY226670", date: "12/01/2026 09:20 AM", amount: 2578, method: "Balance" },
  { orderId: "SKY201274", date: "08/01/2026 02:10 PM", amount: 2610, method: "Balance" },
  { orderId: "SKY201278", date: "05/01/2026 10:35 AM", amount: 890, method: "Balance" },
  { orderId: "SKY201275", date: "02/01/2026 04:55 PM", amount: 1200, method: "Balance" },
];

export default function RefundsPage() {
  return (
    <div className="w-full space-y-4 px-2 pb-20">
      <Card className="rounded shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-3 px-4 font-semibold">Orders</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Method</th>
                <th className="py-3 px-4 font-semibold">Info</th>
              </tr>
            </thead>

            <tbody>
              {demoRefunds.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2" />
                      No refunds found
                    </div>
                  </td>
                </tr>
              ) : (
                demoRefunds.map((refund) => (
                  <tr
                    key={refund.orderId}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/account/orders/${refund.orderId.replace("SKY", "")}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {refund.orderId}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {refund.date}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      ৳{refund.amount}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-gray-900 text-white hover:bg-gray-800 px-3 py-1 rounded-md text-xs font-medium border-0">
                        {refund.method}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-500">-</td>
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
