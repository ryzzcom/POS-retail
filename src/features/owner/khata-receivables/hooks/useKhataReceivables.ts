"use client";

import * as React from "react";
import { khataReceivablesService } from "../services/khata-receivables.service";
import type { KhataAccount, KhataFilterOption, KhataAgingSummary } from "../types/khata.types";
import { exportToCsv } from "@/lib/export";

export function useKhataReceivables() {
  const [accounts, setAccounts] = React.useState<KhataAccount[]>([]);
  const [summary, setSummary] = React.useState<KhataAgingSummary>({
    totalReceivable: 0,
    totalOverdue: 0,
    withinTermsAmount: 0,
    overdue1to30Amount: 0,
    overdue31PlusAmount: 0,
    totalAccountsCount: 0,
    overdueAccountsCount: 0,
  });
  const [filterCounts, setFilterCounts] = React.useState({
    all: 0,
    overdue: 0,
    within_terms: 0,
    settled: 0,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<KhataFilterOption>("all");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Modals & Drawer State
  const [selectedAccount, setSelectedAccount] = React.useState<KhataAccount | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);

  const [paymentAccount, setPaymentAccount] = React.useState<KhataAccount | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);

  const [whatsAppAccount, setWhatsAppAccount] = React.useState<KhataAccount | null>(null);
  const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = React.useState(false);

  const [adjustLimitAccount, setAdjustLimitAccount] = React.useState<KhataAccount | null>(null);
  const [isAdjustLimitDialogOpen, setIsAdjustLimitDialogOpen] = React.useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadKhata = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await khataReceivablesService.getKhataOverview({
        search: searchQuery.trim() || undefined,
        status: statusFilter,
      });

      setAccounts(Array.isArray(res.items) ? res.items : []);
      if (res.agingSummary) setSummary(res.agingSummary);
      if (res.filterCounts) setFilterCounts(res.filterCounts);
    } catch (err: unknown) {
      console.warn("Failed to load khata accounts from API:", err);
      setError(err instanceof Error ? err.message : "Failed to load khata");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  React.useEffect(() => {
    loadKhata();
  }, [loadKhata]);

  // Filtered accounts
  const filteredAccounts = React.useMemo(() => {
    return accounts.filter((acc) => {
      if (statusFilter !== "all" && acc.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          acc.customerName.toLowerCase().includes(q) ||
          acc.customerPhone.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [accounts, statusFilter, searchQuery]);

  // Paginated accounts
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));
  const paginatedAccounts = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAccounts.slice(start, start + pageSize);
  }, [filteredAccounts, page, pageSize]);

  // Actions
  const handleRecordPayment = async (values: { amount: number; paymentMethod: string; notes?: string }) => {
    if (!paymentAccount) return;
    try {
      await khataReceivablesService.recordPayment(paymentAccount.id, values);
      showNotification(`Payment of Rs. ${values.amount.toLocaleString()} recorded for ${paymentAccount.customerName}.`);
      await loadKhata();
    } catch {
      // Local fallback
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === paymentAccount.id) {
            const nextBalance = Math.max(0, acc.balance - values.amount);
            return {
              ...acc,
              balance: nextBalance,
              status: nextBalance === 0 ? "settled" : acc.status,
              limitUsedPercent: Math.round((nextBalance / acc.creditLimit) * 100),
            };
          }
          return acc;
        })
      );
      showNotification(`Payment recorded locally for ${paymentAccount.customerName}.`);
    } finally {
      setIsPaymentDialogOpen(false);
    }
  };

  const handleAdjustCreditLimit = async (values: { newLimit: number; reason?: string }) => {
    if (!adjustLimitAccount) return;
    try {
      await khataReceivablesService.adjustCreditLimit(adjustLimitAccount.id, values.newLimit, values.reason);
      showNotification(`Credit limit updated to Rs. ${values.newLimit.toLocaleString()} for ${adjustLimitAccount.customerName}.`);
      await loadKhata();
    } catch {
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === adjustLimitAccount.id) {
            return {
              ...acc,
              creditLimit: values.newLimit,
              limitUsedPercent: Math.round((acc.balance / values.newLimit) * 100),
            };
          }
          return acc;
        })
      );
      showNotification(`Credit limit updated locally for ${adjustLimitAccount.customerName}.`);
    } finally {
      setIsAdjustLimitDialogOpen(false);
    }
  };

  const handleSendWhatsAppReminder = async (account: KhataAccount) => {
    try {
      await khataReceivablesService.sendReminder(account.id, "whatsapp");
      showNotification(`WhatsApp payment reminder dispatched to ${account.customerName} (${account.customerPhone}).`);
    } catch {
      showNotification(`WhatsApp reminder simulated for ${account.customerName}.`);
    } finally {
      setIsWhatsAppDialogOpen(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Customer Name",
      "Phone",
      "Status",
      "Balance (PKR)",
      "Credit Limit (PKR)",
      "Limit Used %",
      "Oldest Open Days",
      "Last Payment Date",
    ];
    const rows = filteredAccounts.map((a) => [
      a.customerName,
      a.customerPhone,
      a.status,
      a.balance,
      a.creditLimit,
      `${a.limitUsedPercent}%`,
      a.oldestOpenDays,
      a.lastPaymentDate || "N/A",
    ]);

    exportToCsv(`khata-receivables-${Date.now()}`, headers, rows);
    showNotification(`Exported ${filteredAccounts.length} Khata accounts to CSV.`);
  };

  return {
    accounts: paginatedAccounts,
    allAccounts: accounts,
    filteredAccounts,
    summary,
    filterCounts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    selectedAccount,
    setSelectedAccount,
    isDetailDrawerOpen,
    setIsDetailDrawerOpen,
    paymentAccount,
    setPaymentAccount,
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    whatsAppAccount,
    setWhatsAppAccount,
    isWhatsAppDialogOpen,
    setIsWhatsAppDialogOpen,
    adjustLimitAccount,
    setAdjustLimitAccount,
    isAdjustLimitDialogOpen,
    setIsAdjustLimitDialogOpen,
    notification,
    showNotification,
    handleRecordPayment,
    handleAdjustCreditLimit,
    handleSendWhatsAppReminder,
    handleExportCSV,
    refresh: loadKhata,
  };
}
