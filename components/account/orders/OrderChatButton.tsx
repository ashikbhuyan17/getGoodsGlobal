'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetcher } from '@/lib/fetcher';

interface OrderChatButtonProps {
  invoiceId: string | number;
}

export default function OrderChatButton({ invoiceId }: OrderChatButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOpenChat = async () => {
    if (loading) return;
    setLoading(true);
    toast.loading('Creating support ticket...');

    try {
      const data = (await fetcher('/order-ticket-store', {
        method: 'POST',
        body: JSON.stringify({ order_id: String(invoiceId) }),
      })) as {
        status?: boolean | string;
        message?: string;
        ticket?: { ticket_id?: string };
      };
      toast.dismiss();

      const ok =
        data?.status === true ||
        data?.status === 'success' ||
        (typeof data?.status === 'string' &&
          data.status.toLowerCase() === 'success');
      const ticketId = data?.ticket?.ticket_id;

      if (!ok || !ticketId) {
        toast.error(
          data?.message || 'Failed to create support ticket. Please try again.',
        );
        return;
      }

      toast.success(
        data?.message || 'Ticket created. Redirecting to chat...',
      );
      router.push(`/account/support/replay/${ticketId}`);
    } catch {
      toast.dismiss();
      toast.error('Failed to create support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded border-primary text-primary hover:bg-primary/5"
      onClick={handleOpenChat}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          Chat
        </>
      ) : (
        <>
          <MessageCircle className="mr-1 h-4 w-4" />
          Chat
        </>
      )}
    </Button>
  );
}


