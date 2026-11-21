import { apiClient } from "@/lib/api-client";
import {
  ShiftSummary,
  ShiftTransaction,
  CashDrawerEntry,
  CashDrawerFormValues,
  CloseShiftFormValues,
  QuickCustomerFormValues,
} from "../types/shift.types";

interface BackendCurrentShiftResponse {
  id: string;
  status: string;
  openedAt: string;
  openedAtFormatted?: string;
  cashier?: {
    id: string;
    fullName?: string;
    name?: string;
  };
  openingCashPaisa?: string | number;
  openingCash?: number;
  totalSalesCash?: number;
  totalSalesDigital?: number;
  totalSalesKhata?: number;
  totalCashIn?: number;
  totalCashOut?: number;
  expectedCashInDrawer?: number;
  totalTransactionsCount?: number;
  transactions?: Array<{
    id: string;
    time?: string;
    createdAt?: string;
    customerName?: string;
    totalAmount?: number;
    paymentMethod?: string;
    itemsCount?: number;
  }>;
  movements?: Array<{
    id: string;
    type: string;
    amount: number;
    reason: string;
    createdAt?: string;
  }>;
}

export const shiftService = {
  getCurrentShift: async (): Promise<{
    summary: ShiftSummary | null;
    transactions: ShiftTransaction[];
    adjustments: CashDrawerEntry[];
  }> => {
    const res = await apiClient.get<BackendCurrentShiftResponse | null>("/shifts/current");
    if (!res) {
      return { summary: null, transactions: [], adjustments: [] };
    }

    const summary: ShiftSummary = {
      status: res.status?.toLowerCase() === "open" ? "open" : "closed",
      openedAt: res.openedAtFormatted || res.openedAt || "Today",
      openedBy: res.cashier?.fullName || res.cashier?.name || "Cashier",
      startingFloatPKR: res.openingCash || 5000,
      netSalesPKR: (res.totalSalesCash || 0) + (res.totalSalesDigital || 0),
      receiptsCount: res.totalTransactionsCount || 0,
      cashCollectedPKR: res.totalSalesCash || 0,
      cardDigitalCollectedPKR: res.totalSalesDigital || 0,
      cashInTotalPKR: res.totalCashIn || 0,
      cashOutTotalPKR: res.totalCashOut || 0,
      expectedCashInDrawerPKR: res.expectedCashInDrawer || 0,
    };

    const transactions: ShiftTransaction[] = (res.transactions || []).map((t) => ({
      id: t.id,
      time: t.time || t.createdAt?.split("T")[1]?.slice(0, 5) || "Now",
      customerName: t.customerName || "Walk-in Customer",
      amountPKR: t.totalAmount || 0,
      paymentMethod: t.paymentMethod || "Cash",
      itemsCount: t.itemsCount || 1,
    }));

    const adjustments: CashDrawerEntry[] = (res.movements || []).map((m) => ({
      id: m.id,
      type: m.type?.toLowerCase() === "cash_in" ? "cash_in" : "cash_out",
      amountPKR: m.amount,
      reason: m.reason,
      createdAt: m.createdAt || "Recent",
    }));

    return { summary, transactions, adjustments };
  },

  openShift: async (openingFloat: number, notes?: string): Promise<{ success: boolean }> => {
    await apiClient.post("/shifts/open", {
      openingCash: openingFloat,
      notes,
    });
    return { success: true };
  },

  recordCashMovement: async (
    values: CashDrawerFormValues
  ): Promise<{ success: boolean }> => {
    await apiClient.post("/shifts/cash-movement", {
      type: values.type === "cash_in" ? "CASH_IN" : "CASH_OUT",
      amount: values.amount,
      reason: values.reason,
      notes: values.notes,
    });
    return { success: true };
  },

  closeShift: async (
    values: CloseShiftFormValues
  ): Promise<{ success: boolean }> => {
    await apiClient.post("/shifts/close", {
      actualCash: values.actualCash,
      notes: values.notes,
    });
    return { success: true };
  },

  quickRegisterCustomer: async (
    values: QuickCustomerFormValues
  ): Promise<{ success: boolean; customer?: { id: string; name: string } }> => {
    const res = await apiClient.post<{ id: string; name: string }>("/pos/customers/quick", {
      name: values.fullName,
      phone: values.phoneNumber,
      email: values.email || undefined,
    });
    return { success: true, customer: res };
  },
};
