"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

/**
 * 1. Page Header Skeleton
 * Title + subtitle + optional right action / filter pill placeholders
 */
export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 shrink-0 select-none",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-44 sm:w-56 rounded-lg" />
        <Skeleton className="h-4 w-52 sm:w-72 rounded-md" />
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <Skeleton className="h-11 w-48 sm:w-64 rounded-[22px]" />
      </div>
    </div>
  );
}

/**
 * 2. KPI Financial Strip Skeleton (Matches 5-metric financial strip card)
 */
export function KpiStripSkeleton({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full bg-theme rounded-[22px] px-4 py-3 sm:px-6 sm:py-4 border border-default/40 shadow-xs select-none",
        className
      )}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-default/30">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "flex flex-col justify-center py-2 lg:py-0",
              idx !== 0 && "lg:pl-6",
              idx > 1 && "pt-3 lg:pt-0"
            )}
          >
            <Skeleton className="h-3.5 w-24 rounded-sm mb-2" />
            <Skeleton className="h-6 w-28 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 3. Table Skeleton (Matches DataTable card with header, rows, and pagination bar)
 */
export function TableSkeleton({
  rows = 5,
  columns = 6,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-[22px] border border-default/40 bg-theme shadow-xs overflow-hidden select-none flex flex-col",
        className
      )}
    >
      {/* Table Header Row */}
      <div className="bg-subtle/30 border-b border-default/40 px-5 py-4 sm:px-6 flex items-center justify-between gap-4">
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton
            key={idx}
            className={cn(
              "h-4 rounded-md",
              idx === 0
                ? "w-20"
                : idx === columns - 1
                ? "w-16"
                : "w-20 sm:w-24"
            )}
          />
        ))}
      </div>

      {/* Body Rows */}
      <div className="divide-y divide-default/30">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="px-5 py-4 sm:py-5 sm:px-6 flex items-center justify-between gap-4"
          >
            {/* Col 1: Multi-line identifier */}
            <div className="flex flex-col gap-1.5 w-28 sm:w-36">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-sm" />
            </div>

            {/* Inner Cols */}
            {Array.from({ length: Math.max(1, columns - 3) }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="hidden sm:flex flex-1 justify-center"
              >
                <Skeleton className="h-4 w-20 sm:w-28 rounded-md" />
              </div>
            ))}

            {/* Status Badge Col */}
            <div className="flex justify-center w-24">
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>

            {/* Total / Action Col */}
            <div className="flex justify-end w-20">
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Pagination Bar Skeleton */}
      <div className="w-full flex items-center justify-between px-5 py-3.5 sm:px-6 bg-theme/80 border-t border-default/40">
        <Skeleton className="h-4 w-36 sm:w-48 rounded-md" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * 4. Dashboard Page Skeleton (Matches Store Owner Dashboard layout)
 */
