import { KhataAccount, KhataStatus, KhataLedgerEntry } from "@/features/owner/khata-receivables/types/khata.types";

export type { KhataAccount, KhataStatus, KhataLedgerEntry };

export type CashierKhataStatusFilter = "all" | "overdue" | "within_terms";

export interface CashierKhataFilterState {
  search: string;
  status: CashierKhataStatusFilter;
}

export interface CashierKhataSummary {
  totalAccounts: number;
  overdueCount: number;
  totalOutstandingPKR: number;
  collectedTodayPKR: number;
}
