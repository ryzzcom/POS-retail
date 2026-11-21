"use client";

import * as React from "react";
import { dashboardService } from "../services/dashboard.service";
import type { DashboardData, TimeRangeFilter } from "../types/dashboard.types";
import { DASHBOARD_MOCK_DATA } from "../constants/dashboard-mock";
import { useAuth } from "@/features/auth";

export function useDashboard(initialFilter: TimeRangeFilter = "today") {
  const { user } = useAuth();
  const ownerName = user?.fullName || "Ahmed Ali";

  const [activeFilter, setActiveFilter] = React.useState<TimeRangeFilter>(initialFilter);
  const [data, setData] = React.useState<DashboardData>(() => ({
    ...DASHBOARD_MOCK_DATA,
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
        console.warn("Could not load live dashboard data, using fallback:", err);
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
