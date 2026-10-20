"use client";

import {
  KhataToolbar,
} from "@/components/common/KhataToolbar";
import { CashierKhataStatusFilter } from "../types";

export interface KhataPaymentToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedStatus: CashierKhataStatusFilter;
  onStatusChange: (status: CashierKhataStatusFilter) => void;
  className?: string;
}

/**
 * Re-export wrapper for Cashier KhataPaymentToolbar pointing to unified KhataToolbar.
 */
export function KhataPaymentToolbar({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  className,
}: KhataPaymentToolbarProps) {
  return (
    <KhataToolbar
      search={search}
      onSearchChange={onSearchChange}
      statusFilter={selectedStatus}
      onStatusFilterChange={(val) => onStatusChange(val as CashierKhataStatusFilter)}
      className={className}
    />
  );
}
