"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex gap-0.5", className)}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        const filled = starIndex <= rating;

        return (
          <Star
            key={starIndex}
            className={cn(
              "h-4 w-4",
              filled
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground",
              interactive && "cursor-pointer hover:text-yellow-400"
            )}
            onClick={
              interactive && onRate ? () => onRate(starIndex) : undefined
            }
          />
        );
      })}
    </div>
  );
}
