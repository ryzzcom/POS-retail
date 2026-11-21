"use client";

import React from "react";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import {
  RecordKhataPaymentDialog,
  KhataDetailDrawer,
  WhatsAppReminderDialog,
} from "@/features/owner/khata-receivables";
import { KhataAccountsTable, KhataToolbar } from "@/components/common";
import { KhataPaymentHeader } from "./KhataPaymentHeader";
import { CashierKhataStatusFilter } from "../types";
import { useKhataPayment } from "../hooks/useKhataPayment";

export function KhataPaymentView() {
  const {
    accounts,
    filteredAccounts,
    paginatedAccounts,
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
  } = useKhataPayment();

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
        onRecordPayment={() => handleOpenPayment(selectedAccount || accounts[0])}
      />

      {/* Toolbar: Search & Status Filter */}
      <KhataToolbar
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={selectedStatus}
        onStatusFilterChange={(val) => handleStatusChange(val as CashierKhataStatusFilter)}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-default">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-body">Loading Khata accounts...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-status-error-bg text-status-error rounded-2xl border border-status-error text-center">
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        /* Khata Accounts DataTable */
        <KhataAccountsTable
          role="cashier"
          accounts={paginatedAccounts}
          onSelectAccount={handleOpenLedger}
          onRecordPayment={(acc) => handleOpenPayment(acc)}
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
      )}

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
          handleOpenPayment(acc);
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
