"use client";

import * as React from "react";
import { useKhataReceivables } from "../hooks/useKhataReceivables";
import type { KhataAccount, KhataFilterOption } from "../types/khata.types";
import { KhataHeader } from "./KhataHeader";
import { KhataAgingCard } from "./KhataAgingCard";
import { KhataAccountsTable, KhataToolbar } from "@/components/common";
import { KhataDetailDrawer } from "./KhataDetailDrawer";
import { RecordKhataPaymentDialog } from "./RecordKhataPaymentDialog";
import { WhatsAppReminderDialog } from "./WhatsAppReminderDialog";
import { AdjustCreditLimitDialog } from "./AdjustCreditLimitDialog";

export function KhataReceivablesView() {
  const {
    accounts,
    allAccounts,
    filteredAccounts,
    summary,
    filterCounts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
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
    handleRecordPayment,
    handleAdjustCreditLimit,
    handleSendWhatsAppReminder,
    handleExportCSV,
  } = useKhataReceivables();

  const handleSelectAccount = (account: KhataAccount) => {
    setSelectedAccount(account);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenRecordPayment = (account?: KhataAccount) => {
    setPaymentAccount(account || allAccounts[0] || null);
    setIsPaymentDialogOpen(true);
  };

  const handleOpenWhatsAppReminder = (account: KhataAccount) => {
    setWhatsAppAccount(account);
    setIsWhatsAppDialogOpen(true);
  };

  const handleOpenAdjustLimit = (account: KhataAccount) => {
    setAdjustLimitAccount(account);
    setIsAdjustLimitDialogOpen(true);
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
        search={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => setStatusFilter(val as KhataFilterOption)}
        counts={filterCounts}
      />

      {/* 4. Khata Accounts & Ledger Table (Figma Node 3456:49411) */}
      <KhataAccountsTable
        role="owner"
        accounts={accounts}
        currentPage={page}
        pageSize={pageSize}
        totalItems={filteredAccounts.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSelectAccount={handleSelectAccount}
        onRecordPayment={handleOpenRecordPayment}
        onSendWhatsApp={handleOpenWhatsAppReminder}
        onAdjustLimit={handleOpenAdjustLimit}
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
        accounts={allAccounts}
        onConfirmPayment={(values) =>
          handleRecordPayment({
            amount: values.amount,
            paymentMethod: values.paymentMethod,
            notes: values.notes,
          })
        }
      />

      {/* 7. WhatsApp Payment Reminder Modal Dialog */}
      <WhatsAppReminderDialog
        open={isWhatsAppDialogOpen}
        onClose={() => {
          setIsWhatsAppDialogOpen(false);
          setWhatsAppAccount(null);
        }}
        account={whatsAppAccount}
        onSendSuccess={(acc) => handleSendWhatsAppReminder(acc)}
      />

      {/* 8. Adjust Credit Limit Modal Dialog */}
      <AdjustCreditLimitDialog
        open={isAdjustLimitDialogOpen}
        onClose={() => {
          setIsAdjustLimitDialogOpen(false);
          setAdjustLimitAccount(null);
        }}
        account={adjustLimitAccount}
        onConfirmAdjust={(accId, newLimit) =>
          handleAdjustCreditLimit({ newLimit })
        }
      />
    </div>
  );
}
