'use client';

import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus } from 'lucide-react';
import { submitTicketReply } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import ImagePreview from '@/components/common/ImagePreview';
import { toast } from 'sonner';

const IMG_URL = process.env.NEXT_PUBLIC_IMG_URL || '';

function formatDate(dt?: string) {
  if (!dt) return 'N/A';
  const date = new Date(dt);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
}

function ticketImagePath(val: unknown): string | null {
  if (val == null || String(val).trim() === '') return null;
  return String(val).trim();
}

/** e.g. https://next.babuei.com/public/uploads/ticket/… */
function pathToImgUrl(path: string) {
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const base = IMG_URL.replace(/\/+$/, '');
  const rel = path.replace(/^\/+/, '');
  return base ? `${base}/${rel}` : `/${rel}`;
}

interface LiveChatProps {
  ticketId: string;
  ticket: any[];
  managerName: string;
  status?: string;
}

export default function LiveChat({
  ticketId,
  ticket,
  managerName,
  status,
}: LiveChatProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const router = useRouter();
  //auto scroll to bottom
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const messagesInnerRef = useRef<HTMLDivElement>(null);
  const pinBottomUntilRef = useRef(0);

  const ticketScrollKey = useMemo(() => {
    const list = ticket as Record<string, unknown>[] | undefined;
    if (!list?.length) return '0';
    const last = list[list.length - 1];
    return `${list.length}:${String(last?.id ?? '')}:${String(last?.created_at ?? '')}`;
  }, [ticket]);
  const isTicketClosed = String(status ?? '').toLowerCase() === 'closed';

  useLayoutEffect(() => {
    const root = messagesScrollRef.current;
    if (!root) return;
    pinBottomUntilRef.current = Date.now() + 3500;
    const scrollToEnd = () => {
      root.scrollTop = root.scrollHeight;
    };
    scrollToEnd();
    const raf1 = requestAnimationFrame(() => {
      scrollToEnd();
      requestAnimationFrame(scrollToEnd);
    });
    const t1 = window.setTimeout(scrollToEnd, 0);
    const t2 = window.setTimeout(scrollToEnd, 120);
    const t3 = window.setTimeout(scrollToEnd, 400);
    const t4 = window.setTimeout(scrollToEnd, 900);
    return () => {
      cancelAnimationFrame(raf1);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [ticketScrollKey]);

  useLayoutEffect(() => {
    const root = messagesScrollRef.current;
    const inner = messagesInnerRef.current;
    if (!root || !inner) return;
    const scrollToEndIfPinned = () => {
      const scrollToEnd = () => {
        root.scrollTop = root.scrollHeight;
      };
      if (Date.now() < pinBottomUntilRef.current) {
        scrollToEnd();
        return;
      }
      const dist = root.scrollHeight - root.scrollTop - root.clientHeight;
      if (dist < 100) scrollToEnd();
    };
    const ro = new ResizeObserver(scrollToEndIfPinned);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSendMessage = async () => {
    if (isTicketClosed) return;
    if (!message.trim() && !uploadedFile) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('ticket_id', ticketId);
      formData.append('message', message.trim() || '');
      if (uploadedImage && uploadedFile) {
        formData.append('image', uploadedFile);
        setUploadedImage(null);
        setUploadedFile(null);
      }

      const res = await submitTicketReply(formData);

      if (res?.status === true) {
        setMessage('');
        router.refresh();
        toast.success('Message sent');
      } else {
        toast.error(res?.message || 'Failed to send message');
      }
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
      {/* Live Chat Header */}
      <div className="bg-teal-600 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold mb-1">Live Chat</h3>
        <p className="text-sm text-teal-100">{managerName}</p>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={messagesScrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-gray-50"
      >
        <div ref={messagesInnerRef} className="space-y-4">
          {(ticket as Record<string, unknown>[])?.map((it) => {
            const isAdmin =
              it?.type === 'admin' ||
              !!String(it?.replay ?? '').trim() ||
              !!ticketImagePath(it?.replay_image);

            const userMessage = String(it?.message ?? '');
            const adminReply = String(it?.replay ?? '');

            const userImgPath = ticketImagePath(it?.image);
            const replyImgPath = ticketImagePath(it?.replay_image);

            const hasUserImage = !isAdmin && userImgPath !== null;
            const hasReplyImage = isAdmin && replyImgPath !== null;

            const userImageUrl =
              hasUserImage && userImgPath ? pathToImgUrl(userImgPath) : null;
            const replyImageUrl =
              hasReplyImage && replyImgPath ? pathToImgUrl(replyImgPath) : null;

            const showUserTextOnly = !hasUserImage && !!userMessage.trim();
            const showAdminTextOnly = !hasReplyImage && !!adminReply.trim();

            return (
              <div
                key={String(it?.id ?? Math.random())}
                className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[75%] ${
                    isAdmin ? 'items-start' : 'items-end'
                  } flex flex-col gap-1`}
                >
                  {/* Customer: `image` + `message` */}
                  {!isAdmin && hasUserImage && userImageUrl && (
                    <div className="rounded-lg px-2 py-1 bg-white text-gray-900 rounded-tr-none border border-gray-200">
                      <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200 bg-white">
                        <ImagePreview
                          src={userImageUrl}
                          alt="Your attachment"
                          width={192}
                          height={192}
                          className="w-full h-full"
                        />
                      </div>
                      {!!userMessage.trim() && (
                        <p className="mt-1 text-sm text-right whitespace-pre-wrap">
                          {userMessage}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 text-right mt-1">
                        {formatDate(String(it?.created_at ?? ''))}
                      </p>
                    </div>
                  )}

                  {!isAdmin && showUserTextOnly && (
                    <div className="rounded-lg px-2 py-1 bg-white text-gray-900 rounded-tr-none border border-gray-200">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {userMessage}
                      </p>
                      <p className="text-xs text-gray-500 text-right">
                        {formatDate(String(it?.created_at ?? ''))}
                      </p>
                    </div>
                  )}

                  {/* Manager: `replay_image` + `replay` */}
                  {isAdmin && hasReplyImage && replyImageUrl && (
                    <div className="rounded-lg px-2 py-1 bg-teal-100 text-gray-900 rounded-tl-none">
                      <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200 bg-white">
                        <ImagePreview
                          src={replyImageUrl}
                          alt="Manager attachment"
                          width={192}
                          height={192}
                          className="w-full h-full"
                        />
                      </div>
                      {!!adminReply.trim() && (
                        <p className="mt-1 text-sm text-left whitespace-pre-wrap">
                          {adminReply}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 text-left mt-1">
                        {formatDate(String(it?.created_at ?? ''))}
                      </p>
                    </div>
                  )}

                  {isAdmin && showAdminTextOnly && (
                    <div className="rounded-lg px-2 py-1 bg-teal-100 text-gray-900 rounded-tl-none">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {adminReply}
                      </p>
                      <p className="text-xs text-gray-500 text-left">
                        {formatDate(String(it?.created_at ?? ''))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
              onClick={() => {
                setUploadedImage(null);
                setUploadedFile(null);
              }}
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
            disabled={isTicketClosed}
            aria-label="Attach image"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isTicketClosed}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border-gray-300 focus-visible:ring-teal-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isTicketClosed || (!message.trim() && !uploadedFile) || sending}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 shrink-0"
            aria-label={sending ? 'Sending message' : 'Send message'}
          >
            {sending ? 'Sending...' : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
