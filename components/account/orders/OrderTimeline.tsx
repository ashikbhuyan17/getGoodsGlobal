import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineItem {
  status: string;
  date: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface OrderTimelineProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeline: any[];
}

export default function OrderTimeline({ timeline }: OrderTimelineProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    
    if (statusLower.includes("pending")) {
      return "bg-gray-500 text-white";
    }
    if (statusLower.includes("paid") || statusLower.includes("partially")) {
      return "bg-orange-500 text-white";
    }
    if (statusLower.includes("purchasing")) {
      return "bg-red-500 text-white";
    }
    if (statusLower.includes("confirmed") || statusLower.includes("ready")) {
      return "bg-gray-900 text-white";
    }
    if (statusLower.includes("completed")) {
      return "bg-green-600 text-white";
    }
    if (statusLower.includes("shipped")) {
      return "bg-gray-900 text-white";
    }
    
    return "bg-gray-500 text-white";
  };

  // If timeline is an array, use it directly; otherwise create from order data
  const timelineItems: TimelineItem[] = Array.isArray(timeline) && timeline.length > 0
    ? timeline
    : [];

  if (timelineItems.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
        <p className="text-sm text-gray-500">No timeline data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Timeline Items */}
        <div className="space-y-6">
          {timelineItems.map((item, index) => (
            <div key={index} className="relative flex items-start gap-4">
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-1">
                <Badge className={`text-xs px-2 py-1 rounded-full mb-2 ${getStatusBadgeColor(item.status || item.order_status || "")}`}>
                  {item.status || item.order_status || "N/A"}
                </Badge>
                <p className="text-xs text-gray-500">
                  {formatDate(item.created_at || item.date || item.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
