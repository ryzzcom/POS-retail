"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SegmentedFilter } from "@/components/ui/segmented-filter";
import { PaymentMethod } from "../types/sales-history.types";
import { PAYMENT_METHOD_FILTER_OPTIONS } from "../constants/sales-history-mock";

interface SalesHistoryToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  className?: string;
}

export function SalesHistoryToolbar({
  searchQuery,
  onSearchChange,
  selectedMethod,
  onMethodChange,
  className,
}: SalesHistoryToolbarProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 select-none",
        className
      )}
    >
      {/* 1. Search Input Pill (Figma Node 3386:16458) */}
      <div className="relative w-full sm:w-[400px] lg:w-[440px] shrink-0">
        <div className="h-[48px] bg-theme border border-default/40 rounded-[22px] px-3.5 flex items-center gap-2.5 shadow-xs transition-colors focus-within:border-primary">
          <Search className="size-5 text-muted shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Receipt no., customer or phone"
            className="w-full font-sans text-sm text-heading placeholder:text-muted bg-transparent outline-none"
            aria-label="Search sales receipts"
          />
        </div>
      </div>

      {/* 2. Payment Method Segmented Filter Pills (Figma Node 3386:16463) */}
      <div className="overflow-x-auto pb-1 lg:pb-0">
        <SegmentedFilter
          options={PAYMENT_METHOD_FILTER_OPTIONS}
          value={selectedMethod}
          onChange={(val) => onMethodChange(val as PaymentMethod)}
          aria-label="Filter receipts by payment method"
        />
      </div>
    </div>
  );
}
