"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/formatters";
import { HeroSalesData, HeroProfitData } from "../types/dashboard.types";
import { RevenueTrendChart } from "./RevenueTrendChart";
import { MetricTooltip } from "./MetricTooltip";

interface RevenueHeroCardProps {
  sales: HeroSalesData;
  profit: HeroProfitData;
  className?: string;
}

export function RevenueHeroCard({
  sales,
  profit,
  className,
}: RevenueHeroCardProps) {
  return (
    <div
      className={cn(
        "w-full bg-card rounded-[22px] p-5 sm:p-6 border border-default/40 shadow-xs flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 select-none",
        className
      )}
    >
      {/* Left Column: Net Sales KPI, Breakdown & Trend Curve */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Header Title with Calculation Tooltip */}
          <div className="flex items-center gap-1.5 text-sm text-body">
            <MetricTooltip
              label="Net sales"
              explanation="Gross sales minus customer discounts and returns recorded today."
            />
            <span aria-hidden="true">·</span>
            <span>Today</span>
          </div>

          {/* Primary High-Contrast Net Sales Hero Figure */}
          <div className="mt-1 font-heading font-semibold text-3xl sm:text-[32px] text-heading tracking-[-0.5px] leading-tight">
            {formatPKR(sales.netSales)}
          </div>

          {/* Detailed Financial Calculation Line */}
          <p className="mt-1 font-sans text-xs sm:text-sm text-body leading-relaxed">
            <span>{formatPKR(sales.grossSales)} gross</span>
            <span className="mx-1">−</span>
            <span>{formatPKR(sales.discounts)} discounts</span>
            <span className="mx-1">−</span>
            <span>{formatPKR(sales.returns)} returns</span>
            <span className="mx-1.5">·</span>
            <span>{sales.orderCount} orders</span>
            <span className="mx-1.5">·</span>
            <span>AOV {formatPKR(sales.averageOrderValue)}</span>
          </p>
        </div>

        {/* Hourly Trend Line Chart */}
        <div className="mt-4 pt-2">
          <RevenueTrendChart data={sales.trend} />
        </div>
      </div>

      {/* Vertical Divider (Figma Node 3382:12019) */}
      <div className="hidden lg:block w-px bg-default/60 self-stretch my-1" />
      <div className="block lg:hidden h-px bg-default/40 w-full" />

      {/* Right Column: Gross Profit, Operating Profit & Tender Breakdown */}
      <div className="w-full lg:w-[320px] shrink-0 flex flex-col justify-between">
        <div className="flex flex-col gap-3.5">
          {/* 1. Gross Profit Block */}
          <div className="flex flex-col">
            <MetricTooltip
              label="Gross profit"
              explanation="Net sales minus Cost of Goods Sold (COGS). Reflects initial product margin."
            />
            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="font-heading font-semibold text-2xl text-heading tracking-tight">
                {formatPKR(profit.grossProfit)}
              </span>
              <span className="font-sans text-sm text-body">
                {profit.marginPercent}% margin
              </span>
            </div>
            <span className="font-sans text-xs text-body mt-0.5">
              COGS {formatPKR(profit.cogs)}
            </span>
          </div>

          {/* 2. Estimated Operating Profit Block */}
          <div className="flex flex-col">
            <MetricTooltip
              label="Estimated operating profit"
              explanation="Gross profit minus recorded shop operational expenses such as utilities and tea."
            />
            <div className="font-heading font-semibold text-2xl text-heading tracking-tight mt-0.5">
              {formatPKR(profit.estimatedOperatingProfit)}
            </div>
            <div className="flex items-center gap-1.5 font-sans text-xs text-body mt-0.5">
              <span>Expenses {formatPKR(profit.expenses)}</span>
              <span>·</span>
              <Link
                href="/finance-expenses"
                className="text-primary hover:underline font-medium transition-colors cursor-pointer"
              >
                see breakdown
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Tender Split Grid (Figma Node 3382:12038) */}
        <div className="border-t border-default/50 pt-3.5 mt-4 grid grid-cols-3 gap-2">
          {/* Cash Tender */}
          <div className="flex flex-col">
            <span className="font-sans text-xs text-body">Cash</span>
            <span className="font-sans font-medium text-sm text-heading mt-0.5">
              {formatPKR(profit.tenders.cash)}
            </span>
          </div>

          {/* Card / Digital Tender */}
          <div className="flex flex-col">
            <span className="font-sans text-xs text-body">Card / digital</span>
            <span className="font-sans font-medium text-sm text-heading mt-0.5">
              {formatPKR(profit.tenders.cardDigital)}
            </span>
          </div>

          {/* On Khata (Customer Credit) */}
          <div className="flex flex-col">
            <span className="font-sans text-xs text-body">On Khata</span>
            <span className="font-sans font-medium text-sm text-heading mt-0.5">
              {formatPKR(profit.tenders.onKhata)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
