"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";
import {
  RecordKhataPaymentDialog,
  KhataDetailDrawer,
  WhatsAppReminderDialog,
} from "@/features/owner/khata-receivables";
import { RecordKhataPaymentFormValues } from "@/features/owner/khata-receivables/schemas/khata.schemas";
import { KhataAccountsTable, KhataToolbar } from "@/components/common";
import { KhataPaymentHeader } from "./KhataPaymentHeader";
import { MOCK_CASHIER_KHATA_ACCOUNTS } from "../constants";
import { KhataAccount, CashierKhataStatusFilter } from "../types";

export function KhataPaymentView() {
  const [accounts, setAccounts] = useState<KhataAccount[]>(
    MOCK_CASHIER_KHATA_ACCOUNTS
  );
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<CashierKhataStatusFilter>("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal & Drawer State
  const [selectedAccount, setSelectedAccount] = useState<KhataAccount | null>(
    null
  );
  const [isLedgerDrawerOpen, setIsLedgerDrawerOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState<{
    type: "success" | "info";
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // 1. Search Change Handler
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  // 2. Status Filter Change Handler
  const handleStatusChange = (status: CashierKhataStatusFilter) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // 3. Filtered Accounts List
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // Status Match
      const matchesStatus =
        selectedStatus === "all" || acc.status === selectedStatus;

      // Search Match
      const searchLower = search.trim().toLowerCase();
      const matchesSearch =
        !searchLower ||
        acc.customerName.toLowerCase().includes(searchLower) ||
        acc.customerPhone.includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [accounts, selectedStatus, search]);

  // 4. Paginated Accounts
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(start, start + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  // 5. Export to CSV
  const handleExport = () => {
    const headers = [
      "Customer",
      "Phone",
      "Status",
      "Oldest Open Date",
      "Days Open",
      "Credit Limit (PKR)",
      "Limit Used %",
      "Balance (PKR)",
    ];

    const rows = filteredAccounts.map((a) => [
      a.customerName,
      a.customerPhone,
      a.status === "overdue" ? "Overdue" : "Within terms",
      a.oldestOpenDate,
      a.oldestOpenDays,
      a.creditLimit,
      `${a.limitUsedPercent}%`,
      a.balance,
    ]);

    exportToCsv("cashier-khata-accounts", headers, rows);
    showNotification("Khata receivables list exported to CSV successfully.");
  };

  // 6. Modal Open Handlers
  const handleSelectAccount = (account: KhataAccount) => {
    setSelectedAccount(account);
    setIsLedgerDrawerOpen(true);
  };

  const handleOpenRecordPayment = (account?: KhataAccount) => {
    setSelectedAccount(account || null);
    setIsPaymentDialogOpen(true);
  };

  const handleOpenReminder = (account: KhataAccount) => {
    setSelectedAccount(account);
    setIsReminderDialogOpen(true);
  };

  // 7. Payment Confirmation Handler
  const handleConfirmPayment = (values: RecordKhataPaymentFormValues) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === values.accountId) {
          const newBalance = Math.max(0, acc.balance - values.amount);
          const newPercent = Math.round((newBalance / acc.creditLimit) * 100);
          const newStatus =
            newBalance === 0
              ? "settled"
              : acc.status === "overdue"
              ? "overdue"
              : "within_terms";

          const updated: KhataAccount = {
            ...acc,
            balance: newBalance,
            limitUsedPercent: newPercent,
            status: newStatus as any,
            lastPaymentDate: "Today",
          };

          if (selectedAccount?.id === acc.id) {
            setSelectedAccount(updated);
          }
          return updated;
        }
        return acc;
      })
    );

    const target = accounts.find((a) => a.id === values.accountId);
    showNotification(
      `Payment of ${formatPKR(values.amount)} received from ${
        target?.customerName || "Customer"
      }.`
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200">
      {/* Dynamic Toast / Feedback Notification */}
      {notification && (
        <div
          role="status"
          className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-[14px] bg-card border border-default shadow-lg text-heading text-sm font-sans animate-in slide-in-from-top-4 duration-200"
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="size-5 text-status-success shrink-0" />
          ) : (
            <Info className="size-5 text-accent shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Row */}
      <KhataPaymentHeader
        onExport={handleExport}
        onRecordPayment={() => handleOpenRecordPayment(selectedAccount || undefined)}
      />

      {/* Toolbar: Search & Status Filter */}
      <KhataToolbar
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={selectedStatus}
        onStatusFilterChange={(val) => handleStatusChange(val as CashierKhataStatusFilter)}
      />

      {/* Khata Accounts DataTable */}
      <KhataAccountsTable
        role="cashier"
        accounts={paginatedAccounts}
        onSelectAccount={handleSelectAccount}
        onRecordPayment={(acc) => handleOpenRecordPayment(acc)}
        onSendWhatsApp={handleOpenReminder}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredAccounts.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
      />

      {/* Reused Record Payment Dialog */}
      <RecordKhataPaymentDialog
        open={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        account={selectedAccount}
        accounts={accounts}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Reused Slide-Over Ledger Drawer */}
      <KhataDetailDrawer
        open={isLedgerDrawerOpen}
        onClose={() => setIsLedgerDrawerOpen(false)}
        account={selectedAccount}
        canAdjustLimit={false}
        onRecordPayment={(acc) => {
          setIsLedgerDrawerOpen(false);
          handleOpenRecordPayment(acc);
        }}
        onSendWhatsApp={(acc) => {
          setIsLedgerDrawerOpen(false);
          handleOpenReminder(acc);
        }}
      />

      {/* Reused WhatsApp Reminder Dialog */}
      <WhatsAppReminderDialog
        open={isReminderDialogOpen}
        onClose={() => setIsReminderDialogOpen(false)}
        account={selectedAccount}
        onSendSuccess={(acc) => {
          showNotification(`WhatsApp payment reminder dispatched to ${acc.customerName}.`);
        }}
      />
    </div>
  );
}
