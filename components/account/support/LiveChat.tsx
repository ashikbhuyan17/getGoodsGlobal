"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import ImagePreview from "@/components/common/ImagePreview";

function formatDate(dt?: string) {
  if (!dt) return "N/A";
  const date = new Date(dt);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
}

interface LiveChatProps {
  ticketId: string;
  ticket: any[];
  managerName: string;
}

export default function LiveChat({
  ticketId,
  ticket,
  managerName,
}: LiveChatProps) {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // For demo UI, just clear the message
    // In production, uncomment the API call below
    setMessage("");
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const res: any = await fetcher("/ticket-replay-submit", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     ticket_id: ticketId,
    //     message: message,
    //   }),
    // });

    // if (res?.status === true) {
    //   setMessage("");
    //   router.refresh();
    // }
  };

  // Check if message contains image URL or is an image
  const isImageMessage = (item: any) => {
    return !!item?.image;
  };

  const getImageUrl = (item: any) => {
    if (item?.image) {
      // If it's a full URL, return as is, otherwise treat as relative path
      if (item.image.startsWith("http") || item.image.startsWith("data:")) {
        return item.image;
      }
      return item.image;
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
      {/* Live Chat Header */}
      <div className="bg-teal-600 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold mb-1">Live Chat</h3>
        <p className="text-sm text-teal-100">{managerName}</p>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {ticket?.map((it: any) => {
          const isAdmin = it?.type === "admin" || !!it?.replay;
          const text = it?.replay ?? it?.message ?? "";
          const hasImage = isImageMessage(it);
          const imageUrl = hasImage ? getImageUrl(it) : null;
          const displayText = hasImage && imageUrl ? "" : text;

          return (
            <div
              key={it?.id}
              className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] ${
                  isAdmin ? "items-start" : "items-end"
                } flex flex-col`}
              >
                {/* Image Message - Right aligned for user, left for admin */}
                {hasImage && imageUrl && (
                  <div className="mb-2">
                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <ImagePreview
                        src={imageUrl}
                        alt="Chat image"
                        width={192}
                        height={192}
                        className="w-full h-full"
                      />
                    </div>
                    <p
                      className={`text-xs text-gray-500 mt-1 ${
                        isAdmin ? "text-left" : "text-right"
                      }`}
                    >
                      {formatDate(it?.created_at)}
                    </p>
                  </div>
                )}

                {/* Text Message */}
                {displayText && (
                  <div
                    className={`rounded-lg p-3 ${
                      isAdmin
                        ? "bg-teal-100 text-gray-900 rounded-tl-none"
                        : "bg-white text-gray-900 rounded-tr-none border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {displayText}
                    </p>
                    <p
                      className={`text-xs text-gray-500 mt-1 ${
                        isAdmin ? "text-left" : "text-right"
                      }`}
                    >
                      {formatDate(it?.created_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input Section */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 shrink-0 border-gray-300 hover:bg-gray-50"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border-gray-300 focus-visible:ring-teal-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
