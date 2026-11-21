import { apiClient } from "@/lib/api-client";
import type {
  ReceiptSummary,
  PaymentMethod,
  WhatsAppDeliveryStatus,
} from "../types/sales-history.types";

export interface SalesHistoryResponse {
  summary: {
    receiptsCount: number;
    itemsCount: number;
    totalSalesPKR: number;
  };
  items: ReceiptSummary[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReceiptDetailPayload {
  receiptNo: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string;
  cashierName: string;
  counterName: string;
  status: string;
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paidAmount: number;
  changeGiven: number;
  paymentMethod: string;
  whatsappStatus: string;
  items: Array<{
    id: string;
    productName: string;
    variantLabel: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

function mapPaymentMethod(backendMethod?: string): PaymentMethod {
  if (!backendMethod) return "cash";
  const m = backendMethod.toLowerCase();
  if (m.includes("card")) return "card";
  if (m.includes("bank")) return "bank_transfer";
  if (m.includes("khata")) return "khata_credit";
  if (m.includes("wallet")) return "wallet";
  return "cash";
}

function mapWhatsAppStatus(status?: string): WhatsAppDeliveryStatus {
  if (!status) return "not_sent";
  const s = status.toLowerCase();
  if (s === "delivered" || s === "sent") return "delivered";
  if (s === "failed") return "failed";
  return "not_sent";
}

export const salesHistoryService = {
  /**
   * 1. GET /api/v1/sales
   */
  getSales: async (params?: {
    search?: string;
    paymentMethod?: string;
    page?: number;
    limit?: number;
  }): Promise<SalesHistoryResponse> => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.paymentMethod && params.paymentMethod !== "all") {
      query.set("paymentMethod", params.paymentMethod);
    }
    if (params?.page) query.set("page", String(params.page));
    query.set("limit", String(params?.limit || 50));

    const res = await apiClient.get<{
      summary: {
        receiptsCount: number;
        itemsCount: number;
        totalSalesPKR: number;
      };
      items: Array<{
        id: string;
        receiptNo?: string;
        receiptNumber?: string;
        timeLabel?: string;
        time?: string;
        itemsCount?: number;
        itemCount?: number;
        customerName?: string;
        customerPhone?: string;
        paidByMethod?: string;
        paidBy?: string;
        cashierName?: string;
        whatsappStatus?: string;
        totalAmountPKR?: number;
        total?: number;
      }>;
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/sales?${query.toString()}`);

    const items: ReceiptSummary[] = (res.items || []).map((i) => {
      const pm = mapPaymentMethod(i.paidByMethod || i.paidBy);
      return {
        id: i.id,
        receiptNumber: i.receiptNumber || i.receiptNo || "REC-000",
        time: i.time || i.timeLabel || "Just now",
        itemCount: i.itemCount || i.itemsCount || 1,
        customerName: i.customerName || "Walk-in Customer",
        customerPhone: i.customerPhone,
        paymentMethod: pm,
        paymentMethodLabel: i.paidBy || (pm === "khata_credit" ? "Khata Credit" : pm.toUpperCase()),
        cashierName: i.cashierName || "Cashier",
        whatsappStatus: mapWhatsAppStatus(i.whatsappStatus),
        totalAmount: i.totalAmountPKR || i.total || 0,
      };
    });

    return {
      summary: res.summary || {
        receiptsCount: items.length,
        itemsCount: items.reduce((sum, r) => sum + r.itemCount, 0),
        totalSalesPKR: items.reduce((sum, r) => sum + r.totalAmount, 0),
      },
      items,
      meta: res.meta || {
        page: 1,
        limit: 50,
        total: items.length,
        totalPages: 1,
      },
    };
  },

  /**
   * 2. GET /api/v1/sales/:receiptNo
   */
  getReceiptDetail: async (receiptNo: string): Promise<ReceiptDetailPayload> => {
    return apiClient.get<ReceiptDetailPayload>(`/sales/${receiptNo}`);
  },

  /**
   * 3. POST /api/v1/sales/:receiptNo/reprint
   */
  reprintReceipt: async (receiptNo: string): Promise<{ success: boolean; reprintCount: number }> => {
    return apiClient.post<{ success: boolean; reprintCount: number }>(`/sales/${receiptNo}/reprint`);
  },

  /**
   * 4. POST /api/v1/sales/:receiptNo/returns
   */
  processReturn: async (
    receiptNo: string,
    data: {
      items: Array<{ itemId: string; quantity: number; condition?: string }>;
      reason: string;
      refundMethod: string;
    }
  ): Promise<{ success: boolean; refundAmount: number }> => {
    return apiClient.post<{ success: boolean; refundAmount: number }>(
      `/sales/${receiptNo}/returns`,
      data
    );
  },

  /**
   * 5. POST /api/v1/sales/:receiptNo/whatsapp-retry
   */
  retryWhatsApp: async (
    receiptNo: string,
    phone?: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(
      `/sales/${receiptNo}/whatsapp-retry`,
      { phone }
    );
  },
};
