"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
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
      {/* 1. White Pill Search Input (Figma Node 3386:20658) */}
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Receipt no., customer or phone"
          className="w-full h-11 pl-11 pr-4 rounded-full bg-card border border-default/60 font-sans text-xs sm:text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-xs transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-sans text-muted hover:text-heading cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* 2. Filter Pills & Dropdowns (Figma Nodes 3386:20668, 3386:20677, 3386:20686) */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
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
        <label className="inline-flex items-center gap-2 h-11 px-3 sm:px-4 rounded-full bg-card/60 border border-transparent hover:border-default/40 transition-colors cursor-pointer select-none">
          <Checkbox
            checked={lowStockOnly}
            onChange={(e) => onLowStockToggle(e.target.checked)}
            id="low-stock-checkbox"
          />
          <span className="font-sans text-xs sm:text-sm font-medium text-heading">
            Low stock only
          </span>
        </label>
      </div>
    </div>
  );
}
