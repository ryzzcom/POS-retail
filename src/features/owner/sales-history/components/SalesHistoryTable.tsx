"use client";

import {
  SalesTable,
  SalesTableProps,
  SaleRowItem,
} from "@/components/common/SalesTable";

export type { SalesTableProps, SaleRowItem };

/**
 * Re-export wrapper for Store Owner SalesHistoryTable pointing to unified SalesTable.
 */
export function SalesHistoryTable<T extends SaleRowItem = SaleRowItem>(
  props: SalesTableProps<T>
) {
  return <SalesTable showCashierColumn={true} {...props} />;
}
