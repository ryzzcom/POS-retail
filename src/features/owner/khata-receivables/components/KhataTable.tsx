"use client";

import * as React from "react";
import { MessageCircle, CreditCard, ChevronRight } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/formatters";
import { KhataAccount } from "../types/khata.types";

interface KhataTableProps {
  accounts: KhataAccount[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSelectAccount: (account: KhataAccount) => void;
  onRecordPayment: (account: KhataAccount) => void;
  onSendWhatsApp: (account: KhataAccount) => void;
  isLoading?: boolean;
}

export function KhataTable({
  accounts,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onSelectAccount,
  onRecordPayment,
  onSendWhatsApp,
  isLoading = false,
}: KhataTableProps) {
  const columns: ColumnDef<KhataAccount>[] = [
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customerName",
      cell: (item: KhataAccount) => (
        <div className="flex flex-col min-w-0 pr-2">
          <span className="font-sans font-medium text-xs sm:text-sm text-heading hover:text-primary transition-colors cursor-pointer">
            {item.customerName}
          </span>
          <span className="font-sans text-[11px] sm:text-xs text-body mt-0.5">
            {item.customerPhone}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      headerClassName: "text-center",
      className: "text-center",
      cell: (item: KhataAccount) => {
        switch (item.status) {
          case "overdue":
            return (
              <Badge variant="error" size="sm" className="capitalize">
                Overdue
              </Badge>
            );
          case "within_terms":
            return (
              <Badge variant="success" size="sm" className="capitalize">
                Within terms
              </Badge>
            );
          case "settled":
            return (
              <Badge variant="neutral" size="sm" className="capitalize">
                Settled
              </Badge>
            );
          default:
            return <Badge size="sm">{item.status}</Badge>;
        }
      },
    },
    {
      id: "oldestOpen",
      header: "Oldest open",
      accessorKey: "oldestOpenDate",
      headerClassName: "text-center",
      className: "text-center",
      cell: (item: KhataAccount) => (
        <span className="font-sans text-xs sm:text-sm text-heading whitespace-nowrap">
          {item.oldestOpenDays > 0
            ? `${item.oldestOpenDate} · ${item.oldestOpenDays}d`
            : item.oldestOpenDate}
        </span>
      ),
    },
    {
      id: "limitUsed",
      header: "Limit used",
      accessorKey: "creditLimit",
      headerClassName: "text-center",
      className: "text-center",
      cell: (item: KhataAccount) => (
        <span className="font-sans text-xs sm:text-sm text-heading whitespace-nowrap">
          {item.limitUsedPercent}% of {formatPKR(item.creditLimit)}
        </span>
      ),
    },
    {
      id: "balance",
      header: "Balance",
      accessorKey: "balance",
      headerClassName: "text-right",
      className: "text-right",
      cell: (item: KhataAccount) => (
        <span className="font-heading font-medium text-xs sm:text-sm text-heading whitespace-nowrap">
          {formatPKR(item.balance)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      cell: (item: KhataAccount) => (
        <div
          className="flex items-center justify-end gap-1.5 sm:gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {item.balance > 0 && (
            <>
              {/* WhatsApp Reminder CTA */}
              <button
                type="button"
                onClick={() => onSendWhatsApp(item)}
                className="size-8 rounded-full flex items-center justify-center text-body hover:text-status-success hover:bg-subtle/50 transition-colors cursor-pointer"
                title="Send WhatsApp payment reminder"
                aria-label={`Send WhatsApp reminder to ${item.customerName}`}
              >
                <MessageCircle className="size-4" />
              </button>

              {/* Record Payment CTA */}
              <button
                type="button"
                onClick={() => onRecordPayment(item)}
                className="size-8 rounded-full flex items-center justify-center text-body hover:text-primary hover:bg-subtle/50 transition-colors cursor-pointer"
                title="Record payment"
                aria-label={`Record payment for ${item.customerName}`}
              >
                <CreditCard className="size-4" />
              </button>
            </>
          )}

          {/* View Details Drawer Arrow */}
          <button
            type="button"
            onClick={() => onSelectAccount(item)}
            className="size-8 rounded-full flex items-center justify-center text-muted hover:text-heading hover:bg-subtle/50 transition-colors cursor-pointer"
            title="View customer ledger details"
            aria-label={`View ledger for ${item.customerName}`}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-[22px] border border-default/60 bg-card overflow-hidden shadow-xs">
      <DataTable
        columns={columns}
        data={accounts}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        onRowClick={(item) => onSelectAccount(item)}
        pagination={{
          currentPage,
          pageSize,
          totalItems,
          totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
          onPageChange,
          onPageSizeChange,
        }}
        emptyTitle="No Khata accounts found"
        emptyDescription="There are no customer Khata records matching your search or filter."
      />
    </div>
  );
}
