"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SegmentedFilter } from "@/components/ui/segmented-filter";
import { SearchInput } from "@/components/ui/search-input";
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
        "w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 select-none",
        className
      )}
    >
      {/* 1. Standardized Search Input Pill (Figma Node 3386:16458) */}
      <div className="w-full sm:w-[320px] lg:w-[360px] shrink-0">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Receipt no., customer or phone"
          aria-label="Search sales receipts"
        />
      </div>

      {/* 2. Payment Method Segmented Filter Pills (Figma Node 3386:16463) */}
      <div className="overflow-x-auto no-scrollbar max-w-full flex-nowrap shrink-0 pb-1 sm:pb-0">
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
