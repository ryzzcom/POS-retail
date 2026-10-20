"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/data-display";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/formatters";
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
  const columns: ColumnDef<CashierSaleItem>[] = [
    {
      id: "receipt",
      header: "Receipt",
      align: "left",
      cell: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono font-medium text-sm text-heading leading-tight">
            {item.receiptNumber}
          </span>
          <span className="font-sans text-xs text-body">
            {item.time} · {item.itemsSummary}
          </span>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      align: "left",
      cell: (item) => (
        <span className="font-sans text-sm text-heading font-medium">
          {item.customerName}
        </span>
      ),
    },
    {
      id: "paidBy",
      header: "Paid by",
      align: "left",
      cell: (item) => (
        <span className="font-sans text-sm text-heading">
          {item.paidBy}
        </span>
      ),
    },
    {
      id: "whatsapp",
      header: "WhatsApp",
      align: "center",
      cell: (item) => {
        if (item.whatsappStatus === "delivered") {
          return (
            <Badge
              variant="success"
              className="rounded-full px-3.5 py-0.5 text-xs font-sans font-normal"
            >
              Delivered
            </Badge>
          );
        }
        if (item.whatsappStatus === "failed") {
          return (
            <Badge
              variant="error"
              className="rounded-full px-3.5 py-0.5 text-xs font-sans font-normal"
            >
              Failed
            </Badge>
          );
        }
        return (
          <Badge
            variant="outline"
            className="rounded-full px-3.5 py-0.5 text-xs font-sans font-normal text-body border-default"
          >
            Not sent
          </Badge>
        );
      },
    },
    {
      id: "total",
      header: "Total",
      align: "right",
      cell: (item) => (
        <span className="font-heading font-semibold text-sm sm:text-base text-heading">
          {formatPKR(item.totalAmountPKR)}
        </span>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="w-full select-none">
      <DataTable
        data={sales}
        columns={columns}
        keyExtractor={(item) => item.id}
        onRowClick={onSelectSale}
        isLoading={isLoading}
        skeletonRows={3}
        emptyTitle="No receipts found"
        emptyDescription="No sales receipts match your current search or payment method filter."
        className="rounded-[22px] bg-card border border-default/50 shadow-xs overflow-hidden"
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
    </div>
  );
}
