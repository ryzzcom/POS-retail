"use client";

import * as React from "react";
import { customersService } from "../services/customers.service";
import type {
  CustomerItem,
  CustomerFilterOption,
  CustomerSortOption,
} from "../types/customers.types";
import { exportToCsv } from "@/lib/export";

export function useCustomers() {
  const [customers, setCustomers] = React.useState<CustomerItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [tierFilter, setTierFilter] = React.useState<CustomerFilterOption>("all");
  const [sortBy, setSortBy] = React.useState<CustomerSortOption>("highest_spend");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Drawer & Dialog State
  const [selectedCustomer, setSelectedCustomer] = React.useState<CustomerItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const loadCustomers = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await customersService.getCustomers({
        search: searchQuery.trim() || undefined,
        tier: tierFilter !== "all" ? tierFilter : undefined,
      });

      setCustomers(Array.isArray(res.items) ? res.items : []);
    } catch (err: unknown) {
      console.warn("Failed to load customers from API:", err);
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, tierFilter]);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Metrics
  const totalProfiles = customers.length;
  const acceptsPromotions = customers.filter((c) => c.acceptsMarketing).length;

  // Filter and Sort Customers
  const filteredCustomers = React.useMemo(() => {
    let list = customers.filter((customer) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = customer.name.toLowerCase().includes(q);
        const matchesPhone = customer.phone.toLowerCase().includes(q);
        const matchesTag = customer.tag?.toLowerCase().includes(q);
        const matchesEmail = customer.email?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesTag && !matchesEmail) {
          return false;
        }
      }

      // 2. Tier / Segment Filter
      if (tierFilter === "gold" && customer.tier !== "Gold") return false;
      if (tierFilter === "silver" && customer.tier !== "Silver") return false;
      if (tierFilter === "regular" && customer.tier !== "Regular") return false;
      if (tierFilter === "with_khata" && customer.khataBalance <= 0) return false;
      if (tierFilter === "marketing" && !customer.acceptsMarketing) return false;

      return true;
    });

    // 3. Sorting
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "highest_spend":
          return b.lifetimeSpend - a.lifetimeSpend;
        case "lowest_spend":
          return a.lifetimeSpend - b.lifetimeSpend;
        case "most_points":
          return b.points - a.points;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "recent_visit":
        default:
          return 0;
      }
    });

    return list;
  }, [customers, searchQuery, tierFilter, sortBy]);

  // Reset to page 1 on filter/search change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, tierFilter, sortBy]);

  // Paginated Rows
  const paginatedCustomers = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, page, pageSize]);

  // Create customer
  const handleSaveCustomer = async (data: any) => {
    try {
      const created = await customersService.createCustomer({
        name: data.name,
        phone: data.phone,
        email: data.email,
        city: data.city,
        address: data.address,
        notes: data.notes,
        acceptsMarketing: data.acceptsMarketing,
      });
      setCustomers((prev) => [created, ...prev]);
      setNotification(`Customer ${created.name} registered successfully`);
    } catch {
      // Fallback local creation
      const localCustomer: CustomerItem = {
        id: `c-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        email: data.email,
        tag: data.tag,
        tier: data.tier || "Regular",
        lifetimeSpend: 0,
        points: 0,
        khataBalance: 0,
        lastVisit: "Today",
        messaging: data.messaging || "All messages",
        acceptsMarketing: Boolean(data.acceptsMarketing),
        city: data.city,
        address: data.address,
        notes: data.notes,
      };
      setCustomers((prev) => [localCustomer, ...prev]);
      setNotification(`Customer ${data.name} saved locally`);
    }
  };

  const handleUpdateCustomer = async (updated: CustomerItem) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    try {
      await customersService.updateCustomer(updated.id, updated as any);
    } catch {
      // Local update maintained
    }
  };

  const handleExport = () => {
    const headers = [
      "Customer Name",
      "Phone",
      "Tier",
      "Lifetime Spend",
      "Points",
      "Khata Balance",
      "Messaging Preference",
      "Accepts Marketing",
    ];
    const rows = filteredCustomers.map((c) => [
      c.name,
      c.phone,
      c.tier,
      c.lifetimeSpend,
      c.points,
      c.khataBalance,
      c.messaging,
      c.acceptsMarketing ? "Yes" : "No",
    ]);

    exportToCsv(`customers-directory-${Date.now()}`, headers, rows);
    setNotification(`Exported ${filteredCustomers.length} customer records to CSV`);
  };

  return {
    customers,
    filteredCustomers,
    paginatedCustomers,
    totalProfiles,
    acceptsPromotions,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    tierFilter,
    setTierFilter,
    sortBy,
    setSortBy,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedCustomer,
    setSelectedCustomer,
    isDetailOpen,
    setIsDetailOpen,
    isNewCustomerOpen,
    setIsNewCustomerOpen,
    notification,
    setNotification,
    handleSaveCustomer,
    handleUpdateCustomer,
    handleExport,
    refresh: loadCustomers,
  };
}
