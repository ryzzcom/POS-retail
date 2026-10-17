import React from "react";
import { Skeleton, SkeletonProps } from "./skeleton";

export interface LoadingSkeletonProps extends SkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({
  className,
  rows = 1,
  ...props
}: LoadingSkeletonProps) {
  if (rows > 1) {
    return (
      <div className="flex flex-col gap-2 w-full">
        {Array.from({ length: rows }).map((_, idx) => (
          <Skeleton
            key={idx}
            className={className || "h-4 w-full rounded-md"}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <Skeleton className={className || "h-4 w-full rounded-md"} {...props} />
  );
}
