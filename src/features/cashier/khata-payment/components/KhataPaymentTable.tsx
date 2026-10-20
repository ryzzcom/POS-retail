"use client";

import {
  KhataAccountsTable,
} from "@/components/common/KhataAccountsTable";
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

/**
 * Re-export wrapper for Cashier KhataPaymentTable pointing to unified KhataAccountsTable with role="cashier".
 */
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
  return (
    <KhataAccountsTable
      role="cashier"
      accounts={accounts}
      onSelectAccount={onSelectAccount}
      onRecordPayment={onRecordPayment}
      onSendWhatsApp={onSendReminder}
      isLoading={isLoading}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
