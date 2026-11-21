import { apiClient } from "@/lib/api-client";
import {
  KhataAccount,
  KhataLedgerEntry,
  CashierKhataFilterState,
  CashierKhataSummary,
} from "../types/khata-payment.types";

interface BackendKhataAccountsResponse {
  agingSummary?: {
    totalReceivable: number;
    totalOverdue: number;
    overdueAccountsCount: number;
    totalAccountsCount: number;
  };
  items: KhataAccount[];
}

export const cashierKhataPaymentService = {
  fetchAccounts: async (
    filter?: CashierKhataFilterState
  ): Promise<{ items: KhataAccount[]; summary: CashierKhataSummary }> => {
    const query = new URLSearchParams();
    if (filter?.search) query.set("search", filter.search);
    if (filter?.status && filter.status !== "all") query.set("status", filter.status);

    const res = await apiClient.get<BackendKhataAccountsResponse>(
      `/khata/accounts${query.toString() ? `?${query.toString()}` : ""}`
    );

    const items = res?.items || [];
    const summary: CashierKhataSummary = {
      totalAccounts: res?.agingSummary?.totalAccountsCount || items.length,
      overdueCount: res?.agingSummary?.overdueAccountsCount || items.filter((i) => i.status === "overdue").length,
      totalOutstandingPKR: res?.agingSummary?.totalReceivable || items.reduce((acc, curr) => acc + (curr.balance || 0), 0),
      collectedTodayPKR: 0,
    };

    return { items, summary };
  },

  fetchLedger: async (customerId: string): Promise<KhataLedgerEntry[]> => {
    const res = await apiClient.get<{ entries: KhataLedgerEntry[] }>(
      `/khata/${customerId}/ledger`
    );
    return res?.entries || [];
  },

  recordPayment: async (
    customerId: string,
    data: {
      amount: number;
      paymentMethod: "CASH" | "BANK_TRANSFER" | "WALLET";
      reference?: string;
      notes?: string;
    }
  ): Promise<{ success: boolean }> => {
    await apiClient.post(`/khata/${customerId}/payments`, data);
    return { success: true };
  },
};
