"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  interactive = false,
  onRate = () => {},
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate(star)}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? "s" : ""}` : `${star} star${star > 1 ? "s" : ""}`}
          className={cn(
            interactive && "cursor-pointer hover:scale-105 transition-transform"
          )}
        >
          <Star
            size={interactive ? 24 : 16}
            className={cn(
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}
