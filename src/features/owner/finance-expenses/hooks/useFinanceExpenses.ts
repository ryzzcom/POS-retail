"use client";

import * as React from "react";
import {
  ExpenseItem,
  BillItem,
  FinanceSummary,
} from "../types/finance-expenses.types";
import { initialFinanceSummary } from "../constants/finance-mock";
import { financeExpensesService } from "../services/finance-expenses.service";
import {
  ExpenseFormValues,
  RecordPaymentFormValues,
} from "../schemas/finance-expenses.schemas";

export function useFinanceExpenses() {
  const [summary, setSummary] = React.useState<FinanceSummary>(initialFinanceSummary);
  const [expenses, setExpenses] = React.useState<ExpenseItem[]>([]);
  const [bills, setBills] = React.useState<BillItem[]>([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Dialog State
  const [isAddExpenseOpen, setIsAddExpenseOpen] = React.useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = React.useState(false);
  const [paymentTarget, setPaymentTarget] = React.useState<ExpenseItem | BillItem | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await financeExpensesService.fetchFinanceOverview();
      setSummary(data.summary);
      setExpenses(data.expenses);
      setBills(data.bills);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load financial data";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddExpense = async (input: ExpenseItem | ExpenseFormValues) => {
    try {
      const isExpenseItem = "date" in input;
      const formValues: ExpenseFormValues = isExpenseItem
        ? {
            title: input.title,
            category: input.category,
            amount: input.amount,
            expenseDate: input.date,
            vendor: input.vendor,
            paymentStatus: input.status,
            paidFrom: typeof input.paidFrom === "string" ? input.paidFrom : "Cash drawer",
            referenceNo: input.referenceNo,
            repeatsMonthly: !!input.repeatsMonthly,
            notes: input.notes,
          }
        : input;

      await financeExpensesService.createExpense(formValues);
      showNotification(`Expense "${input.title}" recorded successfully.`);
      setIsAddExpenseOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record expense";
      showNotification(`Error: ${msg}`);
    }
  };

  const handleOpenPaymentForExpense = (expense: ExpenseItem) => {
    setPaymentTarget(expense);
    setIsRecordPaymentOpen(true);
  };

  const handleOpenPaymentForBill = (bill: BillItem) => {
    setPaymentTarget(bill);
    setIsRecordPaymentOpen(true);
  };

  const handleConfirmPayment = async (
    item: ExpenseItem | BillItem,
    paidFrom: string,
    amount: number,
    referenceNo?: string
  ) => {
    try {
      const targetId = "expenseId" in item && item.expenseId ? item.expenseId : item.id;
      const paymentValues: RecordPaymentFormValues = {
        paidFrom,
        amount,
        paymentDate: new Date().toISOString().split("T")[0],
        referenceNo,
      };

      await financeExpensesService.payExpense(targetId, paymentValues);
      showNotification("Payment recorded successfully.");
      setIsRecordPaymentOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record payment";
      showNotification(`Error: ${msg}`);
    }
  };

  return {
    summary,
    expenses,
    bills,
    isLoading,
    error,
    notification,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    isRecordPaymentOpen,
    setIsRecordPaymentOpen,
    paymentTarget,
    handleAddExpense,
    handleOpenPaymentForExpense,
    handleOpenPaymentForBill,
    handleConfirmPayment,
    refreshData: loadData,
  };
}
