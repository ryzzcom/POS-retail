"use client";

import {
  KhataAccountsTable,
  KhataAccountsTableProps,
} from "@/components/common/KhataAccountsTable";

export type { KhataAccountsTableProps as KhataTableProps };

/**
 * Re-export wrapper for Store Owner KhataTable pointing to unified KhataAccountsTable.
 */
export function KhataTable(props: KhataAccountsTableProps) {
  return <KhataAccountsTable role="owner" {...props} />;
}
