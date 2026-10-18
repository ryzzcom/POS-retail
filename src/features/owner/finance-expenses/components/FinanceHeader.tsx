"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface FinanceHeaderProps {
  onAddExpense: () => void;
  selectedMonth?: string;
}

export function FinanceHeader({
  onAddExpense,
  selectedMonth = "October 2026",
}: FinanceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title & Explanatory Subtitle (Figma Node 3454:45151) */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <h1 className="font-heading font-semibold text-2xl sm:text-[28px] text-heading tracking-[-0.4px] leading-tight">
          Finance & Expenses
        </h1>
        <p className="font-sans text-xs sm:text-sm text-body leading-relaxed">
          Expenses count on their expense date. Cash only leaves an account when a payment is recorded.
        </p>
      </div>

      {/* Header Actions: Month Filter Pill & Add Expense Button */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 h-11 px-4 rounded-full bg-card border border-default/70 shadow-xs text-xs sm:text-sm font-sans font-medium text-heading">
          <Calendar className="size-4 text-muted shrink-0" />
          <span>{selectedMonth}</span>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={onAddExpense}
          leftIcon={<Plus className="size-4" />}
          className="h-11 px-5 rounded-full text-xs sm:text-sm font-medium shadow-xs"
        >
          New Add Expense
        </Button>
      </div>
    </div>
  );
}
