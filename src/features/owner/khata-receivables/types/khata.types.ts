export type KhataStatus = "overdue" | "within_terms" | "settled";

export type KhataFilterOption = "all" | "overdue" | "within_terms" | "settled";

export interface KhataLedgerEntry {
  id: string;
  accountId: string;
  type: "credit_sale" | "payment_received" | "adjustment";
  date: string;
  amount: number;
  balanceAfter: number;
  receiptNo?: string;
  description: string;
  paymentMethod?: string;
}

export interface KhataAccount {
  id: string;
  customerName: string;
  customerPhone: string;
  status: KhataStatus;
  oldestOpenDate: string;
  oldestOpenDays: number;
  creditLimit: number;
  balance: number;
  limitUsedPercent: number;
  lastPaymentDate?: string;
  lastPurchaseDate?: string;
  ledgerEntries?: KhataLedgerEntry[];
}

export interface KhataAgingSummary {
  totalReceivable: number;
  totalOverdue: number;
  withinTermsAmount: number;
  overdue1to30Amount: number;
  overdue31PlusAmount: number;
  totalAccountsCount: number;
  overdueAccountsCount: number;
}
