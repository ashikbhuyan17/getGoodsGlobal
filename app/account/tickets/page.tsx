import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";

// Sample Data
export default async function TicketPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tickets: any = await fetcher("/ticket-list");

  return (
    <div className="min-h-screen bg-white rounded-sm p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Support Tickets
            </h1>
            <p className="text-slate-500">
              Manage and track customer support requests.
            </p>
          </div>
          <Link href="/account/tickets/create">
            <Button>
              <Plus className="mr-2 h-5 w-5" />
              Create Ticket
            </Button>
          </Link>
        </div>

        {/* Ticket List - Table View */}
        <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="px-4">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[120px] font-semibold text-slate-600">
                    Ticket ID
                  </TableHead>
                  <TableHead className="min-w-[300px] font-semibold text-slate-600">
                    Title
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {tickets?.data?.map((ticket: any) => (
                  <TableRow
                    key={ticket?.id}
                    className="group border-slate-100 transition-colors hover:bg-slate-50/30"
                  >
                    <TableCell className="font-medium text-slate-500">
                      TICK-{ticket?.id}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/account/tickets/replay/${ticket?.ticket_id}`}
                      >
                        <span className="font-semibold text-slate-900 group-hover:text-primary transition-colors cursor-pointer">
                          {ticket?.ticketdetails?.[0]?.message?.substr(0, 50) ||
                            "No Title"}
                        </span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
