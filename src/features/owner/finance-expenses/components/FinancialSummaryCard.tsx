"use client";

import * as React from "react";
import { FinanceSummary } from "../types/finance-expenses.types";
import { formatPKR } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface FinancialSummaryCardProps {
  summary: FinanceSummary;
}

export function FinancialSummaryCard({ summary }: FinancialSummaryCardProps) {
  return (
    <div className="w-full bg-card rounded-[22px] sm:rounded-[26px] p-6 sm:p-7 border border-default/60 shadow-xs flex flex-col lg:flex-row gap-8 items-stretch select-none">
      {/* ========================================================================= */}
      {/* 1. LEFT COLUMN: EXPENSES RECORDED & ACCOUNT TOTALS                       */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between gap-6">
        {/* Hero: Expenses Recorded */}
        <div className="flex flex-col">
          <span className="font-sans text-xs sm:text-sm text-body">
            Expenses recorded
          </span>
          <span className="font-heading font-semibold text-3xl sm:text-[34px] text-heading tracking-tight mt-1">
            {formatPKR(summary.totalExpensesRecorded)}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={cn(
                "text-xs font-sans font-medium flex items-center gap-1",
                summary.isIncrease ? "text-status-error" : "text-status-success"
              )}
            >
              <span>{summary.isIncrease ? "▲" : "▼"}</span>
              <span>{summary.percentVsPreviousMonth}% vs previous month</span>
            </span>
          </div>
        </div>
        {/* Sub-Metrics Grid */}
        <div className="flex flex-col gap-5 pt-2">
          {/* Row 1: Actually paid & Still owed */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="font-sans text-xs text-body">Actually paid</span>
              <span className="font-heading font-semibold text-xl sm:text-2xl text-heading mt-1">
                {formatPKR(summary.actuallyPaid)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-sans text-xs text-body">Still owed</span>
              <span className="font-heading font-semibold text-xl sm:text-2xl text-accent mt-1">
                {formatPKR(summary.stillOwed)}
              </span>
            </div>
          </div>

          {/* Row 2: Paid from bank & Paid from cash drawer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="font-sans text-xs text-body">Paid from bank</span>
              <span className="font-heading font-medium text-sm sm:text-base text-heading mt-1">
                {formatPKR(summary.paidFromBank)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-sans text-xs text-body">Paid from cash drawer</span>
              <span className="font-heading font-medium text-sm sm:text-base text-heading mt-1">
                {formatPKR(summary.paidFromCashDrawer)}
              </span>
            </div>
          </div>

          {/* Row 3: Paid from petty cash */}
          <div className="flex flex-col">
            <span className="font-sans text-xs text-body">Paid from petty cash</span>
            <span className="font-heading font-medium text-sm sm:text-base text-heading mt-1">
              {formatPKR(summary.paidFromPettyCash)}
            </span>
          </div>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden lg:block w-px bg-default/40 self-stretch" />

      {/* ========================================================================= */}
      {/* 2. RIGHT COLUMN: "WHERE IT WENT" CATEGORY BREAKDOWN                       */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0 flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-base sm:text-lg text-heading">
          Where it went
        </h3>

        <div className="flex flex-col gap-4">
          {summary.breakdowns.map((item) => (
            <div key={item.category} className="flex flex-col gap-1.5">
              {/* Category Name & Amount */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
                <span className="font-medium text-heading">{item.category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-medium text-heading">
                    {formatPKR(item.amount)}
                  </span>
                  <span className="text-xs text-muted w-8 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-subtle/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%` }}
                />
              </div>

              {/* Last month comparison note */}
              <span className="font-sans text-[11px] text-muted">
                Last month {formatPKR(item.lastMonthAmount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
