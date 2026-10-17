"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/formatters";
import { FinancialPositionMetric } from "../types/dashboard.types";
import { MetricTooltip } from "./MetricTooltip";

interface FinancialMetricsStripProps {
  metrics: FinancialPositionMetric[];
  className?: string;
}

export function FinancialMetricsStrip({
  metrics,
  className,
}: FinancialMetricsStripProps) {
  return (
    <div
      className={cn(
        "w-full bg-theme rounded-[22px] px-4 py-3 sm:px-6 sm:py-4 border border-default/40 shadow-xs select-none",
        className
      )}
      role="region"
      aria-label="Money position financial summary"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-default/30">
        {metrics.map((metric, idx) => {
          const content = (
            <div
              key={metric.id}
              className={cn(
                "flex flex-col justify-center py-2 lg:py-0",
                idx !== 0 && "lg:pl-6",
                idx > 1 && "pt-3 lg:pt-0"
              )}
            >
              {/* Metric Label with Calculation Tooltip */}
              <MetricTooltip
                label={metric.label}
                explanation={metric.explanation}
                labelClassName="text-xs text-body"
              />

              {/* PKR Financial Amount */}
              <span className="font-heading font-semibold text-base sm:text-lg text-heading mt-1 tracking-tight">
                {formatPKR(metric.amount)}
              </span>
            </div>
          );

          if (metric.href) {
            return (
              <Link
                key={metric.id}
                href={metric.href}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              >
                {content}
              </Link>
            );
          }

          return content;
        })}
      </div>
    </div>
  );
}
