"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Send } from "lucide-react";
import { useState } from "react";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

function Replay({ id }: { id: string }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSendReplay = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await fetcher("/ticket-replay-submit", {
      method: "POST",
      body: JSON.stringify({
        ticket_id: id,
        message: value,
      }),
    });
    if (res?.status === true) {
      setValue("");
      router.refresh();
    }
  };

  return (
    <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden mt-8">
      <CardHeader className="bg-slate-50/30 border-b border-slate-100">
        <CardTitle className="text-lg">Post a Reply</CardTitle>
        <CardDescription>
          Respond to the conversation or provide updates.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your message here..."
          className="min-h-[120px] rounded-xl border-slate-200 focus-visible:ring-slate-400 resize-none"
        />
      </CardContent>

      <CardFooter className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Formatting supported (Markdown)
        </p>
        <Button onClick={handleSendReplay} disabled={value.trim() === ""}>
          <Send className="mr-2 h-4 w-4" />
          Send Reply
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Replay;
