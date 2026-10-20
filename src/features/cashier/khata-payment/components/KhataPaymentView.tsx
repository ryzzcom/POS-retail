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
import { KhataPaymentHeader } from "./KhataPaymentHeader";
import { KhataPaymentToolbar } from "./KhataPaymentToolbar";
import { KhataPaymentTable } from "./KhataPaymentTable";
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

    exportToCsv("cashier-khata-receivables-today", headers, rows);
    showNotification("Khata receivables report exported to CSV successfully.");
  };

  // 6. Row Selection -> Open Slide-Over Ledger Drawer
  const handleSelectAccount = (account: KhataAccount) => {
    setSelectedAccount(account);
    setIsLedgerDrawerOpen(true);
  };

  // 7. Open Payment Dialog for a specific account or general
  const handleOpenRecordPayment = (account?: KhataAccount) => {
    setSelectedAccount(account || accounts[0] || null);
    setIsPaymentDialogOpen(true);
  };

  // 8. Open WhatsApp Reminder Dialog
  const handleOpenReminder = (account: KhataAccount) => {
    setSelectedAccount(account);
    setIsReminderDialogOpen(true);
  };

  // 9. Confirm Payment Submission
  const handleConfirmPayment = (values: RecordKhataPaymentFormValues) => {
    const paidAmount = Number(values.amount);

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === values.accountId) {
          const newBalance = Math.max(0, acc.balance - paidAmount);
          const newLimitPercent = Math.round((newBalance / acc.creditLimit) * 100);
          const newLedgerEntry = {
            id: `led-${Date.now()}`,
            accountId: acc.id,
            type: "payment_received" as const,
            date: values.paymentDate || "Today",
            amount: paidAmount,
            balanceAfter: newBalance,
            description: `Payment received (${values.paymentMethod.replace("_", " ")})`,
            paymentMethod: values.paymentMethod,
          };

          return {
            ...acc,
            balance: newBalance,
            limitUsedPercent: newLimitPercent,
            status: newBalance === 0 ? "settled" : acc.status,
            ledgerEntries: [newLedgerEntry, ...(acc.ledgerEntries || [])],
          };
        }
        return acc;
      })
    );

    const targetAccount = accounts.find((a) => a.id === values.accountId);
    showNotification(
      `Recorded ${formatPKR(paidAmount)} Khata payment for "${
        targetAccount?.customerName || "Customer"
      }". Remaining balance: ${formatPKR(
        Math.max(0, (targetAccount?.balance || 0) - paidAmount)
      )}.`
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200">
      {/* Toast Notification */}
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
      <KhataPaymentToolbar
        search={search}
        onSearchChange={handleSearchChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
      />

      {/* Khata Accounts DataTable */}
      <KhataPaymentTable
        accounts={paginatedAccounts}
        onSelectAccount={handleSelectAccount}
        onRecordPayment={(acc) => handleOpenRecordPayment(acc)}
        onSendReminder={handleOpenReminder}
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
        onRecordPayment={(acc) => {
          setIsLedgerDrawerOpen(false);
          handleOpenRecordPayment(acc);
        }}
        onSendWhatsApp={(acc) => {
          setIsLedgerDrawerOpen(false);
          handleOpenReminder(acc);
        }}
        onAdjustLimit={() => {
          showNotification(
            "Credit limit adjustments are restricted to Store Owner permission.",
            "info"
          );
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
