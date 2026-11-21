"use client";

import * as React from "react";
import { useFinanceExpenses } from "../hooks/useFinanceExpenses";
import { FinanceHeader } from "./FinanceHeader";
import { FinancialSummaryCard } from "./FinancialSummaryCard";
import { ExpensesTable } from "./ExpensesTable";
import { BillsToPayCard } from "./BillsToPayCard";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { RecordPaymentDialog } from "./RecordPaymentDialog";
import { Loader2 } from "lucide-react";

export function FinanceExpensesView() {
  const {
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
  } = useFinanceExpenses();

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-dark-primary px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-sans flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Header with Title & Action Button */}
      <FinanceHeader onAddExpense={() => setIsAddExpenseOpen(true)} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-default">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-body">Loading finance & expense records...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-status-error-bg text-status-error rounded-2xl border border-status-error text-center">
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* 2. Top Metric Cards Strip & Category Breakdown */}
          <FinancialSummaryCard summary={summary} />

          {/* 3. Bills to Pay Card */}
          <BillsToPayCard
            bills={bills}
            onPayBill={handleOpenPaymentForBill}
          />

          {/* 4. Filterable Expenses History Table */}
          <ExpensesTable
            expenses={expenses}
            onRecordPayment={handleOpenPaymentForExpense}
          />
        </>
      )}

      {/* 5. Add Expense Modal Dialog */}
      <AddExpenseDialog
        open={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSaveExpense={handleAddExpense}
      />

      {/* 6. Record Payment Modal Dialog */}
      <RecordPaymentDialog
        open={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        targetItem={paymentTarget}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
