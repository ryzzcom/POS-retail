"use client";

import * as React from "react";
import {
  KhataAccount,
  CashierKhataStatusFilter,
  CashierKhataSummary,
} from "../types/khata-payment.types";
import { cashierKhataPaymentService } from "../services/khata-payment.service";
import { exportToCsv } from "@/lib/export";
import { RecordKhataPaymentFormValues } from "@/features/owner/khata-receivables/schemas/khata.schemas";
import { formatPKR } from "@/lib/formatters";

export function useKhataPayment() {
  const [accounts, setAccounts] = React.useState<KhataAccount[]>([]);
  const [summary, setSummary] = React.useState<CashierKhataSummary>({
    totalAccounts: 0,
    overdueCount: 0,
    totalOutstandingPKR: 0,
    collectedTodayPKR: 0,
  });

  const [search, setSearch] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<CashierKhataStatusFilter>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Modal & Drawer State
  const [selectedAccount, setSelectedAccount] = React.useState<KhataAccount | null>(null);
  const [isLedgerDrawerOpen, setIsLedgerDrawerOpen] = React.useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = React.useState(false);

  const [notification, setNotification] = React.useState<{
    type: "success" | "info";
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await cashierKhataPaymentService.fetchAccounts({
        search,
        status: selectedStatus,
      });

      setAccounts(data.items);
      setSummary(data.summary);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load Khata accounts";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedStatus]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: CashierKhataStatusFilter) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const paginatedAccounts = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return accounts.slice(start, start + pageSize);
  }, [accounts, currentPage, pageSize]);

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

    const rows = accounts.map((a) => [
      a.customerName,
      a.customerPhone,
      a.status,
      a.oldestOpenDate,
      a.oldestOpenDays,
      a.creditLimit,
      `${a.limitUsedPercent}%`,
      a.balance,
    ]);

    exportToCsv("cashier-khata-directory", headers, rows);
    showNotification("Khata directory exported to CSV successfully.");
  };

  const handleOpenPayment = (acc: KhataAccount) => {
    setSelectedAccount(acc);
    setIsPaymentDialogOpen(true);
  };

  const handleOpenLedger = (acc: KhataAccount) => {
    setSelectedAccount(acc);
    setIsLedgerDrawerOpen(true);
  };

  const handleOpenReminder = (acc: KhataAccount) => {
    setSelectedAccount(acc);
    setIsReminderDialogOpen(true);
  };

  const handleConfirmPayment = async (data: RecordKhataPaymentFormValues) => {
    if (!selectedAccount) return;
    try {
      const pm =
        data.paymentMethod === "jazzcash" || data.paymentMethod === "nayapay"
          ? "WALLET"
          : "CASH";
      await cashierKhataPaymentService.recordPayment(selectedAccount.id, {
        amount: data.amount,
        paymentMethod: pm,
        reference: data.reference,
        notes: data.notes,
      });

      showNotification(
        `Payment of ${formatPKR(data.amount)} recorded for ${selectedAccount.customerName}.`
      );
      setIsPaymentDialogOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record payment";
      showNotification(`Error: ${msg}`, "info");
    }
  };

  return {
    accounts,
    filteredAccounts: accounts,
    paginatedAccounts,
    summary,
    search,
    selectedStatus,
    currentPage,
    pageSize,
    isLoading,
    error,
    notification,
    selectedAccount,
    isLedgerDrawerOpen,
    setIsLedgerDrawerOpen,
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    isReminderDialogOpen,
    setIsReminderDialogOpen,
    setCurrentPage,
    setPageSize,
    handleSearchChange,
    handleStatusChange,
    handleExport,
    handleOpenPayment,
    handleOpenLedger,
    handleOpenReminder,
    handleConfirmPayment,
    showNotification,
    refreshData: loadData,
  };
}
