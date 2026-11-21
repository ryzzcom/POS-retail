"use client";

import * as React from "react";
import { ReportsAnalyticsHeader } from "./ReportsAnalyticsHeader";
import { SalesReportTab } from "./SalesReportTab";
import { InventoryReportTab } from "./InventoryReportTab";
import { FinanceReportTab } from "./FinanceReportTab";
import { CustomersStaffReportTab } from "./CustomersStaffReportTab";
import { exportToCsv } from "@/lib/export";
import { useReportsAnalytics } from "../hooks/useReportsAnalytics";
import { Loader2 } from "lucide-react";

export function ReportsAnalyticsView() {
  const {
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
  } = useReportsAnalytics();

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleExportAll = () => {
    if (activeTab === "sales") {
      const summary = salesData?.summary;
      exportToCsv(
        `sales_report_${startDate}_to_${endDate}`,
        ["Metric", "Value"],
        [
          ["Gross Sales", summary?.grossSales ?? 0],
          ["Discounts & Points", summary?.discountsAndPoints ?? 0],
          ["Net Sales", summary?.netSales ?? 0],
          ["COGS", summary?.cogs ?? 0],
          ["Gross Profit", summary?.grossProfit ?? 0],
          ["Gross Profit Margin", `${summary?.grossProfitMargin ?? 0}%`],
          ["Orders Count", summary?.ordersCount ?? 0],
          ["Average Order Value", summary?.aov ?? 0],
        ]
      );
    } else if (activeTab === "inventory") {
      const summary = inventoryData?.summary;
      exportToCsv(
        `inventory_report_${startDate}_to_${endDate}`,
        ["Metric", "Value"],
        [
          ["Units On Hand", summary?.unitsOnHand ?? 0],
          ["Stock At Cost", summary?.stockAtCost ?? 0],
          ["Stock At Retail", summary?.stockAtRetail ?? 0],
          ["Low Stock Count", summary?.lowStockCount ?? 0],
          ["Dead Stock Count", summary?.deadStockCount ?? 0],
        ]
      );
    } else if (activeTab === "finance") {
      const summary = financeData?.summary;
      exportToCsv(
        `finance_pl_report_${startDate}_to_${endDate}`,
        ["Metric", "Value"],
        [
          ["Net Sales", summary?.netSales ?? 0],
          ["Gross Profit", summary?.grossProfit ?? 0],
          ["Operating Expenses", summary?.operatingExpenses ?? 0],
          ["Est Operating Profit", summary?.estOperatingProfit ?? 0],
          ["Customers Owe You", summary?.customersOweYou ?? 0],
          ["You Owe Suppliers", summary?.youOweSuppliers ?? 0],
        ]
      );
    } else {
      const summary = customersData?.summary;
      exportToCsv(
        `customer_staff_report_${startDate}_to_${endDate}`,
        ["Metric", "Value"],
        [
          ["Customers Who Bought", summary?.customersWhoBought ?? 0],
          ["New Profiles", summary?.newProfiles ?? 0],
          ["Repeat Rate", `${summary?.repeatRate ?? 0}%`],
          ["Points Issued", summary?.pointsIssued ?? 0],
          ["Points Redeemed", summary?.pointsRedeemed ?? 0],
          ["Referral Conversion", summary?.referralConversion ?? "0/0"],
          ["Wishlist to Purchase Rate", `${summary?.wishlistToPurchaseRate ?? 0}%`],
        ]
      );
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header with Title, Controls Toolbar, and UnderlineTabs */}
      <ReportsAnalyticsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        preset={preset}
        onPresetChange={handlePresetChange}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(val) => {
          setStartDate(val);
        }}
        onEndDateChange={(val) => {
          setEndDate(val);
        }}
        onPrint={handlePrint}
        onExportCsv={handleExportAll}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-default">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-body">Loading analytics & report data...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-status-error-bg text-status-error rounded-2xl border border-status-error text-center">
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* Active Tab View */}
          {activeTab === "sales" && <SalesReportTab data={salesData} />}
          {activeTab === "inventory" && <InventoryReportTab data={inventoryData} />}
          {activeTab === "finance" && <FinanceReportTab data={financeData} />}
          {activeTab === "customers" && <CustomersStaffReportTab data={customersData} />}
        </>
      )}
    </div>
  );
}
