import { apiClient } from "@/lib/api-client";
import type {
  KhataAccount,
  KhataAgingSummary,
  KhataFilterOption,
  KhataLedgerEntry,
} from "../types/khata.types";

export interface KhataOverviewResponse {
  agingSummary: KhataAgingSummary;
  filterCounts: {
    all: number;
    overdue: number;
    within_terms: number;
    settled: number;
  };
  items: KhataAccount[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const khataReceivablesService = {
  /**
   * 1. GET /api/v1/khata/accounts
   */
  getKhataOverview: async (params?: {
    search?: string;
    status?: KhataFilterOption;
    page?: number;
    limit?: number;
  }): Promise<KhataOverviewResponse> => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.status && params.status !== "all") query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    query.set("limit", String(params?.limit || 50));

    const res = await apiClient.get<KhataOverviewResponse>(
      `/khata/accounts?${query.toString()}`
    );

    return {
      agingSummary: res.agingSummary || {
        totalReceivable: 0,
        totalOverdue: 0,
        withinTermsAmount: 0,
        overdue1to30Amount: 0,
        overdue31PlusAmount: 0,
        totalAccountsCount: 0,
        overdueAccountsCount: 0,
      },
      filterCounts: res.filterCounts || {
        all: 0,
        overdue: 0,
        within_terms: 0,
        settled: 0,
      },
      items: (res.items || []).map((item) => ({
        id: item.id,
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        status: item.status,
        oldestOpenDate: item.oldestOpenDate || "N/A",
        oldestOpenDays: item.oldestOpenDays || 0,
        creditLimit: item.creditLimit || 50000,
        balance: item.balance || 0,
        limitUsedPercent: item.limitUsedPercent || 0,
        lastPaymentDate: item.lastPaymentDate,
        lastPurchaseDate: item.lastPurchaseDate,
      })),
      meta: res.meta || {
        page: 1,
        limit: 50,
        total: (res.items || []).length,
        totalPages: 1,
      },
    };
  },

  /**
   * 2. GET /api/v1/khata/:customerId/ledger
   */
  getLedger: async (customerId: string): Promise<KhataLedgerEntry[]> => {
    try {
      const res = await apiClient.get<Array<{
        id: string;
        type: string;
        dateFormatted?: string;
        createdAt?: string;
        amountRupees?: number;
        amount?: number;
        balanceAfterRupees?: number;
        balanceAfter?: number;
        receiptNo?: string;
        notes?: string;
        description?: string;
        paymentMethod?: string;
      }>>(`/khata/${customerId}/ledger`);

      return (res || []).map((entry) => ({
        id: entry.id,
        accountId: customerId,
        type: entry.type === "CREDIT_SALE" ? "credit_sale" : "payment_received",
        date: entry.dateFormatted || (entry.createdAt ? new Date(entry.createdAt).toLocaleDateString("en-GB") : "Today"),
        amount: entry.amountRupees ?? (entry.amount ? entry.amount / 100 : 0),
        balanceAfter: entry.balanceAfterRupees ?? (entry.balanceAfter ? entry.balanceAfter / 100 : 0),
        receiptNo: entry.receiptNo,
        description: entry.notes || entry.description || "Khata transaction",
        paymentMethod: entry.paymentMethod,
      }));
    } catch {
      return [];
    }
  },

  /**
   * 3. POST /api/v1/khata/:customerId/payments
   */
  recordPayment: async (
    customerId: string,
    data: {
      amount: number;
      paymentMethod: string;
      receiptNo?: string;
      notes?: string;
    }
  ): Promise<{ success: boolean; newBalance: number }> => {
    return apiClient.post<{ success: boolean; newBalance: number }>(
      `/khata/${customerId}/payments`,
      data
    );
  },

  /**
   * 4. PATCH /api/v1/khata/:customerId/credit-limit
   */
  adjustCreditLimit: async (
    customerId: string,
    newCreditLimit: number,
    reason?: string
  ): Promise<{ success: boolean; creditLimit: number }> => {
    return apiClient.patch<{ success: boolean; creditLimit: number }>(
      `/khata/${customerId}/credit-limit`,
      { creditLimit: newCreditLimit, reason }
    );
  },

  /**
   * 5. POST /api/v1/khata/:customerId/remind
   */
  sendReminder: async (
    customerId: string,
    channel: string = "whatsapp"
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(
      `/khata/${customerId}/remind`,
      { channel }
    );
  },
};
