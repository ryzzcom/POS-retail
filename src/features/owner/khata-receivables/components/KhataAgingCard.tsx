"use client";

import * as React from "react";
import { formatPKR } from "@/lib/formatters";
import { KhataAgingSummary } from "../types/khata.types";
import { cn } from "@/lib/utils";

interface KhataAgingCardProps {
  summary: KhataAgingSummary;
  className?: string;
}

export function KhataAgingCard({ summary, className }: KhataAgingCardProps) {
  const total = summary.totalReceivable || 1;
  const withinTermsPct = Math.max(5, (summary.withinTermsAmount / total) * 100);
  const overdue1to30Pct = Math.max(5, (summary.overdue1to30Amount / total) * 100);
  const overdue31PlusPct = Math.max(5, (summary.overdue31PlusAmount / total) * 100);

  return (
    <div
      className={cn(
        "w-full rounded-[22px] bg-card border border-default p-5 sm:p-6 shadow-xs select-none",
        className
      )}
    >
      {/* 1. Header: Metric Title, Hero Amount & Overdue Notice (Figma Node 3456:49372) */}
      <div className="flex flex-col">
        <span className="font-sans text-xs sm:text-sm text-body">
          Customers owe you
        </span>
        <h2 className="font-heading font-semibold text-3xl sm:text-[32px] text-heading tracking-[-0.5px] leading-tight mt-1">
          {formatPKR(summary.totalReceivable)}
        </h2>
        <span className="font-sans text-xs sm:text-sm text-status-error font-medium mt-1">
          {formatPKR(summary.totalOverdue)} overdue
        </span>
      </div>

      {/* 2. Multi-Segment Aging Progress Bar (Figma Node 3456:49379) */}
      <div
        className="h-3.5 w-full rounded-full bg-subtle overflow-hidden flex items-center my-4 sm:my-5"
        role="progressbar"
        aria-label="Receivables aging breakdown"
      >
        {/* Within Terms (Dark Green / Primary) */}
        <div
          style={{ width: `${withinTermsPct}%` }}
          className="bg-primary h-full transition-all duration-300"
          title={`Within terms: ${formatPKR(summary.withinTermsAmount)}`}
        />

        {/* 1–30 Days Overdue (Gold / Accent) */}
        <div
          style={{ width: `${overdue1to30Pct}%` }}
          className="bg-accent h-full transition-all duration-300"
          title={`1–30 days overdue: ${formatPKR(summary.overdue1to30Amount)}`}
        />

        {/* 31–60+ Days Overdue (Red / Status Error) */}
        <div
          style={{ width: `${overdue31PlusPct}%` }}
          className="bg-status-error h-full transition-all duration-300"
          title={`31–60+ days overdue: ${formatPKR(summary.overdue31PlusAmount)}`}
        />
      </div>

      {/* 3. Aging Legend Items (Figma Node 3456:49383) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 pt-1">
        {/* Item 1: Within Terms */}
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 sm:size-3 rounded-full bg-primary shrink-0" />
          <span className="font-sans text-xs sm:text-sm text-body whitespace-nowrap">
            Within terms
          </span>
          <span className="font-heading font-medium text-xs sm:text-sm text-heading ml-1 whitespace-nowrap">
            {formatPKR(summary.withinTermsAmount)}
          </span>
        </div>

        {/* Item 2: 1–30 Days Overdue */}
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 sm:size-3 rounded-full bg-accent shrink-0" />
          <span className="font-sans text-xs sm:text-sm text-body whitespace-nowrap">
            1–30 days overdue
          </span>
          <span className="font-heading font-medium text-xs sm:text-sm text-heading ml-1 whitespace-nowrap">
            {formatPKR(summary.overdue1to30Amount)}
          </span>
        </div>

        {/* Item 3: 31–60+ Days Overdue */}
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 sm:size-3 rounded-full bg-status-error shrink-0" />
          <span className="font-sans text-xs sm:text-sm text-body whitespace-nowrap">
            31–60+ days overdue
          </span>
          <span className="font-heading font-medium text-xs sm:text-sm text-heading ml-1 whitespace-nowrap">
            {formatPKR(summary.overdue31PlusAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
