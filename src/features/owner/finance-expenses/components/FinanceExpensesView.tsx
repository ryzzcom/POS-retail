"use client";

import * as React from "react";
import { ExpenseItem, BillItem, FinanceSummary } from "../types/finance-expenses.types";
import { initialFinanceSummary, initialExpenses, initialBillsToPay } from "../constants/finance-mock";
import { FinanceHeader } from "./FinanceHeader";
import { FinancialSummaryCard } from "./FinancialSummaryCard";
import { ExpensesTable } from "./ExpensesTable";
import { BillsToPayCard } from "./BillsToPayCard";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { RecordPaymentDialog } from "./RecordPaymentDialog";

export function FinanceExpensesView() {
  const [summary, setSummary] = React.useState<FinanceSummary>(initialFinanceSummary);
  const [expenses, setExpenses] = React.useState<ExpenseItem[]>(initialExpenses);
  const [bills, setBills] = React.useState<BillItem[]>(initialBillsToPay);
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

  const handleAddExpense = (newExpense: ExpenseItem) => {
    setExpenses((prev) => [newExpense, ...prev]);

    // If unpaid, add to bills list
    if (newExpense.status === "unpaid") {
      const newBill: BillItem = {
        id: `bill-${Date.now()}`,
        vendor: newExpense.vendor,
        dueDate: `Due ${newExpense.date}`,
        amount: newExpense.amount,
        category: newExpense.category,
        status: "unpaid",
        expenseId: newExpense.id,
      };
      setBills((prev) => [newBill, ...prev]);
    }

    // Update summary metrics
    setSummary((prev) => {
      const isPaid = newExpense.status === "paid";
      const totalRec = prev.totalExpensesRecorded + newExpense.amount;
      const actuallyPaid = isPaid ? prev.actuallyPaid + newExpense.amount : prev.actuallyPaid;
      const stillOwed = !isPaid ? prev.stillOwed + newExpense.amount : prev.stillOwed;
      let bank = prev.paidFromBank;
      let cash = prev.paidFromCashDrawer;
      let petty = prev.paidFromPettyCash;

      if (isPaid) {
        if (newExpense.paidFrom === "Bank") bank += newExpense.amount;
        else if (newExpense.paidFrom === "Cash drawer") cash += newExpense.amount;
        else if (newExpense.paidFrom === "Petty cash") petty += newExpense.amount;
      }

      return {
        ...prev,
        totalExpensesRecorded: totalRec,
        actuallyPaid,
        stillOwed,
        paidFromBank: bank,
        paidFromCashDrawer: cash,
        paidFromPettyCash: petty,
      };
    });

    showNotification(`Expense "${newExpense.title}" recorded successfully.`);
  };

  const handleOpenPaymentForExpense = (expense: ExpenseItem) => {
    setPaymentTarget(expense);
    setIsRecordPaymentOpen(true);
  };

  const handleOpenPaymentForBill = (bill: BillItem) => {
    setPaymentTarget(bill);
    setIsRecordPaymentOpen(true);
  };

  const handleConfirmPayment = (
    item: ExpenseItem | BillItem,
    paidFrom: string,
    amount: number,
    referenceNo?: string
  ) => {
    const isExpense = "category" in item && "paidFrom" in item;

    if (isExpense) {
      const expenseItem = item as ExpenseItem;
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === expenseItem.id
            ? { ...e, status: "paid", paidFrom, paidAmount: amount, referenceNo }
            : e
        )
      );

      // Also update matching bill if any
      setBills((prev) =>
        prev.map((b) => (b.expenseId === expenseItem.id ? { ...b, status: "paid" } : b))
      );
    } else {
      const billItem = item as BillItem;
      setBills((prev) =>
        prev.map((b) => (b.id === billItem.id ? { ...b, status: "paid" } : b))
      );

      // Also update matching expense if any
      if (billItem.expenseId) {
        setExpenses((prev) =>
          prev.map((e) =>
            e.id === billItem.expenseId
              ? { ...e, status: "paid", paidFrom, paidAmount: amount, referenceNo }
              : e
          )
        );
      }
    }

    // Adjust financial summary
    setSummary((prev) => {
      let bank = prev.paidFromBank;
      let cash = prev.paidFromCashDrawer;
      let petty = prev.paidFromPettyCash;

      if (paidFrom === "Bank") bank += amount;
      else if (paidFrom === "Cash drawer") cash += amount;
      else if (paidFrom === "Petty cash") petty += amount;

      return {
        ...prev,
        actuallyPaid: prev.actuallyPaid + amount,
        stillOwed: Math.max(0, prev.stillOwed - amount),
        paidFromBank: bank,
        paidFromCashDrawer: cash,
        paidFromPettyCash: petty,
      };
    });

    showNotification(`Payment of Rs. ${amount.toLocaleString()} recorded successfully.`);
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-dark-primary px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-sans flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Header (Figma Node 3454:45151) */}
      <FinanceHeader
        onAddExpense={() => setIsAddExpenseOpen(true)}
        selectedMonth="October 2026"
      />

      {/* 2. Top Financial Metrics & Category Breakdown Card */}
      <FinancialSummaryCard summary={summary} />

      {/* 3. Bottom Row: Entries Data Table & Bills to Pay Sidebar */}
      <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <ExpensesTable
          expenses={expenses}
          onRecordPayment={handleOpenPaymentForExpense}
        />

        <BillsToPayCard
          bills={bills}
          onPayBill={handleOpenPaymentForBill}
        />
      </div>

      {/* 4. Add Expense Modal Dialog (Figma Node 3454:47903) */}
      <AddExpenseDialog
        open={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSaveExpense={handleAddExpense}
      />

      {/* 5. Record Payment Modal Dialog */}
      <RecordPaymentDialog
        open={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        targetItem={paymentTarget}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
