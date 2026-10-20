"use client";

import {
  SalesTable,
  SalesTableProps,
} from "@/components/common/SalesTable";
import { CashierSaleItem } from "../types";

export interface MySalesTableProps {
  sales: CashierSaleItem[];
  onSelectSale: (sale: CashierSaleItem) => void;
  isLoading?: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

/**
 * Re-export wrapper for Cashier MySalesTable pointing to unified SalesTable without Cashier column.
 */
export function MySalesTable({
  sales,
  onSelectSale,
  isLoading = false,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: MySalesTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <SalesTable<CashierSaleItem>
      sales={sales}
      showCashierColumn={false}
      onSelectSale={onSelectSale}
      isLoading={isLoading}
      pagination={{
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        onPageChange,
        onPageSizeChange,
        itemLabel: "receipts",
      }}
    />
  );
}
