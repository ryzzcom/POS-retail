"use client";

import * as React from "react";
import { formatPKR } from "@/lib/formatters";
import {
  DataTable,
  ColumnDef,
  TablePaginationConfig,
} from "@/components/data-display";
import { Badge } from "@/components/ui/badge";

export type SalesWhatsAppStatus = "delivered" | "failed" | "not_sent";

export interface SaleRowItem {
  id: string;
  receiptNumber: string;
  time: string;
  itemCount?: number;
  itemsCount?: number;
  customerName: string;
  customerPhone?: string;
  paymentMethod?: string;
  paidByMethod?: string;
  paymentMethodLabel?: string;
  paidBy?: string;
  cashierName?: string;
  whatsappStatus: SalesWhatsAppStatus | string;
  totalAmount?: number;
  totalAmountPKR?: number;
}

export interface SalesTableProps<T extends SaleRowItem = SaleRowItem> {
  sales: T[];
  showCashierColumn?: boolean;
  onSelectSale: (sale: T) => void;
  isLoading?: boolean;
  pagination?: TablePaginationConfig;
  className?: string;
}

/**
 * Unified Sales & Receipts DataTable component.
 * Reusable across Store Owner Sales History and Cashier My Sales views.
 */
export function SalesTable<T extends SaleRowItem = SaleRowItem>({
  sales,
  showCashierColumn = true,
  onSelectSale,
  isLoading = false,
  pagination,
  className,
}: SalesTableProps<T>) {
  const columns: ColumnDef<T>[] = React.useMemo(() => {
    const cols: ColumnDef<T>[] = [
      {
        id: "receipt",
        header: "Receipt",
        align: "left",
        width: showCashierColumn ? "20%" : "25%",
        cell: (item: T) => {
          const itemsCount = item.itemCount ?? item.itemsCount ?? 1;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-sm text-heading font-medium tracking-tight">
                {item.receiptNumber}
              </span>
              <div className="flex items-center gap-1.5 font-sans text-xs text-body">
                <span>{item.time}</span>
                <span
                  className="size-1 rounded-full bg-body/40"
                  aria-hidden="true"
                />
                <span>
                  {itemsCount} {itemsCount === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "customer",
        header: "Customer",
        align: "left",
        width: showCashierColumn ? "18%" : "25%",
        cell: (item: T) => (
          <span className="font-sans text-sm text-heading font-normal">
            {item.customerName}
          </span>
        ),
      },
      {
        id: "paidBy",
        header: "Paid by",
        align: "left",
        width: showCashierColumn ? "15%" : "20%",
        cell: (item: T) => (
          <span className="font-sans text-sm text-heading font-normal">
            {item.paymentMethodLabel || item.paidBy || "Cash"}
          </span>
        ),
      },
    ];

    if (showCashierColumn) {
      cols.push({
        id: "cashier",
        header: "Cashier",
        align: "center",
        width: "17%",
        cell: (item: T) => (
          <span className="font-sans text-sm text-heading font-normal">
            {item.cashierName || "—"}
          </span>
        ),
      });
    }

    cols.push(
      {
        id: "whatsapp",
        header: "WhatsApp",
        align: "center",
        width: showCashierColumn ? "15%" : "15%",
        cell: (item: T) => {
          switch (item.whatsappStatus) {
            case "failed":
              return (
                <Badge variant="failed" size="sm">
                  Failed
                </Badge>
              );
            case "delivered":
              return (
                <Badge variant="delivered" size="sm">
                  Delivered
                </Badge>
              );
            case "not_sent":
            default:
              return (
                <Badge variant="not-sent" size="sm">
                  Not sent
                </Badge>
              );
          }
        },
      },
      {
        id: "total",
        header: "Total",
        align: "right",
        width: showCashierColumn ? "15%" : "15%",
        cell: (item: T) => {
          const totalVal = item.totalAmount ?? item.totalAmountPKR ?? 0;
          return (
            <span className="font-heading font-semibold text-sm sm:text-base text-heading">
              {formatPKR(totalVal)}
            </span>
          );
        },
      }
    );

    return cols;
  }, [showCashierColumn]);

  return (
    <div className="w-full select-none">
      <DataTable
        data={sales}
        columns={columns}
        keyExtractor={(item) => item.id}
        onRowClick={onSelectSale}
        isLoading={isLoading}
        skeletonRows={5}
        emptyTitle="No receipts found"
        emptyDescription="Try adjusting your search query or filter by another payment method."
        pagination={pagination}
        className={className}
      />
    </div>
  );
}
