import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TicketInfoBar from "@/components/account/support/TicketInfoBar";
import TicketDetailsCard from "@/components/account/support/TicketDetailsCard";
import LiveChat from "@/components/account/support/LiveChat";
import { Paperclip } from "lucide-react";

// Demo data matching the image
const demoTicketData = {
  ticketId: "ST8861",
  category: "Wrong Product",
  status: "Open",
  manager: "谢鹏 Dora",
  issueDescription: `Pink need 4 right leg flipflops
Blue need 6 right leg flipflops
White need 50 Left leg Flipflops
Yellow Need 4 left leg flipflops`,
  chatMessages: [
    {
      id: 1,
      type: "user",
      image: "/hero-1.jpg", // Demo image - pink items
      created_at: "2026-01-17T14:06:00.000Z",
    },
    {
      id: 2,
      type: "user",
      image: "/hero-2.jpg", // Demo image - blue items
      created_at: "2026-01-17T14:06:00.000Z",
    },
    {
      id: 3,
      type: "user",
      image: "/hero-3.jpg", // Demo image - yellow items
      created_at: "2026-01-17T14:07:00.000Z",
    },
    {
      id: 4,
      type: "admin",
      message: `Dear Team, 🌿 50 pieces - White (Left side) 🌿 6 pieces - Yellow (Left side) 🌿 6 pieces - Blue (Right side) 🌿 4 pieces - Pink (Right side) The above-listed sandals parts are missing. We kindly request you to send the missing items as per the correct list. Please check the list carefully before dispatching. Thank you very much for your support and cooperation.`,
      created_at: "2026-01-17T14:14:00.000Z",
    },
  ],
};

export default function TicketDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Use demo data instead of API call
  const ticketData = demoTicketData;
  const managerName = ticketData.manager;
  const ticketId = ticketData.ticketId;
  const category = ticketData.category;
  const status = ticketData.status;
  const issueDescription = ticketData.issueDescription;

  return (
    <div className="">
      {/* Ticket Info Bar */}
      <TicketInfoBar ticketId={ticketId} />

      <div className="py-3 px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details Card */}
            <TicketDetailsCard
              ticketId={ticketId}
              category={category}
              status={status}
              manager={managerName}
            />

            {/* Issue Description Section */}
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

          {/* Right Column */}
          <div className="space-y-6">
            <LiveChat
              ticketId={ticketId}
              ticket={ticketData.chatMessages}
              managerName={managerName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
