"use client";

import React from "react";
import { CreditCard, MessageCircle } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/data-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";
import { KhataAccount } from "../types";

export interface KhataPaymentTableProps {
  accounts: KhataAccount[];
  onSelectAccount: (account: KhataAccount) => void;
  onRecordPayment: (account: KhataAccount) => void;
  onSendReminder: (account: KhataAccount) => void;
  isLoading?: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function KhataPaymentTable({
  accounts,
  onSelectAccount,
  onRecordPayment,
  onSendReminder,
  isLoading = false,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: KhataPaymentTableProps) {
  const columns: ColumnDef<KhataAccount>[] = [
    {
      id: "customer",
      header: "Customer",
      align: "left",
      cell: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-sans font-medium text-sm text-heading leading-tight">
            {item.customerName}
          </span>
          <span className="font-sans text-xs text-body">
            {item.customerPhone}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      align: "center",
      cell: (item) => {
        if (item.status === "overdue") {
          return (
            <Badge
              variant="error"
              className="rounded-full px-4 py-0.5 text-xs font-sans font-normal"
            >
              Overdue
            </Badge>
          );
        }
        return (
          <Badge
            variant="success"
            className="rounded-full px-4 py-0.5 text-xs font-sans font-normal"
          >
            Within terms
          </Badge>
        );
      },
    },
    {
      id: "oldestOpen",
      header: "Oldest open",
      align: "center",
      cell: (item) => (
        <span className="font-sans text-sm text-body">
          {item.oldestOpenDate} · {item.oldestOpenDays}d
        </span>
      ),
    },
    {
      id: "limitUsed",
      header: "Limit used",
      align: "center",
      cell: (item) => (
        <span className="font-sans text-sm text-body">
          {item.limitUsedPercent}% of {formatPKR(item.creditLimit)}
        </span>
      ),
    },
    {
      id: "balance",
      header: "Balance",
      align: "right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-3">
          <span className="font-heading font-semibold text-sm sm:text-base text-heading">
            {formatPKR(item.balance)}
          </span>

          <div
            className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRecordPayment(item)}
              className="h-8 px-2.5 text-xs rounded-full border-default hover:bg-subtle/50"
              title="Record payment"
            >
              <CreditCard className="size-3.5 mr-1" />
              <span>Pay</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onSendReminder(item)}
              className="size-8 rounded-full text-body hover:text-status-success hover:bg-status-success-bg"
              title="Send WhatsApp payment reminder"
            >
              <MessageCircle className="size-4" />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="w-full select-none">
      <DataTable
        data={accounts}
        columns={columns}
        keyExtractor={(item) => item.id}
        onRowClick={onSelectAccount}
        isLoading={isLoading}
        skeletonRows={3}
        emptyTitle="No Khata accounts found"
        emptyDescription="No customer accounts match your current search query or filter selection."
        className="rounded-[22px] bg-card border border-default/50 shadow-xs overflow-hidden"
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          pageSize,
          onPageChange,
          onPageSizeChange,
          itemLabel: "accounts",
        }}
      />
    </div>
  );
}
