"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus } from "lucide-react";
import { submitTicketReply } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import ImagePreview from "@/components/common/ImagePreview";
import { toast } from "sonner";

const IMG_URL = process.env.NEXT_PUBLIC_IMG_URL || "";

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
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => setImageBase64(reader.result as string);
    //   reader.readAsDataURL(file);
    // }
    e.target.value = "";
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !imageBase64) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.append("ticket_id", ticketId);
      formData.append("message", message.trim() || "");
      if (uploadedImage && uploadedFile) {
        formData.append("image", uploadedFile);
        setUploadedImage(null);
        setUploadedFile(null);
      }

      const res = await submitTicketReply(formData);

      if (res?.status === true) {
        setMessage("");
        router.refresh();
        toast.success("Message sent");
      } else {
        toast.error(res?.message || "Failed to send message");
      }
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const isImageMessage = (item: Record<string, unknown>) => !!item?.image;

  const getImageUrl = (item: Record<string, unknown>) => {
    const img = item?.image;
    if (!img) return null;
    const s = String(img);
    if (s.startsWith("http") || s.startsWith("data:")) return s;
    return `${IMG_URL}/${s}`;
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
        {(ticket as Record<string, unknown>[])?.map((it) => {
          const isAdmin = it?.type === "admin" || !!it?.replay;
          const text = String(it?.replay ?? it?.message ?? "");
          const hasImage = isImageMessage(it);
          const imageUrl = hasImage ? getImageUrl(it) : null;
          const displayText = hasImage && imageUrl ? "" : text;

          return (
            <div
              key={String(it?.id ?? Math.random())}
              className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] ${isAdmin ? "items-start" : "items-end"
                  } flex flex-col`}
              >
                {/* Image Message - Right aligned for user, left for admin */}
                {hasImage && imageUrl && (
                  <div className={`rounded-lg px-2 py-1 ${isAdmin
                    ? "bg-teal-100 text-gray-900 rounded-tl-none"
                    : "bg-white text-gray-900 rounded-tr-none border border-gray-200"
                    }`}>
                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <ImagePreview
                        src={imageUrl}
                        alt="Chat image"
                        width={192}
                        height={192}
                        className="w-full h-full"
                      />
                    </div>
                    <div
                      className={`mt-1 text-sm ${isAdmin ? "text-left" : "text-right"} `}
                    >
                      <p> {text}</p>
                      <p className=" text-xs text-gray-500"> {formatDate(String(it?.created_at ?? ""))}</p>
                    </div>
                  </div>
                )}

                {/* Text Message */}
                {displayText && (
                  <div
                    className={`rounded-lg px-2 py-1 ${isAdmin
                      ? "bg-teal-100 text-gray-900 rounded-tl-none"
                      : "bg-white text-gray-900 rounded-tr-none border border-gray-200"
                      }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {String(displayText)}
                    </p>
                    <p
                      className={`text-xs text-gray-500  ${isAdmin ? "text-left" : "text-right"
                        }`}
                    >
                      {formatDate(String(it?.created_at ?? ""))}
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
        {uploadedImage && (
          <div className="mb-2 flex items-center gap-2">
            <img
              src={uploadedImage}
              alt="Preview"
              className="h-12 w-12 rounded object-cover border"
            />
            <button
              type="button"
              onClick={() => setUploadedImage(null)}
              className="text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 shrink-0 border-gray-300 hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach image"
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
            disabled={(!message.trim() && !imageBase64) || sending}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 shrink-0"
            aria-label={sending ? "Sending message" : "Send message"}
          >
            {sending ? "Sending..." : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
