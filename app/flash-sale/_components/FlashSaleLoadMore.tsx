"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function FlashSaleLoadMore({
  currentPage,
  lastPage,
}: {
  currentPage: number;
  lastPage: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const hasMore = currentPage < lastPage;

  const loadMore = () => {
    if (isPending || !hasMore) return;
    startTransition(() => {
      router.push(`/flash-sale?page=${currentPage + 1}`);
    });
  };

  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={loadMore}
        disabled={isPending}
        variant="outline"
        className="border-orange-500 text-orange-500 hover:bg-orange-50"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Load More"
        )}
      </Button>
    </div>
  );
}
