"use client";

import * as React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  badge?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

/**
 * Reusable StatCard metric tile matching the warm boutique design system.
 * Used across Owner Dashboard, Reports, Settings, Purchases, and Khata.
 */
export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  badge,
  className,
  valueClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[18px] bg-card border border-default/50 p-4 sm:p-5 shadow-xs select-none flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <p className="font-sans text-xs sm:text-sm text-body truncate">
            {label}
          </p>
          <p
            className={cn(
              "font-heading font-semibold text-xl sm:text-2xl text-heading mt-1 tracking-tight truncate",
              valueClassName
            )}
          >
            {value}
          </p>
        </div>

        {badge ? (
          <div className="shrink-0">{badge}</div>
        ) : Icon ? (
          <div className="size-10 rounded-xl bg-subtle/40 text-heading flex items-center justify-center shrink-0">
            <Icon className="size-5" />
          </div>
        ) : null}
      </div>

      {(subtext || trend) && (
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-default/30 font-sans text-xs">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium shrink-0",
                trend.isPositive ? "text-status-success" : "text-status-error"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-muted truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
