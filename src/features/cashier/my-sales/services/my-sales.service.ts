import { apiClient } from "@/lib/api-client";
import {
  CashierSaleItem,
  CashierPaymentMethod,
  CashierWhatsAppStatus,
  MySalesSummary,
} from "../types/my-sales.types";

interface BackendSalesResponse {
  summary?: {
    totalSalesCount?: number;
    totalRevenuePKR?: number;
    todaySalesPKR?: number;
    cashSalesPKR?: number;
    cardDigitalSalesPKR?: number;
  };
  items: Array<{
    id: string;
    receiptNo: string;
    dateFormatted?: string;
    timeFormatted?: string;
    createdAt: string;
    customer?: {
      name?: string;
      phone?: string;
    };
    cashier?: {
      name?: string;
    };
    totalItemsCount?: number;
    itemsSummary?: string;
    netSalesPKR: number;
    payments?: Array<{
      method: string;
      amount: number;
    }>;
    paymentMethodLabel?: string;
    paymentMethod?: string;
    whatsappStatus?: string;
  }>;
}

export const mySalesService = {
  fetchMySales: async (
    params?: { search?: string; paymentMethod?: CashierPaymentMethod }
  ): Promise<{ items: CashierSaleItem[]; summary: MySalesSummary }> => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.paymentMethod && params.paymentMethod !== "all") {
      query.set("paymentMethod", params.paymentMethod.toUpperCase());
    }

    const res = await apiClient.get<BackendSalesResponse>(
      `/sales${query.toString() ? `?${query.toString()}` : ""}`
    );

    const rawItems = res?.items || [];
    let totalItems = 0;

    const items: CashierSaleItem[] = rawItems.map((s) => {
      totalItems += s.totalItemsCount || 1;
      let pm: CashierPaymentMethod = "cash";
      const methodStr = (s.paymentMethod || "").toLowerCase();
      if (methodStr.includes("card")) pm = "card";
      else if (methodStr.includes("wallet")) pm = "wallet";
      else if (methodStr.includes("khata")) pm = "khata_credit";

      let wa: CashierWhatsAppStatus = "delivered";
      if (s.whatsappStatus?.toLowerCase() === "failed") wa = "failed";
      else if (s.whatsappStatus?.toLowerCase() === "not_sent") wa = "not_sent";

      return {
        id: s.id,
        receiptNumber: s.receiptNo,
        time: s.timeFormatted || s.dateFormatted || s.createdAt?.split("T")[1]?.slice(0, 5) || "Recent",
        itemsCount: s.totalItemsCount || 1,
        itemsSummary: s.itemsSummary || "Garments & boutique items",
        customerName: s.customer?.name || "Walk-in Customer",
        customerPhone: s.customer?.phone,
        paidBy: s.paymentMethodLabel || "Cash",
        paidByMethod: pm,
        whatsappStatus: wa,
        totalAmountPKR: s.netSalesPKR,
        cashierName: s.cashier?.name || "Cashier",
      };
    });

    const summary: MySalesSummary = {
      receiptsCount: items.length,
      itemsCount: totalItems,
      totalSalesPKR: items.reduce((acc, curr) => acc + curr.totalAmountPKR, 0),
    };

    return { items, summary };
  },

  reprintReceipt: async (receiptNo: string): Promise<{ success: boolean }> => {
    await apiClient.post(`/sales/${receiptNo}/reprint`, {});
    return { success: true };
  },
};
