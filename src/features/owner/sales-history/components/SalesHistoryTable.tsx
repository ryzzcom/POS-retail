"use client";

import * as React from "react";
import { formatPKR } from "@/lib/formatters";
import {
  DataTable,
  ColumnDef,
  TablePaginationConfig,
} from "@/components/data-display";
import { Badge } from "@/components/ui/badge";
import { ReceiptSummary } from "../types/sales-history.types";

interface SalesHistoryTableProps {
  receipts: ReceiptSummary[];
  pagination?: TablePaginationConfig;
  onSelectReceipt?: (receipt: ReceiptSummary) => void;
  isLoading?: boolean;
  className?: string;
}

export function SalesHistoryTable({
  receipts,
  pagination,
  onSelectReceipt,
  isLoading = false,
  className,
}: SalesHistoryTableProps) {
  const columns: ColumnDef<ReceiptSummary>[] = React.useMemo(
    () => [
      {
        id: "receipt",
        header: "Receipt",
        align: "left",
        width: "20%",
        cell: (item) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-sm text-heading font-normal tracking-tight">
              {item.receiptNumber}
            </span>
            <div className="flex items-center gap-1.5 font-sans text-xs text-body">
              <span>{item.time}</span>
              <span
                className="size-1 rounded-full bg-body/40"
                aria-hidden="true"
              />
              <span>
                {item.itemCount} {item.itemCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "customer",
        header: "Customer",
        align: "center",
        width: "18%",
        cell: (item) => (
          <span className="font-sans text-sm text-heading font-normal">
            {item.customerName}
          </span>
        ),
      },
      {
        id: "paidBy",
        header: "Paid by",
        align: "center",
        width: "15%",
        cell: (item) => (
          <span className="font-sans text-sm text-heading font-normal">
            {item.paymentMethodLabel}
          </span>
        ),
      },
      {
        id: "cashier",
        header: "Cashier",
        align: "center",
        width: "17%",
        cell: (item) => (
          <span className="font-sans text-sm text-heading font-normal">
            {item.cashierName}
          </span>
        ),
      },
      {
        id: "whatsapp",
        header: "WhatsApp",
        align: "center",
        width: "15%",
        cell: (item) => {
          switch (item.whatsappStatus) {
            case "failed":
              return <Badge variant="failed">Failed</Badge>;
            case "delivered":
              return <Badge variant="delivered">Delivered</Badge>;
            case "not_sent":
            default:
              return <Badge variant="not-sent">Not sent</Badge>;
          }
        },
      },
      {
        id: "total",
        header: "Total",
        align: "center",
        width: "15%",
        cell: (item) => (
          <span className="font-sans font-medium text-sm text-heading whitespace-nowrap">
            {formatPKR(item.totalAmount)}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <DataTable<ReceiptSummary>
      data={receipts}
      columns={columns}
      keyExtractor={(item) => item.id}
      onRowClick={onSelectReceipt}
      isLoading={isLoading}
      pagination={pagination}
      emptyTitle="No receipts found"
      emptyDescription="No sales receipts match your search and filter criteria."
      className={className}
    />
  );
}
