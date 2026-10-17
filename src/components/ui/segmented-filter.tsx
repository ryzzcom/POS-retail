"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedFilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SegmentedFilterProps {
  options: SegmentedFilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  itemClassName?: string;
  "aria-label"?: string;
}

export function SegmentedFilter({
  options,
  value,
  onChange,
  className,
  itemClassName,
  "aria-label": ariaLabel = "Filter selection",
}: SegmentedFilterProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "bg-theme border border-default/50 rounded-[22px] p-[6px] flex items-center gap-[6px] overflow-x-auto select-none shadow-xs",
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
              "font-sans text-sm transition-all whitespace-nowrap cursor-pointer",
              isActive
                ? "bg-primary text-dark-primary rounded-[22px] px-4 py-1.5 font-medium shadow-xs"
                : "text-body hover:text-heading px-3.5 py-1.5 rounded-[22px]",
              itemClassName
            )}
          >
            <span>{option.label}</span>
            {typeof option.count === "number" && (
              <span
                className={cn(
                  "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                  isActive
                    ? "bg-accent/20 text-accent font-semibold"
                    : "bg-subtle text-muted"
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