export function DashboardPageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none",
        className
      )}
    >
      {/* Salutation Greeting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 shrink-0">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-60 sm:w-72 rounded-lg" />
          <Skeleton className="h-4 w-72 sm:w-96 rounded-md" />
        </div>
        <Skeleton className="h-11 w-64 rounded-[22px]" />
      </div>

      {/* Revenue & Profit Hero Split Card */}
      <div className="w-full bg-card rounded-[22px] p-5 sm:p-6 border border-default/40 shadow-xs flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="flex-1 flex flex-col justify-between gap-4 min-w-0">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-9 w-44 rounded-lg mt-1" />
            <Skeleton className="h-4 w-72 sm:w-96 rounded-md" />
          </div>
          {/* Trend Chart Placeholder */}
          <div className="mt-4 pt-2">
            <Skeleton className="h-[110px] w-full rounded-xl bg-subtle/50" />
            <div className="w-full flex items-center justify-between mt-3 pt-2 border-t border-default/40">
              {Array.from({ length: 10 }).map((_, idx) => (
                <Skeleton key={idx} className="h-3 w-5 rounded-xs" />
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-px bg-default/60 self-stretch my-1" />

        {/* Right Column */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            {/* Gross Profit Block */}
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-24 rounded-md" />
              <div className="flex items-baseline gap-3 mt-1">
                <Skeleton className="h-7 w-32 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
              <Skeleton className="h-3.5 w-28 rounded-sm" />
            </div>

            {/* Operating Profit Block */}
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-7 w-32 rounded-lg mt-1" />
              <Skeleton className="h-3.5 w-40 rounded-sm" />
            </div>
          </div>

          {/* Tender Breakdown */}
          <div className="border-t border-default/50 pt-3.5 grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-12 rounded-xs" />
              <Skeleton className="h-4 w-16 rounded-sm mt-1" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-16 rounded-xs" />
              <Skeleton className="h-4 w-16 rounded-sm mt-1" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-14 rounded-xs" />
              <Skeleton className="h-4 w-16 rounded-sm mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* 5-Metric Financial Strip Card */}
      <KpiStripSkeleton count={5} />

      {/* Bottom 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Card: Needs Attention */}
        <div className="w-full bg-theme rounded-[22px] p-5 sm:p-6 border border-default/40 shadow-xs flex flex-col gap-3">
          <div className="pb-3 border-b border-default">
            <Skeleton className="h-5 w-40 rounded-md" />
          </div>
          <div className="flex flex-col divide-y divide-default/50">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-4 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-48 sm:w-64 rounded-md" />
                    <Skeleton className="h-3 w-36 sm:w-48 rounded-sm" />
                  </div>
                </div>
                <Skeleton className="size-4 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Top-Selling Variants */}
        <div className="w-full bg-theme rounded-[22px] p-5 sm:p-6 border border-default/40 shadow-xs flex flex-col gap-3">
          <div className="pb-3 border-b border-default flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-3.5 w-48 rounded-sm" />
          </div>
          <div className="flex flex-col divide-y divide-default/30 mt-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-sm" />
                </div>
                <Skeleton className="h-4 w-8 rounded-md" />
                <Skeleton className="h-4 w-18 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 5. Table Page Skeleton (Matches Sales History, Products, Customers, Khata list views)
 */
export function TablePageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none",
        className
      )}
    >
      {/* Header */}
      <PageHeaderSkeleton />

      {/* Toolbar (Search pill + Filter tabs) */}
      <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <Skeleton className="h-12 w-full sm:w-[400px] lg:w-[440px] rounded-[22px]" />
        <Skeleton className="h-11 w-full lg:w-[460px] rounded-[22px]" />
      </div>

      {/* DataTable Skeleton */}
      <TableSkeleton rows={5} columns={6} />
    </div>
  );
}

/**
 * 6. Cashier POS Terminal Skeleton (Matches Counter Register workspace)
 */
export function PosTerminalSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col lg:flex-row gap-5 animate-in fade-in-50 duration-200 select-none",
        className
      )}
    >
      {/* Left: Product Catalog & Touch Grid */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Category Pills & Barcode Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </div>
        <div className="flex items-center gap-2 overflow-hidden py-1">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-9 w-24 shrink-0 rounded-full" />
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 flex-1">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-card rounded-2xl p-3 border border-default/40 flex flex-col gap-2.5 shadow-xs"
            >
              <Skeleton className="h-28 w-full rounded-xl bg-subtle/50" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <div className="flex items-center justify-between mt-auto">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="size-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Order Cart & Payment Tender Panel */}
      <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 bg-card rounded-2xl p-5 border border-default/40 shadow-xs flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-4">
          {/* Customer Selector Slot */}
          <Skeleton className="h-11 w-full rounded-xl" />

          {/* Cart Header */}
          <div className="flex items-center justify-between py-1 border-b border-default/40">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>

          {/* Cart Items List */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-14 rounded-md" />
                  <Skeleton className="h-4 w-14 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Breakdown & Pay Button */}
        <div className="flex flex-col gap-3 pt-3 border-t border-default/50">
          <div className="flex justify-between">
            <Skeleton className="h-3.5 w-16 rounded-sm" />
            <Skeleton className="h-3.5 w-20 rounded-sm" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3.5 w-14 rounded-sm" />
            <Skeleton className="h-3.5 w-16 rounded-sm" />
          </div>
          <div className="flex justify-between pt-2 border-t border-default/30">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
          <Skeleton className="h-14 w-full rounded-2xl mt-1" />
        </div>
      </div>
    </div>
  );
}
