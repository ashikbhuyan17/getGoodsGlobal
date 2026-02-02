import Link from "next/link";
import {
  ChevronLeft,
  MessageSquare,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetcher } from "@/lib/fetcher";
import Replay from "@/components/tickets/Replay";

function formatDate(dt?: string) {
  if (!dt) return "N/A";
  return new Date(dt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TicketDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await fetcher(`/ticket-replay-list/${slug}`);
  const ticket = res?.data ?? [];

  if (!ticket?.length) {
    return <p className="p-6">No ticket found</p>;
  }

  return (
    <div className="min-h-screen bg-white rounded-sm p-4 md:p-8">
      <div className="space-y-6">
        {/* Back Navigation */}
        <Link
          href="/account/support"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Support
        </Link>

        {/* Ticket Header */}
        <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/30 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <span className="font-mono font-medium">{slug}</span>
                  <span>•</span>
                  <span>{ticket?.[0]?.category ?? "Ticket"}</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">
                  {ticket?.[0]?.message ?? "Ticket Conversation"}
                </CardTitle>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-lg bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1"
                >
                  {ticket?.[0]?.status ?? "Open"}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-lg bg-orange-50 text-orange-700 border-orange-100 px-3 py-1"
                >
                  {ticket?.[0]?.priority ?? "Normal"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {ticket?.[0]?.message ?? ""}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-50 pt-4">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Created on {formatDate(ticket?.[0]?.created_at)}
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                User & Support Replies
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 px-1">
            <MessageSquare className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">
              Conversation
            </h2>
          </div>

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {ticket?.map((it: any) => {
            const isAdmin = !!it?.replay;
            const text = it?.replay ?? it?.message ?? "";

            return (
              <div
                key={it?.id}
                className={`flex gap-4 ${
                  isAdmin ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                  <AvatarImage src={it?.avatar ?? "/diverse-avatars.png"} />
                  <AvatarFallback>{isAdmin ? "AG" : "US"}</AvatarFallback>
                </Avatar>

                <div
                  className={`flex flex-col max-w-[85%] ${
                    isAdmin ? "items-start" : "items-end"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-sm font-semibold text-slate-900">
                      {isAdmin ? "Support Agent" : "Client"}
                    </span>

                    {isAdmin && (
                      <Badge
                        variant="outline"
                        className="h-5 rounded-md bg-blue-50 text-blue-700 border-blue-100 text-[10px] uppercase tracking-wider font-bold"
                      >
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Agent
                      </Badge>
                    )}

                    <span className="text-[11px] text-slate-400">
                      {formatDate(it?.created_at)}
                    </span>
                  </div>

                  <Card
                    className={`rounded-2xl border-none shadow-sm overflow-hidden py-4 ${
                      isAdmin
                        ? "bg-white rounded-tl-none"
                        : "bg-slate-900 text-white rounded-tr-none"
                    }`}
                  >
                    <CardContent className="px-5 py-0">
                      <p
                        className={`text-sm leading-relaxed ${
                          isAdmin ? "text-slate-700" : "text-slate-100"
                        }`}
                      >
                        {text}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Section */}
        <Replay id={slug} />
      </div>
    </div>
  );
}
