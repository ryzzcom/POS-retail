"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts";
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
    <PageHeader
      title="Finance & Expenses"
      description="Expenses count on their expense date. Cash only leaves an account when a payment is recorded."
      actions={
        <>
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
            Add expense
          </Button>
        </>
      }
    />
  );
}
