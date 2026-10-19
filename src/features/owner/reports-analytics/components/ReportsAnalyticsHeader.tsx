"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { SegmentedFilter, SegmentedFilterOption } from "@/components/ui/segmented-filter";
import { UnderlineTabs, UnderlineTabItem } from "@/components/ui/underline-tabs";
import { DatePreset, ReportTab } from "../types";
import {
  Tag,
  Package,
  TrendingUp,
  Users,
  Printer,
  Download,
  Calendar,
} from "lucide-react";

interface ReportsAnalyticsHeaderProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
  preset: DatePreset;
  onPresetChange: (preset: DatePreset) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onPrint: () => void;
  onExportCsv: () => void;
}

const DATE_PRESET_OPTIONS: SegmentedFilterOption[] = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "last7days" },
  { label: "This month", value: "thismonth" },
];

const REPORT_TABS: UnderlineTabItem<ReportTab>[] = [
  {
    id: "sales",
    label: "Sales",
    icon: Tag,
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
  },
  {
    id: "finance",
    label: "Finance",
    icon: TrendingUp,
  },
  {
    id: "customers",
    label: "Customers & retention",
    icon: Users,
  },
];

export function ReportsAnalyticsHeader({
  activeTab,
  onTabChange,
  preset,
  onPresetChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onPrint,
  onExportCsv,
}: ReportsAnalyticsHeaderProps) {
  // Format readable subtitle range
  const subtitle = "1 Oct 2026 – 11 Oct 2026 · every figure is computed from the underlying ledgers.";

  return (
    <div className="space-y-4">
      {/* Top Page Header */}
      <PageHeader
        title="Reports & Analytics"
        description={subtitle}
        actions={
          <div className="hidden sm:flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              className="gap-2 text-xs font-medium border-default/70 hover:bg-subtle/50"
            >
              <Download className="size-3.5 text-body" />
              <span>Export CSV</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onPrint}
              className="gap-2 text-xs font-medium"
            >
              <Printer className="size-3.5" />
              <span>Print</span>
            </Button>
          </div>
        }
      />

      {/* Date Range & Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-default/50 rounded-[18px] p-2.5 sm:p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
          {/* Preset Buttons */}
          <SegmentedFilter
            sizeVariant="sm"
            options={DATE_PRESET_OPTIONS}
            value={preset}
            onChange={(val) => onPresetChange(val as DatePreset)}
          />

          {/* Date Pickers */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 size-3.5 text-muted pointer-events-none" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="h-8 pl-8 pr-2.5 bg-theme border border-default/70 rounded-[14px] font-sans text-xs text-heading focus:outline-hidden focus:border-focus transition-colors cursor-pointer"
              />
            </div>
            <span className="text-muted text-xs font-sans">to</span>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 size-3.5 text-muted pointer-events-none" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="h-8 pl-8 pr-2.5 bg-theme border border-default/70 rounded-[14px] font-sans text-xs text-heading focus:outline-hidden focus:border-focus transition-colors cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Print Button (Mobile / Tablet Quick Action) */}
        <div className="flex sm:hidden items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="h-8 px-2.5 text-xs font-medium"
          >
            <Download className="size-3.5 text-body" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onPrint}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <Printer className="size-3.5" />
            <span>Print</span>
          </Button>
        </div>
      </div>

      {/* Underline Tabs */}
      <UnderlineTabs
        tabs={REPORT_TABS}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );
}
