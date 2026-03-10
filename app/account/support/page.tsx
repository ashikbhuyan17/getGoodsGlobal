import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Mail, Database } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

function formatDateTime(dateString: string) {
  if (!dateString) return { date: "N/A", time: "N/A" };
  try {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  } catch {
    return { date: dateString, time: "" };
  }
}

function getStatusLabel(status: string) {
  return status === "1" ? "Open" : status === "0" ? "Closed" : status || "N/A";
}

export default async function SupportPage() {
  const res = await fetcher<{ status?: boolean; data?: unknown[] }>(
    "/ticket-list",
  );
  const tickets = res?.data || [];

  return (
    <div className="w-full space-y-4 px-2">
      <div className="bg-white rounded-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Support</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and track your support tickets
              </p>
            </div>
            {/* <Link href="/account/support/create">
              <Button className="rounded px-6 py-2">
                <Plus className="mr-2 h-4 w-4" />
                Create Ticket
              </Button>
            </Link> */}
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
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2" >
                        <Database className="w-6 h-6 mx-auto my-3 text-gray-400" />
                      </div>
                      No tickets found
                    </div>
                  </td>
                </tr>
              ) : (
                (tickets as Record<string, unknown>[]).map((ticket) => {
                  const { date, time } = formatDateTime(
                    String(ticket?.created_at ?? ""),
                  );
                  const ticketId = String(ticket?.ticket_id ?? "");
                  const hasMessage = Array.isArray(ticket?.ticketdetails) && (ticket.ticketdetails as unknown[]).length > 0;
                  const statusLabel = getStatusLabel(String(ticket?.status ?? ""));
                  const action = statusLabel === "Closed" ? "View" : "Chat";

                  return (
                    <tr key={String(ticket?.id)} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <span className="font-medium">{ticketId || "N/A"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="block">{date}</span>
                        <span className="block text-xs font-medium mt-0.5 text-gray-500">
                          {time}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-500">—</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">
                          {String(ticket?.name ?? "N/A")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabel === "Closed"
                            ? "bg-gray-900 text-white"
                            : "bg-red-600 text-white"
                            }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Mail className="h-5 w-5 text-gray-400 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/account/support/replay/${ticketId}`}>
                          <Button
                            size="sm"
                            className="rounded bg-teal-600 hover:bg-teal-700 text-white"
                          >
                            {action}
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
