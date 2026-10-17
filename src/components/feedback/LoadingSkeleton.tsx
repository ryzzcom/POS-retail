import React from "react";

export interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return <div className={className}>Loading...</div>;
}
