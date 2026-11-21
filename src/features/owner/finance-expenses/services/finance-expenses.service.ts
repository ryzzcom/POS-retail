import { apiClient } from "@/lib/api-client";
import {
  FinanceSummary,
  ExpenseItem,
  BillItem,
  PaymentStatus,
} from "../types/finance-expenses.types";
import {
  ExpenseFormValues,
  RecordPaymentFormValues,
} from "../schemas/finance-expenses.schemas";

interface BackendExpensesResponse {
  summary: {
    expensesRecordedPKR: number;
    previousMonthPKR: number;
    vsPreviousMonthPct: number;
    actuallyPaidPKR: number;
    stillOwedPKR: number;
    paidBreakdown: {
      bankPKR: number;
      cashDrawerPKR: number;
      pettyCashPKR: number;
    };
  };
  whereItWent: Array<{
    bucket: string;
    amountPKR: number;
    sharePct: number;
    lastMonthPKR: number;
  }>;
  billsToPay: {
    pendingCount: number;
    items: Array<{
      id: string;
      vendorName?: string;
      dueDateFormatted?: string;
      remainingDuePKR?: number;
      category?: string;
      status?: string;
      expenseId?: string;
    }>;
  };
  items: Array<{
    id: string;
    title: string;
    category: string;
    vendorName: string;
    dateFormatted?: string;
    expenseDate?: string;
    paidFromLabel?: string;
    paidFrom?: string;
    paymentStatus: string;
    amountPKR: number;
    paidAmountPKR?: number;
    referenceNo?: string;
    repeatsMonthly?: boolean;
    notes?: string;
  }>;
}

export const financeExpensesService = {
  fetchFinanceOverview: async (): Promise<{
    summary: FinanceSummary;
    expenses: ExpenseItem[];
    bills: BillItem[];
  }> => {
    const res = await apiClient.get<BackendExpensesResponse>("/finance/expenses");

    const breakdowns = (res.whereItWent || []).map((b) => ({
      category: b.bucket,
      amount: b.amountPKR,
      percentage: b.sharePct,
      lastMonthAmount: b.lastMonthPKR,
    }));

    const summary: FinanceSummary = {
      totalExpensesRecorded: res.summary?.expensesRecordedPKR || 0,
      percentVsPreviousMonth: Math.abs(res.summary?.vsPreviousMonthPct || 0),
      isIncrease: (res.summary?.vsPreviousMonthPct || 0) >= 0,
      actuallyPaid: res.summary?.actuallyPaidPKR || 0,
      stillOwed: res.summary?.stillOwedPKR || 0,
      paidFromBank: res.summary?.paidBreakdown?.bankPKR || 0,
      paidFromCashDrawer: res.summary?.paidBreakdown?.cashDrawerPKR || 0,
      paidFromPettyCash: res.summary?.paidBreakdown?.pettyCashPKR || 0,
      breakdowns,
    };

    const expenses: ExpenseItem[] = (res.items || []).map((e) => {
      let status: PaymentStatus = "paid";
      if (e.paymentStatus === "UNPAID") status = "unpaid";
      else if (e.paymentStatus === "PARTIAL") status = "partial";

      return {
        id: e.id,
        title: e.title,
        category: e.category,
        vendor: e.vendorName,
        date: e.dateFormatted || e.expenseDate?.split("T")[0] || "",
        paidFrom: e.paidFromLabel || (e.paidFrom === "BANK" ? "Bank" : e.paidFrom === "CASH_DRAWER" ? "Cash drawer" : e.paidFrom === "PETTY_CASH" ? "Petty cash" : "Not paid"),
        status,
        amount: e.amountPKR,
        paidAmount: e.paidAmountPKR,
        referenceNo: e.referenceNo,
        repeatsMonthly: !!e.repeatsMonthly,
        notes: e.notes,
      };
    });

    const bills: BillItem[] = (res.billsToPay?.items || []).map((b) => ({
      id: b.id,
      vendor: b.vendorName || "Vendor",
      dueDate: b.dueDateFormatted || "Upcoming",
      amount: b.remainingDuePKR || 0,
      category: b.category || "General",
      status: (b.status?.toLowerCase() === "partial" ? "partial" : "unpaid") as PaymentStatus,
      expenseId: b.expenseId || b.id,
    }));

    return {
      summary,
      expenses,
      bills,
    };
  },

  createExpense: async (
    values: ExpenseFormValues
  ): Promise<{ success: boolean; id?: string }> => {
    let paidFrom = "NOT_PAID";
    if (values.paidFrom === "Bank") paidFrom = "BANK";
    else if (values.paidFrom === "Cash drawer") paidFrom = "CASH_DRAWER";
    else if (values.paidFrom === "Petty cash") paidFrom = "PETTY_CASH";

    const payload = {
      title: values.title,
      category: values.category,
      vendorName: values.vendor,
      amount: values.amount,
      paidAmount: values.paymentStatus === "paid" ? values.amount : 0,
      paymentStatus: values.paymentStatus.toUpperCase(),
      paidFrom,
      expenseDate: values.expenseDate ? new Date(values.expenseDate).toISOString() : new Date().toISOString(),
      referenceNo: values.referenceNo,
      repeatsMonthly: values.repeatsMonthly,
      notes: values.notes,
    };

    const res = await apiClient.post<{ id?: string }>("/finance/expenses", payload);
    return { success: true, id: res?.id };
  },

  payExpense: async (
    id: string,
    values: RecordPaymentFormValues
  ): Promise<{ success: boolean }> => {
    let paidFrom = "BANK";
    if (values.paidFrom === "Cash drawer") paidFrom = "CASH_DRAWER";
    else if (values.paidFrom === "Petty cash") paidFrom = "PETTY_CASH";

    const payload = {
      amount: values.amount,
      paidFrom,
      referenceNo: values.referenceNo,
    };

    await apiClient.post(`/finance/expenses/${id}/pay`, payload);
    return { success: true };
  },
};
