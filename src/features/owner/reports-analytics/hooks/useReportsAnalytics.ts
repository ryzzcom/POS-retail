"use client";

import * as React from "react";
import { DatePreset, ReportTab } from "../types";
import {
  reportsAnalyticsService,
  FullSalesReportData,
  FullInventoryReportData,
  FullFinanceReportData,
  FullCustomerReportData,
} from "../services/reports-analytics.service";

export function useReportsAnalytics() {
  const [activeTab, setActiveTab] = React.useState<ReportTab>("sales");
  const [preset, setPreset] = React.useState<DatePreset>("thismonth");
  const [startDate, setStartDate] = React.useState("2026-10-01");
  const [endDate, setEndDate] = React.useState("2026-10-11");

  const [salesData, setSalesData] = React.useState<FullSalesReportData | null>(null);
  const [inventoryData, setInventoryData] = React.useState<FullInventoryReportData | null>(null);
  const [financeData, setFinanceData] = React.useState<FullFinanceReportData | null>(null);
  const [customersData, setCustomersData] = React.useState<FullCustomerReportData | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const handlePresetChange = (newPreset: DatePreset) => {
    setPreset(newPreset);
    const today = new Date().toISOString().split("T")[0];
    if (newPreset === "today") {
      setStartDate(today);
      setEndDate(today);
    } else if (newPreset === "last7days") {
      const past7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      setStartDate(past7);
      setEndDate(today);
    } else if (newPreset === "thismonth") {
      const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0];
      setStartDate(firstOfMonth);
      setEndDate(today);
    }
  };

  const loadReport = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (activeTab === "sales") {
        const data = await reportsAnalyticsService.getSalesReport(preset);
        setSalesData(data);
      } else if (activeTab === "inventory") {
        const data = await reportsAnalyticsService.getInventoryReport();
        setInventoryData(data);
      } else if (activeTab === "finance") {
        const data = await reportsAnalyticsService.getFinanceReport(preset);
        setFinanceData(data);
      } else if (activeTab === "customers") {
        const data = await reportsAnalyticsService.getCustomerReport(preset);
        setCustomersData(data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load report data";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, preset]);

  React.useEffect(() => {
    loadReport();
  }, [loadReport]);

  return {
    activeTab,
    setActiveTab,
    preset,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    handlePresetChange,
    salesData,
    inventoryData,
    financeData,
    customersData,
    isLoading,
    error,
    refreshReport: loadReport,
  };
}
