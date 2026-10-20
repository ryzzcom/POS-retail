"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  SegmentedFilter,
  SegmentedFilterOption,
} from "@/components/ui/segmented-filter";
import { SearchInput } from "@/components/ui/search-input";

export const DEFAULT_PAYMENT_METHOD_OPTIONS: SegmentedFilterOption[] = [
  { label: "All methods", value: "all" },
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
  { label: "Bank transfer", value: "bank_transfer" },
  { label: "Wallet", value: "wallet" },
  { label: "Khata credit", value: "khata_credit" },
];

export interface SalesToolbarProps {
  search: string;
  onSearchChange: (query: string) => void;
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  options?: SegmentedFilterOption[];
  searchPlaceholder?: string;
  className?: string;
}

/**
 * Standardized Search & Payment Method Filter Toolbar.
 * Shared across Store Owner Sales History and Cashier My Sales views.
 */
export function SalesToolbar({
  search,
  onSearchChange,
  selectedMethod,
  onMethodChange,
  options = DEFAULT_PAYMENT_METHOD_OPTIONS,
  searchPlaceholder = "Receipt no., customer or phone",
  className,
}: SalesToolbarProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 select-none",
        className
      )}
    >
      {/* Search Input Pill */}
      <div className="w-full sm:w-[340px] md:w-[420px] shrink-0">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          aria-label="Search sales receipts"
        />
      </div>

      {/* Payment Method Segmented Filter Pills */}
      <div className="overflow-x-auto no-scrollbar max-w-full flex-nowrap shrink-0 pb-1 sm:pb-0">
        <SegmentedFilter
          options={options}
          value={selectedMethod}
          onChange={onMethodChange}
          aria-label="Filter receipts by payment method"
        />
      </div>
    </div>
  );
}
