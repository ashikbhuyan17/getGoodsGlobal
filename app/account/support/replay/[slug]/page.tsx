import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TicketInfoBar from "@/components/account/support/TicketInfoBar";
import TicketDetailsCard from "@/components/account/support/TicketDetailsCard";
import LiveChat from "@/components/account/support/LiveChat";
import { Paperclip } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { notFound } from "next/navigation";

function getStatusLabel(status: string) {
  return status === "1" ? "Open" : status === "0" ? "Closed" : status || "N/A";
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: ticketId } = await params;
  if (!ticketId) notFound();

  const [listRes, replayRes] = await Promise.all([
    fetcher<{ status?: boolean; data?: Record<string, unknown>[] }>("/ticket-list"),
    fetcher<{ status?: boolean; data?: Record<string, unknown>[] }>(
      `/ticket-replay-list/${ticketId}`,
    ),
  ]);

  const ticketFromList = (listRes?.data || []).find(
    (t: Record<string, unknown>) => String(t?.ticket_id) === ticketId,
  ) as Record<string, unknown> | undefined;

  const chatData = replayRes?.data || [];
  const firstDetail = (ticketFromList?.ticketdetails as Record<string, unknown>[] | undefined)?.[0];
  const issueDescription = firstDetail?.message
    ? String(firstDetail.message)
    : ticketFromList?.message
      ? String(ticketFromList.message)
      : "No description";

  const category = ticketFromList?.type
    ? String(ticketFromList.type)
    : "General";
  const status = getStatusLabel(String(ticketFromList?.status ?? ticketFromList?.status ?? "1"));
  const managerName = String(ticketFromList?.name ?? "Support");

  const chatMessages = chatData.map((item: Record<string, unknown>) => ({
    id: item?.id,
    type: item?.replay ? "admin" : "user",
    message: item?.message ?? "",
    replay: item?.replay,
    image: item?.image,
    created_at: item?.created_at,
  }));

  return (
    <div className="">
      <TicketInfoBar ticketId={ticketId} />

      <div className="py-3 px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TicketDetailsCard
              ticketId={ticketId}
              category={category}
              status={status}
              manager={managerName}
            />

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4 md:p-6">
                <div className="mb-3">
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-1 rounded">
                    Issue
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                  {issueDescription}
                </p>
                <Button
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Additional Files
                </Button>
                <p className="text-xs text-gray-500 mt-2">No File attached.</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <LiveChat
              ticketId={ticketId}
              ticket={chatMessages}
              managerName={managerName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
