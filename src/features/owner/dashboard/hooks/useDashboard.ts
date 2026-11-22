"use client";

import * as React from "react";
import { dashboardService } from "../services/dashboard.service";
import type { DashboardData, TimeRangeFilter } from "../types/dashboard.types";
import { useAuth } from "@/features/auth";

const emptyDashboardData: DashboardData = {
  ownerName: "Store Owner",
  greetingSubtitle: "Here is your store financial pulse and live executive performance overview.",
  sales: {
    netSales: 0,
    grossSales: 0,
    discounts: 0,
    returns: 0,
    orderCount: 0,
    averageOrderValue: 0,
    trend: [],
  },
  profit: {
    grossProfit: 0,
    marginPercent: 0,
    cogs: 0,
    estimatedOperatingProfit: 0,
    expenses: 0,
    tenders: {
      cash: 0,
      cardDigital: 0,
      onKhata: 0,
    },
  },
  financialMetrics: [],
  attentionAlerts: [],
  customerSummary: {
    newCustomers: 0,
    repeatCustomers: 0,
    pointsIssued: 0,
    pointsRedeemed: 0,
  },
  topVariants: [],
};

export function useDashboard(initialFilter: TimeRangeFilter = "today") {
  const { user } = useAuth();
  const ownerName = user?.fullName || "Store Owner";

  const [activeFilter, setActiveFilter] = React.useState<TimeRangeFilter>(initialFilter);
  const [data, setData] = React.useState<DashboardData>(() => ({
    ...emptyDashboardData,
    ownerName,
  }));
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDashboard = React.useCallback(
    async (filter: TimeRangeFilter) => {
      try {
        setIsLoading(true);
        setError(null);
        const liveData = await dashboardService.getOverview(filter, ownerName);
        setData(liveData);
      } catch (err: unknown) {
        console.warn("Could not load live dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    },
    [ownerName]
  );

  React.useEffect(() => {
    fetchDashboard(activeFilter);
  }, [fetchDashboard, activeFilter]);

  const handleFilterChange = React.useCallback((filter: TimeRangeFilter) => {
    setActiveFilter(filter);
  }, []);

  return {
    data,
    isLoading,
    error,
    activeFilter,
    handleFilterChange,
    refresh: () => fetchDashboard(activeFilter),
  };
}
