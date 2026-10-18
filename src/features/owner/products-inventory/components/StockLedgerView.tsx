"use client";

import * as React from "react";
import { History } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockLedgerViewProps {
  className?: string;
}

export function StockLedgerView({ className }: StockLedgerViewProps) {
  return (
    <div
      className={cn(
        "w-full bg-card rounded-[22px] border border-default/50 p-12 sm:p-16 text-center shadow-xs flex flex-col items-center justify-center select-none",
        className
      )}
    >
      <div className="size-12 rounded-full bg-subtle/50 flex items-center justify-center text-muted mb-3">
        <History className="size-6 text-muted" />
      </div>
      <p className="font-sans text-xs sm:text-sm text-body max-w-md leading-relaxed">
        No stock movements yet. Sales, receiving, returns and adjustments appear here.
      </p>
    </div>
  );
}
