"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { SearchInput } from "@/components/ui/search-input";
import {
  ProductCategory,
  ProductStatus,
  ProductSortOption,
} from "../types/products-inventory.types";
import {
  CATEGORY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  SORT_FILTER_OPTIONS,
} from "../constants/products-inventory-mock";

interface ProductsInventoryToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  category: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
  status: ProductStatus;
  onStatusChange: (status: ProductStatus) => void;
  sortBy: ProductSortOption;
  onSortByChange: (sort: ProductSortOption) => void;
  lowStockOnly: boolean;
  onLowStockToggle: (checked: boolean) => void;
  className?: string;
}

export function ProductsInventoryToolbar({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  lowStockOnly,
  onLowStockToggle,
  className,
}: ProductsInventoryToolbarProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 select-none",
        className
      )}
    >
      {/* 1. Standardized Search Input Pill (Figma Node 3386:20658) */}
      <div className="w-full sm:w-[320px] lg:w-[360px] shrink-0">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Receipt no., customer or phone"
          aria-label="Search products and inventory"
        />
      </div>

      {/* 2. Filter Pills & Dropdowns (Figma Nodes 3386:20668, 3386:20677, 3386:20686) */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar max-w-full shrink-0 pb-1 lg:pb-0">
        {/* Category Dropdown Pill */}
        <Select
          options={CATEGORY_FILTER_OPTIONS}
          value={category}
          onChange={(val) => onCategoryChange(val as ProductCategory)}
          sizeVariant="pill"
          aria-label="Filter by category"
        />

        {/* Status Dropdown Pill */}
        <Select
          options={STATUS_FILTER_OPTIONS}
          value={status}
          onChange={(val) => onStatusChange(val as ProductStatus)}
          sizeVariant="pill"
          aria-label="Filter by status"
        />

        {/* Sort Dropdown Pill */}
        <Select
          options={SORT_FILTER_OPTIONS}
          value={sortBy}
          onChange={(val) => onSortByChange(val as ProductSortOption)}
          sizeVariant="pill"
          aria-label="Sort products"
        />

        {/* Low Stock Toggle Checkbox */}
        <label className="inline-flex items-center gap-2 h-11 px-3.5 sm:px-4 rounded-full bg-card/60 border border-default/40 hover:border-default transition-colors cursor-pointer select-none shrink-0 shadow-xs">
          <Checkbox
            checked={lowStockOnly}
            onChange={(e) => onLowStockToggle(e.target.checked)}
            id="low-stock-checkbox"
          />
          <span className="font-sans text-xs sm:text-sm font-medium text-heading whitespace-nowrap">
            Low stock only
          </span>
        </label>
      </div>
    </div>
  );
}
