import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Mail } from "lucide-react";

// Demo data matching the image
const demoTickets = [
  {
    code: "ST8879",
    date: "17/01/2026",
    time: "12:24 PM",
    order: "SKY226673",
    manager: "MOHAMMAD PARVEZ",
    status: "Closed",
    hasMessage: true,
    action: "View",
  },
  {
    code: "ST8861",
    date: "16/01/2026",
    time: "01:37 PM",
    order: "SKY226678",
    manager: "谢鹏 Dora",
    status: "Open",
    hasMessage: true,
    action: "Chat",
  },
  {
    code: "ST8193",
    date: "05/12/2025",
    time: "06:30 PM",
    order: "SKY201272",
    manager: "MOHAMMAD PARVEZ",
    status: "Closed",
    hasMessage: true,
    action: "View",
  },
  {
    code: "ST6922",
    date: "06/09/2025",
    time: "03:38 PM",
    order: "SKY148066",
    manager: "Md Kamruzzaman Shanto",
    status: "Closed",
    hasMessage: true,
    action: "View",
  },
  {
    code: "ST6647",
    date: "23/08/2025",
    time: "07:00 PM",
    order: "SKY148064",
    manager: "Feruj Mahmud",
    status: "Closed",
    hasMessage: true,
    action: "View",
  },
  {
    code: "ST6646",
    date: "23/08/2025",
    time: "06:58 PM",
    order: "SKY148059",
    manager: "Feruj Mahmud",
    status: "Closed",
    hasMessage: true,
    action: "View",
  },
  {
    code: "ST6645",
    date: "23/08/2025",
    time: "06:56 PM",
    order: "SKY148065",
    manager: "Feruj Mahmud",
    status: "Closed",
    hasMessage: true,
    action: "View",
  },
  {
    code: "ST6068",
    date: "15/07/2025",
    time: "02:41 PM",
    order: "SKY128329",
    manager: "Feruj Mahmud",
    status: "Closed",
    hasMessage: true,
    action: "View",
  },
];

export default function SupportPage() {
  return (
    <div className="w-full space-y-4 px-2">
      {/* Header Section */}
      <div className="bg-white rounded-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Support</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and track your support tickets
              </p>
            </div>
            <Link href="/account/support/create">
              <Button className="rounded px-6 py-2">
                <Plus className="mr-2 h-4 w-4" />
                Create Ticket
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Card className="rounded shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-3 px-4 font-semibold">Code</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Orders</th>
                <th className="py-3 px-4 font-semibold">Manager</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Message</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {demoTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2" />
                      No tickets found
                    </div>
                  </td>
                </tr>
              ) : (
                demoTickets.map((ticket) => (
                  <tr key={ticket.code} className="hover:bg-gray-50 transition">
                    {/* Code Column */}
                    <td className="py-3 px-4">
                      <span className="font-medium">{ticket.code}</span>
                    </td>

                    {/* Date Column */}
                    <td className="py-3 px-4">
                      <span className="block">{ticket.date}</span>
                      <span className="block text-xs font-medium mt-0.5 text-gray-500">
                        {ticket.time}
                      </span>
                    </td>

                    {/* Orders Column */}
                    <td className="py-3 px-4">
                      <Link
                        href={`/account/orders/${ticket.order.replace("SKY", "")}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {ticket.order}
                      </Link>
                    </td>

                    {/* Manager Column */}
                    <td className="py-3 px-4">
                      <span className="font-medium">{ticket.manager}</span>
                    </td>

                    {/* Status Column */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ticket.status === "Closed"
                            ? "bg-gray-900 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>

                    {/* Message Column */}
                    <td className="py-3 px-4 text-center">
                      <Mail className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>

                    {/* Action Column */}
                    <td className="py-3 px-4 text-right">
                      <Link href={`/account/support/replay/${ticket.code}`}>
                        <Button
                          size="sm"
                          className="rounded bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          {ticket.action}
                        </Button>
                      </Link>
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
