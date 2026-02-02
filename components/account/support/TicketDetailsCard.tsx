import { Badge } from "@/components/ui/badge";

interface TicketDetailsCardProps {
  ticketId: string;
  category: string;
  status: string;
  manager: string;
}

export default function TicketDetailsCard({
  ticketId,
  category,
  status,
  manager,
}: TicketDetailsCardProps) {
  const getStatusBadgeColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "closed") {
      return "bg-gray-900 text-white";
    }
    return "bg-red-600 text-white";
  };

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="grid grid-cols-12 border-b last:border-b-0">
      <div className="col-span-4 md:col-span-3 bg-gray-50 px-4 py-3 text-sm text-gray-600 font-medium">
        {label}
      </div>
      <div className="col-span-8 md:col-span-9 px-4 py-3 text-sm text-gray-900">
        {value}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b">
        <h3 className="text-base font-semibold text-gray-900">
          Ticket Details
        </h3>
      </div>

      <div className="divide-y">
        <Row label="Ticket ID" value={ticketId || "N/A"} />
        <Row label="Category" value={category || "N/A"} />
        <Row
          label="Status"
          value={
            <Badge
              className={`text-xs px-3 py-1 rounded-full ${getStatusBadgeColor(
                status
              )}`}
            >
              {status || "N/A"}
            </Badge>
          }
        />
        <Row label="Manager" value={manager || "N/A"} />
      </div>
    </div>
  );
}
