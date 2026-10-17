"use client";

import * as React from "react";
import { DASHBOARD_MOCK_DATA } from "../constants/dashboard-mock";
import { DashboardGreeting } from "./DashboardGreeting";
import { RevenueHeroCard } from "./RevenueHeroCard";
import { FinancialMetricsStrip } from "./FinancialMetricsStrip";
import { AttentionAlertsCard } from "./AttentionAlertsCard";
import { TopSellingVariantsCard } from "./TopSellingVariantsCard";

export function DashboardView() {
  const data = DASHBOARD_MOCK_DATA;

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200">
      {/* 1. Salutation Header & Time Range Filter Bar (Figma Node 3382:11951) */}
      <DashboardGreeting
        ownerName={data.ownerName}
        subtitle={data.greetingSubtitle}
      />

      {/* 2. Primary Revenue & Profit Hero Card (Figma Node 3382:11962) */}
      <RevenueHeroCard sales={data.sales} profit={data.profit} />

      {/* 3. 5-Metric Financial Strip Card (Figma Node 3382:12049) */}
      <FinancialMetricsStrip metrics={data.financialMetrics} />

      {/* 4. Bottom 2-Column Operational Grid (Figma Node 3382:12070) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Actionable Alerts & Deficits */}
        <AttentionAlertsCard alerts={data.attentionAlerts} />

        {/* Right: Top-Selling Variants & Customer Loyalty Metrics */}
        <TopSellingVariantsCard
          variants={data.topVariants}
          customerSummary={data.customerSummary}
        />
      </div>
    </div>
  );
}
