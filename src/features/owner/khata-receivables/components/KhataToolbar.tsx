"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedFilter, SegmentedFilterOption } from "@/components/ui/segmented-filter";
import { KhataFilterOption } from "../types/khata.types";

interface KhataToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: KhataFilterOption;
  onStatusFilterChange: (filter: KhataFilterOption) => void;
  counts: {
    all: number;
    overdue: number;
    within_terms: number;
    settled: number;
  };
  className?: string;
}

export function KhataToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
  className,
}: KhataToolbarProps) {
  const filterOptions: SegmentedFilterOption[] = [
    { label: "All accounts", value: "all", count: counts.all },
    { label: "Overdue", value: "overdue", count: counts.overdue },
    { label: "Within terms", value: "within_terms", count: counts.within_terms },
    { label: "Settled", value: "settled", count: counts.settled },
  ];

  return (
    <div
      className={cn(
        "w-full flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 select-none",
        className
      )}
    >
      {/* 1. Standardized Search Input matching Figma Node 3456:49406 */}
      <div className="w-full sm:w-[320px] md:w-[440px] shrink-0">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="customer or phone"
          aria-label="Search Khata customer directory"
        />
      </div>

      {/* 2. Unified Filter Pills Bar */}
      <div className="overflow-x-auto no-scrollbar max-w-full flex-nowrap shrink-0 pb-1 md:pb-0">
        <SegmentedFilter
          options={filterOptions}
          value={statusFilter}
          onChange={(val) => onStatusFilterChange(val as KhataFilterOption)}
          aria-label="Filter Khata accounts by status"
        />
      </div>
    </div>
  );
}
