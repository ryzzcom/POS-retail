"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts";
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
    <PageHeader
      title="Sales history"
      description={
        <span>
          <span>{receiptCount} {receiptCount === 1 ? "receipt" : "receipts"}</span>
          <span className="mx-1.5">·</span>
          <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
          <span className="mx-1.5">·</span>
          <span>{formatPKR(totalAmount)}</span>
        </span>
      }
      className={className}
    />
  );
}
