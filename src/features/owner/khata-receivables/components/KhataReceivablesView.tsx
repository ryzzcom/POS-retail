"use client";

import * as React from "react";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";
import { KhataAccount, KhataFilterOption, KhataAgingSummary } from "../types/khata.types";
import { MOCK_KHATA_ACCOUNTS } from "../constants/khata-mock";
import { RecordKhataPaymentFormValues } from "../schemas/khata.schemas";
import { KhataHeader } from "./KhataHeader";
import { KhataAgingCard } from "./KhataAgingCard";
import { KhataToolbar } from "./KhataToolbar";
import { KhataTable } from "./KhataTable";
import { KhataDetailDrawer } from "./KhataDetailDrawer";
import { RecordKhataPaymentDialog } from "./RecordKhataPaymentDialog";
import { WhatsAppReminderDialog } from "./WhatsAppReminderDialog";
import { AdjustCreditLimitDialog } from "./AdjustCreditLimitDialog";

export function KhataReceivablesView() {
  const [accounts, setAccounts] = React.useState<KhataAccount[]>(MOCK_KHATA_ACCOUNTS);
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

  // Dynamic Aging Metrics
  const summary: KhataAgingSummary = React.useMemo(() => {
    let totalReceivable = 0;
    let totalOverdue = 0;
    let withinTermsAmount = 0;
    let overdue1to30Amount = 0;
    let overdue31PlusAmount = 0;
    let overdueAccountsCount = 0;

    accounts.forEach((acc) => {
      totalReceivable += acc.balance;
      if (acc.status === "overdue") {
        totalOverdue += acc.balance;
        overdueAccountsCount += 1;
        if (acc.oldestOpenDays <= 30) {
          overdue1to30Amount += acc.balance;
        } else {
          overdue31PlusAmount += acc.balance;
        }
      } else if (acc.status === "within_terms") {
        withinTermsAmount += acc.balance;
      }
    });

    return {
      totalReceivable,
      totalOverdue,
      withinTermsAmount,
      overdue1to30Amount,
      overdue31PlusAmount,
      totalAccountsCount: accounts.length,
      overdueAccountsCount,
    };
  }, [accounts]);

  // Counts for filter pills
  const counts = React.useMemo(() => {
    return {
      all: accounts.length,
      overdue: accounts.filter((a) => a.status === "overdue").length,
      within_terms: accounts.filter((a) => a.status === "within_terms").length,
      settled: accounts.filter((a) => a.status === "settled").length,
    };
  }, [accounts]);

  // Filtered Accounts
  const filteredAccounts = React.useMemo(() => {
    return accounts.filter((acc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        acc.customerName.toLowerCase().includes(q) ||
        acc.customerPhone.includes(q);

      const matchesStatus =
        statusFilter === "all" || acc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [accounts, searchQuery, statusFilter]);

  // Reset page to 1 on filter or search changes
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  // Paginated Rows
  const paginatedAccounts = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAccounts.slice(start, start + pageSize);
  }, [filteredAccounts, page, pageSize]);

  // Handler: Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Customer Name",
      "Phone Number",
      "Status",
      "Oldest Open Date",
      "Days Open",
      "Credit Limit (PKR)",
      "Outstanding Balance (PKR)",
      "Limit Used %",
      "Last Payment Date",
    ];

    const rows = filteredAccounts.map((a) => [
      a.customerName,
      a.customerPhone,
      a.status,
      a.oldestOpenDate,
      a.oldestOpenDays,
      a.creditLimit,
      a.balance,
      `${a.limitUsedPercent}%`,
      a.lastPaymentDate || "N/A",
    ]);

    exportToCsv(`khata_receivables_${Date.now()}`, headers, rows);
    showNotification("Khata accounts directory exported to CSV successfully.");
  };

  // Handler: Open Drawer
  const handleSelectAccount = (account: KhataAccount) => {
    setSelectedAccount(account);
    setIsDetailDrawerOpen(true);
  };

  // Handler: Open Record Payment Modal
  const handleOpenRecordPayment = (account?: KhataAccount) => {
    setPaymentAccount(account || null);
    setIsPaymentDialogOpen(true);
  };

  // Handler: Confirm Record Payment
  const handleConfirmPayment = (values: RecordKhataPaymentFormValues) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === values.accountId) {
          const newBalance = Math.max(0, acc.balance - values.amount);
          const newStatus = newBalance === 0 ? "settled" : acc.status;
          const newPercent = Math.round((newBalance / (acc.creditLimit || 1)) * 100);

          const newEntry = {
            id: `led-${Date.now()}`,
            accountId: acc.id,
            type: "payment_received" as const,
            date: values.paymentDate,
            amount: values.amount,
            balanceAfter: newBalance,
            receiptNo: values.reference || `CR-${Math.floor(1000 + Math.random() * 9000)}`,
            description: `Payment received via ${values.paymentMethod}`,
            paymentMethod: values.paymentMethod,
          };

          const updatedAccount: KhataAccount = {
            ...acc,
            balance: newBalance,
            status: newStatus,
            limitUsedPercent: newPercent,
            lastPaymentDate: values.paymentDate,
            oldestOpenDate: newBalance === 0 ? "No open dues" : acc.oldestOpenDate,
            oldestOpenDays: newBalance === 0 ? 0 : acc.oldestOpenDays,
            ledgerEntries: [newEntry, ...(acc.ledgerEntries || [])],
          };

          // Also update selectedAccount if drawer is open
          if (selectedAccount?.id === acc.id) {
            setSelectedAccount(updatedAccount);
          }

          return updatedAccount;
        }
        return acc;
      })
    );

    const target = accounts.find((a) => a.id === values.accountId);
    showNotification(
      `Payment of ${formatPKR(values.amount)} recorded for ${
        target?.customerName || "customer"
      }.`
    );
  };

  // Handler: Open WhatsApp Reminder Dialog
  const handleOpenWhatsAppReminder = (account: KhataAccount) => {
    setWhatsAppAccount(account);
    setIsWhatsAppDialogOpen(true);
  };

  // Handler: Open Adjust Limit Dialog
  const handleOpenAdjustLimit = (account: KhataAccount) => {
    setAdjustLimitAccount(account);
    setIsAdjustLimitDialogOpen(true);
  };

  // Handler: Confirm Limit Adjustment
  const handleConfirmAdjustLimit = (accountId: string, newLimit: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          const newPercent = Math.round((acc.balance / (newLimit || 1)) * 100);
          const updated: KhataAccount = {
            ...acc,
            creditLimit: newLimit,
            limitUsedPercent: newPercent,
          };
          if (selectedAccount?.id === acc.id) {
            setSelectedAccount(updated);
          }
          return updated;
        }
        return acc;
      })
    );

    const target = accounts.find((a) => a.id === accountId);
    showNotification(
      `Credit limit updated to ${formatPKR(newLimit)} for ${
        target?.customerName || "customer"
      }.`
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-dark-primary px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-sans flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Page Header (Figma Node 3455:48537) */}
      <KhataHeader
        onRecordPayment={() => handleOpenRecordPayment()}
        onExport={handleExportCSV}
      />

      {/* 2. Receivables KPI Aging Breakdown Card (Figma Node 3456:49369) */}
      <KhataAgingCard summary={summary} />

      {/* 3. Toolbar Row: Search Pill & Segmented Filter Pills */}
      <KhataToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        counts={counts}
      />

      {/* 4. Khata Accounts & Ledger Table (Figma Node 3456:49411) */}
      <KhataTable
        accounts={paginatedAccounts}
        currentPage={page}
        pageSize={pageSize}
        totalItems={filteredAccounts.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSelectAccount={handleSelectAccount}
        onRecordPayment={handleOpenRecordPayment}
        onSendWhatsApp={handleOpenWhatsAppReminder}
      />

      {/* 5. Customer Khata Ledger Detail Drawer */}
      <KhataDetailDrawer
        account={selectedAccount}
        open={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedAccount(null);
        }}
        onRecordPayment={handleOpenRecordPayment}
        onSendWhatsApp={handleOpenWhatsAppReminder}
        onAdjustLimit={handleOpenAdjustLimit}
      />

      {/* 6. Record Khata Payment Modal Dialog */}
      <RecordKhataPaymentDialog
        open={isPaymentDialogOpen}
        onClose={() => {
          setIsPaymentDialogOpen(false);
          setPaymentAccount(null);
        }}
        account={paymentAccount}
        accounts={accounts}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* 7. WhatsApp Payment Reminder Modal Dialog */}
      <WhatsAppReminderDialog
        open={isWhatsAppDialogOpen}
        onClose={() => {
          setIsWhatsAppDialogOpen(false);
          setWhatsAppAccount(null);
        }}
        account={whatsAppAccount}
        onSendSuccess={(acc) => {
          showNotification(`WhatsApp reminder opened for ${acc.customerName}.`);
        }}
      />

      {/* 8. Adjust Credit Limit Modal Dialog */}
      <AdjustCreditLimitDialog
        open={isAdjustLimitDialogOpen}
        onClose={() => {
          setIsAdjustLimitDialogOpen(false);
          setAdjustLimitAccount(null);
        }}
        account={adjustLimitAccount}
        onConfirmAdjust={handleConfirmAdjustLimit}
      />
    </div>
  );
}
