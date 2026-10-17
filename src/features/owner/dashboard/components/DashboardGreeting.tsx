"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TimeRangeFilter } from "../types/dashboard.types";

interface DashboardGreetingProps {
  ownerName: string;
  subtitle: string;
  activeFilter?: TimeRangeFilter;
  onFilterChange?: (filter: TimeRangeFilter) => void;
  className?: string;
}

export function DashboardGreeting({
  ownerName,
  subtitle,
  activeFilter = "today",
  onFilterChange,
  className,
}: DashboardGreetingProps) {
  const [selected, setSelected] = React.useState<TimeRangeFilter>(activeFilter);

  const handleSelect = (filter: TimeRangeFilter) => {
    setSelected(filter);
    onFilterChange?.(filter);
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 shrink-0 select-none",
        className
      )}
    >
      {/* Left: Salutation & Guidance */}
      <div className="flex flex-col">
        <h1 className="font-heading font-semibold text-2xl sm:text-[32px] text-heading tracking-[-0.5px] leading-tight">
          Good afternoon, {ownerName}
        </h1>
        <p className="font-sans text-sm text-body mt-1">
          {subtitle}
        </p>
      </div>

      {/* Right: Segmented Time Range Pill Switcher (Figma Node 3382:11955) */}
      <div
        className="bg-card border border-default p-[6px] rounded-[22px] flex items-center gap-[6px] self-start md:self-auto shadow-xs"
        role="tablist"
        aria-label="Time period selection"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selected === "today"}
          onClick={() => handleSelect("today")}
          className={cn(
            "font-sans text-sm px-4 py-1.5 rounded-[22px] transition-all cursor-pointer",
            selected === "today"
              ? "bg-primary text-white shadow-xs font-normal"
              : "text-body hover:text-heading"
          )}
        >
          Today
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={selected === "week"}
          onClick={() => handleSelect("week")}
          className={cn(
            "font-sans text-sm px-3.5 py-1.5 rounded-[22px] transition-all cursor-pointer",
            selected === "week"
              ? "bg-primary text-white shadow-xs font-normal"
              : "text-body hover:text-heading"
          )}
        >
          This week
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={selected === "month"}
          onClick={() => handleSelect("month")}
          className={cn(
            "font-sans text-sm px-3.5 py-1.5 rounded-[22px] transition-all cursor-pointer",
            selected === "month"
              ? "bg-primary text-white shadow-xs font-normal"
              : "text-body hover:text-heading"
          )}
        >
          October (MTD)
        </button>
      </div>
    </div>
  );
}
