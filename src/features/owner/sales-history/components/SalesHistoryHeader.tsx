"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/formatters";

interface SalesHistoryHeaderProps {
  receiptCount: number;
  itemCount: number;
  totalAmount: number;
  className?: string;
}

export function SalesHistoryHeader({
  receiptCount,
  itemCount,
  totalAmount,
  className,
}: SalesHistoryHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 shrink-0 select-none", className)}>
      <h1 className="font-heading font-semibold text-2xl sm:text-[28px] text-heading tracking-[-0.4px] leading-tight">
        Sales history
      </h1>
      <p className="font-sans text-xs sm:text-sm text-body leading-normal">
        <span>{receiptCount} {receiptCount === 1 ? "receipt" : "receipts"}</span>
        <span className="mx-1.5">·</span>
        <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
        <span className="mx-1.5">·</span>
        <span>{formatPKR(totalAmount)}</span>
      </p>
    </div>
  );
}
