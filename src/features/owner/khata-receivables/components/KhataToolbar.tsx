"use client";

import {
  KhataToolbar as UnifiedKhataToolbar,
  KhataToolbarProps as UnifiedKhataToolbarProps,
} from "@/components/common/KhataToolbar";
import { KhataFilterOption } from "../types/khata.types";

export interface KhataToolbarProps {
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

/**
 * Re-export wrapper for Store Owner KhataToolbar pointing to unified KhataToolbar.
 */
export function KhataToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
  className,
}: KhataToolbarProps) {
  return (
    <UnifiedKhataToolbar
      search={searchQuery}
      onSearchChange={onSearchChange}
      statusFilter={statusFilter}
      onStatusFilterChange={(val) => onStatusFilterChange(val as KhataFilterOption)}
      counts={counts}
      className={className}
    />
  );
}
