"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SegmentedFilter, SegmentedFilterOption } from "@/components/ui/segmented-filter";
import { TimeRangeFilter } from "../types/dashboard.types";

interface DashboardGreetingProps {
  ownerName: string;
  subtitle: string;
  activeFilter?: TimeRangeFilter;
  onFilterChange?: (filter: TimeRangeFilter) => void;
  className?: string;
}

const DASHBOARD_TIME_FILTER_OPTIONS: SegmentedFilterOption[] = [
  { label: "Today", value: "today" },
  { label: "This week", value: "week" },
  { label: "October (MTD)", value: "month" },
];

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
      <div className="overflow-x-auto no-scrollbar max-w-full flex-nowrap shrink-0 self-start md:self-auto">
        <SegmentedFilter
          options={DASHBOARD_TIME_FILTER_OPTIONS}
          value={selected}
          onChange={(val) => handleSelect(val as TimeRangeFilter)}
          aria-label="Time period selection"
        />
      </div>
    </div>
  );
}
