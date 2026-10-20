"use client";

import * as React from "react";
import {
  MessageCircle,
  CreditCard,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/data-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";
import { KhataAccount } from "@/features/owner/khata-receivables/types/khata.types";

export interface KhataAccountsTableProps {
  accounts: KhataAccount[];
  role?: "owner" | "cashier";
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSelectAccount: (account: KhataAccount) => void;
  onRecordPayment: (account: KhataAccount) => void;
  onSendWhatsApp: (account: KhataAccount) => void;
  onAdjustLimit?: (account: KhataAccount) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Unified Khata Accounts DataTable component.
 * Reusable across Store Owner Khata Receivables and Cashier Khata Payments views.
 */
export function KhataAccountsTable({
  accounts,
  role = "owner",
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onSelectAccount,
  onRecordPayment,
  onSendWhatsApp,
  onAdjustLimit,
  isLoading = false,
  className,
}: KhataAccountsTableProps) {
  const isOwner = role === "owner";

  const columns: ColumnDef<KhataAccount>[] = React.useMemo(() => {
    const cols: ColumnDef<KhataAccount>[] = [
      {
        id: "customer",
        header: "Customer",
        align: "left",
        width: isOwner ? "22%" : "25%",
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
        align: "center",
        width: isOwner ? "14%" : "15%",
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
        align: "center",
        width: isOwner ? "18%" : "18%",
        cell: (item: KhataAccount) => (
          <span className="font-sans text-xs sm:text-sm text-body whitespace-nowrap">
            {item.oldestOpenDays > 0
              ? `${item.oldestOpenDate} · ${item.oldestOpenDays}d`
              : item.oldestOpenDate}
          </span>
        ),
      },
      {
        id: "limitUsed",
        header: "Limit used",
        align: "center",
        width: isOwner ? "18%" : "18%",
        cell: (item: KhataAccount) => (
          <span className="font-sans text-xs sm:text-sm text-body">
            {item.limitUsedPercent}% of {formatPKR(item.creditLimit)}
          </span>
        ),
      },
    ];

    if (isOwner) {
      cols.push(
        {
          id: "balance",
          header: "Balance",
          align: "right",
          width: "14%",
          cell: (item: KhataAccount) => (
            <span className="font-heading font-semibold text-xs sm:text-sm text-heading whitespace-nowrap">
              {formatPKR(item.balance)}
            </span>
          ),
        },
        {
          id: "actions",
          header: "",
          align: "right",
          width: "14%",
          cell: (item: KhataAccount) => (
            <div
              className="flex items-center justify-end gap-1.5 sm:gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {item.balance > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => onSendWhatsApp(item)}
                    className="size-8 rounded-full flex items-center justify-center text-body hover:text-status-success hover:bg-subtle/50 transition-colors cursor-pointer"
                    title="Send WhatsApp payment reminder"
                    aria-label={`Send WhatsApp reminder to ${item.customerName}`}
                  >
                    <MessageCircle className="size-4" />
                  </button>

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

              {onAdjustLimit && (
                <button
                  type="button"
                  onClick={() => onAdjustLimit(item)}
                  className="size-8 rounded-full flex items-center justify-center text-body hover:text-primary hover:bg-subtle/50 transition-colors cursor-pointer"
                  title="Adjust credit limit"
                  aria-label={`Adjust credit limit for ${item.customerName}`}
                >
                  <Sliders className="size-3.5" />
                </button>
              )}

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
        }
      );
    } else {
      // Cashier Mode: Inline Balance with Pay pill and WhatsApp icon
      cols.push({
        id: "balance",
        header: "Balance",
        align: "right",
        width: "24%",
        cell: (item: KhataAccount) => (
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
                onClick={() => onSendWhatsApp(item)}
                className="size-8 rounded-full text-body hover:text-status-success hover:bg-status-success-bg"
                title="Send WhatsApp payment reminder"
              >
                <MessageCircle className="size-4" />
              </Button>
            </div>
          </div>
        ),
      });
    }

    return cols;
  }, [isOwner, onAdjustLimit, onRecordPayment, onSelectAccount, onSendWhatsApp]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="w-full select-none">
      <DataTable
        columns={columns}
        data={accounts}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        onRowClick={onSelectAccount}
        skeletonRows={5}
        emptyTitle="No Khata accounts found"
        emptyDescription="No customer accounts match your current search query or filter selection."
        className={className}
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
