"use client";

import * as React from "react";
import { ReportsAnalyticsHeader } from "./ReportsAnalyticsHeader";
import { SalesReportTab } from "./SalesReportTab";
import { InventoryReportTab } from "./InventoryReportTab";
import { FinanceReportTab } from "./FinanceReportTab";
import { CustomersStaffReportTab } from "./CustomersStaffReportTab";
import { DatePreset, ReportTab } from "../types";
import { exportToCsv } from "@/lib/export";
import {
  MOCK_SALES_SUMMARY,
  MOCK_INVENTORY_SUMMARY,
  MOCK_FINANCE_SUMMARY,
  MOCK_CUSTOMER_SUMMARY,
} from "../constants";

export function ReportsAnalyticsView() {
  const [activeTab, setActiveTab] = React.useState<ReportTab>("sales");
  const [preset, setPreset] = React.useState<DatePreset>("thismonth");
  const [startDate, setStartDate] = React.useState("2026-10-01");
  const [endDate, setEndDate] = React.useState("2026-10-11");

  const handlePresetChange = (newPreset: DatePreset) => {
    setPreset(newPreset);
    if (newPreset === "today") {
      setStartDate("2026-10-11");
      setEndDate("2026-10-11");
    } else if (newPreset === "last7days") {
      setStartDate("2026-10-05");
      setEndDate("2026-10-11");
    } else if (newPreset === "thismonth") {
      setStartDate("2026-10-01");
      setEndDate("2026-10-11");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleExportAll = () => {
    if (activeTab === "sales") {
      exportToCsv(
        `sales_report_${startDate}_to_${endDate}`,
        ["Metric", "Value"],
        [
          ["Gross Sales", MOCK_SALES_SUMMARY.grossSales],
          ["Discounts & Points", MOCK_SALES_SUMMARY.discountsAndPoints],
          ["Net Sales", MOCK_SALES_SUMMARY.netSales],
          ["COGS", MOCK_SALES_SUMMARY.cogs],
          ["Gross Profit", MOCK_SALES_SUMMARY.grossProfit],
          ["Gross Profit Margin", `${MOCK_SALES_SUMMARY.grossProfitMargin}%`],
          ["Orders Count", MOCK_SALES_SUMMARY.ordersCount],
          ["Average Order Value", MOCK_SALES_SUMMARY.aov],
        ]
      );
    } else if (activeTab === "inventory") {
      exportToCsv(
        `inventory_report_${startDate}_to_${endDate}`,
        ["Metric", "Value"],
        [
          ["Units On Hand", MOCK_INVENTORY_SUMMARY.unitsOnHand],
          ["Stock At Cost", MOCK_INVENTORY_SUMMARY.stockAtCost],
          ["Stock At Retail", MOCK_INVENTORY_SUMMARY.stockAtRetail],
          ["Low Stock Count", MOCK_INVENTORY_SUMMARY.lowStockCount],
          ["Dead Stock Count", MOCK_INVENTORY_SUMMARY.deadStockCount],
        ]
      );
    } else if (activeTab === "finance") {
      exportToCsv(
        `finance_pl_report_${startDate}_to_${endDate}`,
        ["Metric", "Value"],
        [
          ["Net Sales", MOCK_FINANCE_SUMMARY.netSales],
          ["Gross Profit", MOCK_FINANCE_SUMMARY.grossProfit],
          ["Operating Expenses", MOCK_FINANCE_SUMMARY.operatingExpenses],
          ["Est Operating Profit", MOCK_FINANCE_SUMMARY.estOperatingProfit],
          ["Customers Owe You", MOCK_FINANCE_SUMMARY.customersOweYou],
          ["You Owe Suppliers", MOCK_FINANCE_SUMMARY.youOweSuppliers],
        ]
      );
    } else {
      exportToCsv(
        `customer_staff_report_${startDate}_to_${endDate}`,
        ["Metric", "Value"],
        [
          ["Customers Who Bought", MOCK_CUSTOMER_SUMMARY.customersWhoBought],
          ["New Profiles", MOCK_CUSTOMER_SUMMARY.newProfiles],
          ["Repeat Rate", `${MOCK_CUSTOMER_SUMMARY.repeatRate}%`],
          ["Points Issued", MOCK_CUSTOMER_SUMMARY.pointsIssued],
          ["Points Redeemed", MOCK_CUSTOMER_SUMMARY.pointsRedeemed],
          ["Referral Conversion", MOCK_CUSTOMER_SUMMARY.referralConversion],
          ["Wishlist to Purchase Rate", `${MOCK_CUSTOMER_SUMMARY.wishlistToPurchaseRate}%`],
        ]
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
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
          setPreset("custom");
        }}
        onEndDateChange={(val) => {
          setEndDate(val);
          setPreset("custom");
        }}
        onPrint={handlePrint}
        onExportCsv={handleExportAll}
      />

      {/* Active Tab View */}
      {activeTab === "sales" && <SalesReportTab />}
      {activeTab === "inventory" && <InventoryReportTab />}
      {activeTab === "finance" && <FinanceReportTab />}
      {activeTab === "customers" && <CustomersStaffReportTab />}
    </div>
  );
}
