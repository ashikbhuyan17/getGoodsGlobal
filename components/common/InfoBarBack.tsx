"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function InfoBarBack() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      size="icon"
      className="rounded-full w-8 h-8"
    >
      <ArrowLeft className="w-4 h-4" />
    </Button>
  );
}

export default InfoBarBack;
