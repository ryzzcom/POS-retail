"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedFilterOption {
  label: string;
  value: string;
  count?: number | string;
  badge?: React.ReactNode;
}

export interface SegmentedFilterProps {
  options: SegmentedFilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  itemClassName?: string;
  sizeVariant?: "default" | "sm";
  "aria-label"?: string;
}

export function SegmentedFilter({
  options,
  value,
  onChange,
  className,
  itemClassName,
  sizeVariant = "default",
  "aria-label": ariaLabel = "Filter selection",
}: SegmentedFilterProps) {
  const isSm = sizeVariant === "sm";

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "bg-theme border border-default/50 flex items-center overflow-x-auto select-none shadow-xs",
        isSm
          ? "rounded-[18px] p-1 gap-1"
          : "rounded-[22px] p-[6px] gap-[6px]",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "font-sans transition-all whitespace-nowrap cursor-pointer",
              isSm ? "text-xs" : "text-sm",
              isActive
                ? cn(
                    "bg-primary text-dark-primary font-medium shadow-xs",
                    isSm ? "rounded-[14px] px-3 py-1" : "rounded-[22px] px-4 py-1.5"
                  )
                : cn(
                    "text-body hover:text-heading",
                    isSm ? "rounded-[14px] px-2.5 py-1" : "rounded-[22px] px-3.5 py-1.5"
                  ),
              itemClassName
            )}
          >
            <span>{option.label}</span>
            {option.badge !== undefined ? (
              <span className="ml-1.5">{option.badge}</span>
            ) : option.count !== undefined ? (
              <span
                className={cn(
                  "rounded-full",
                  isSm ? "ml-1 text-[11px] px-1.5 py-0.2" : "ml-1.5 text-xs px-1.5 py-0.5",
                  isActive
                    ? "bg-accent/20 text-accent font-semibold"
                    : "bg-subtle text-muted"
                )}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export { SegmentedFilter as SegmentedTabs };
export type { SegmentedFilterOption as SegmentedTabOption };
export type { SegmentedFilterProps as SegmentedTabsProps };

