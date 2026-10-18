"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { SearchInput } from "@/components/ui/search-input";
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
      {/* 1. Standardized Search Input Pill (Figma Node 3411:29234) */}
      <div className="w-full md:w-[440px] shrink-0">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Name, phone or tag"
          aria-label="Search customer directory"
        />
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
