import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Base pulsing skeleton primitive styled with warm boutique surface tokens (bg-subtle/70).
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-subtle/70",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
