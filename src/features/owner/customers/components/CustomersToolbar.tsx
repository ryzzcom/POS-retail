"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import {
  CustomerFilterOption,
  CustomerSortOption,
} from "../types/customers.types";
import {
  CUSTOMER_FILTER_OPTIONS,
  CUSTOMER_SORT_OPTIONS,
} from "../constants/customers-mock";

interface CustomersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tierFilter: CustomerFilterOption;
  onTierFilterChange: (filter: CustomerFilterOption) => void;
  sortBy: CustomerSortOption;
  onSortByChange: (sort: CustomerSortOption) => void;
  className?: string;
}

export function CustomersToolbar({
  searchQuery,
  onSearchChange,
  tierFilter,
  onTierFilterChange,
  sortBy,
  onSortByChange,
  className,
}: CustomersToolbarProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 select-none",
        className
      )}
    >
      {/* 1. Search Input matching Figma Node 3411:29234 */}
      <div className="relative w-full md:w-[440px] shrink-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Name, phone or tag"
          className="w-full h-11 sm:h-12 pl-10 pr-9 rounded-xl bg-theme border border-default font-sans text-xs sm:text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-2xs"
          aria-label="Search customer directory"
        />
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none"
          aria-hidden="true"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-muted hover:text-heading hover:bg-subtle/50 transition-colors cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* 2. Right Dropdown Filters matching Figma Nodes 3411:29240 & 3411:29245 */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-full shrink-0 pb-1 md:pb-0">
        {/* Tier / Segment Filter Dropdown */}
        <Select
          options={CUSTOMER_FILTER_OPTIONS}
          value={tierFilter}
          onChange={(val) => onTierFilterChange(val as CustomerFilterOption)}
          sizeVariant="sm"
          aria-label="Filter customers by tier"
        />

        {/* Sort Metric Dropdown */}
        <Select
          options={CUSTOMER_SORT_OPTIONS}
          value={sortBy}
          onChange={(val) => onSortByChange(val as CustomerSortOption)}
          sizeVariant="sm"
          aria-label="Sort customers"
        />
      </div>
    </div>
  );
}
