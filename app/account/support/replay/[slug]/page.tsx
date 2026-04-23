import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TicketInfoBar from '@/components/account/support/TicketInfoBar';
import TicketDetailsCard from '@/components/account/support/TicketDetailsCard';
import LiveChat from '@/components/account/support/LiveChat';
import { Paperclip } from 'lucide-react';
import { fetcher } from '@/lib/fetcher';
import { notFound } from 'next/navigation';

function getStatusLabel(status: string) {
  return status === '1' ? 'Open' : status === '0' ? 'Closed' : status || 'N/A';
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: ticketId } = await params;
  if (!ticketId) notFound();

  const [listRes, replayRes] = await Promise.all([
    fetcher<{ status?: boolean; data?: Record<string, unknown>[] }>(
      '/ticket-list',
    ),
    fetcher<{ status?: boolean; data?: Record<string, unknown>[] }>(
      `/ticket-replay-list/${ticketId}`,
    ),
  ]);

  const ticketFromList = (listRes?.data || []).find(
    (t: Record<string, unknown>) => String(t?.ticket_id) === ticketId,
  ) as Record<string, unknown> | undefined;

  const chatData = replayRes?.data || [];



  const category = ticketFromList?.type
    ? String(ticketFromList.type)
    : 'General';
  const status = getStatusLabel(
    String(ticketFromList?.status ?? ticketFromList?.status ?? '1'),
  );
  const managerName = String(ticketFromList?.name ?? 'Support');

  const chatMessages = chatData.map((item: Record<string, unknown>) => ({
    id: item?.id,
    type:
      item?.replay != null && String(item.replay).trim() !== ''
        ? 'admin'
        : item?.replay_image != null && String(item.replay_image).trim() !== ''
          ? 'admin'
          : 'user',
    message: item?.message ?? '',
    replay: item?.replay,
    image: item?.image,
    replay_image: item?.replay_image,
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


          </div>

          <div className="space-y-6">
            <LiveChat
              ticketId={ticketId}
              ticket={chatMessages}
              managerName={managerName}
              status={status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
