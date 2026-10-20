"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/search-input";
import {
  SegmentedFilter,
  SegmentedFilterOption,
} from "@/components/ui/segmented-filter";

export interface KhataToolbarCounts {
  all?: number;
  overdue?: number;
  within_terms?: number;
  settled?: number;
}

export interface KhataToolbarProps {
  search: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  counts?: KhataToolbarCounts;
  searchPlaceholder?: string;
  className?: string;
}

/**
 * Unified Search & Status Filter Toolbar for Khata Receivables.
 * Shared between Store Owner Khata Receivables and Cashier Khata Payments views.
 */
export function KhataToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
  searchPlaceholder = "customer or phone",
  className,
}: KhataToolbarProps) {
  const filterOptions: SegmentedFilterOption[] = React.useMemo(() => {
    const opts: SegmentedFilterOption[] = [
      { label: "All accounts", value: "all", count: counts?.all },
      { label: "Overdue", value: "overdue", count: counts?.overdue },
      {
        label: "Within terms",
        value: "within_terms",
        count: counts?.within_terms,
      },
    ];

    if (counts?.settled !== undefined) {
      opts.push({
        label: "Settled",
        value: "settled",
        count: counts.settled,
      });
    }

    return opts;
  }, [counts]);

  return (
    <div
      className={cn(
        "w-full flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 select-none",
        className
      )}
    >
      {/* 1. Standardized Search Input Pill */}
      <div className="w-full sm:w-[340px] md:w-[420px] shrink-0">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          aria-label="Search Khata customer directory"
        />
      </div>

      {/* 2. Unified Filter Pills Bar */}
      <div className="overflow-x-auto no-scrollbar max-w-full flex-nowrap shrink-0 pb-1 md:pb-0">
        <SegmentedFilter
          options={filterOptions}
          value={statusFilter}
          onChange={onStatusFilterChange}
          aria-label="Filter Khata accounts by status"
        />
      </div>
    </div>
  );
}
