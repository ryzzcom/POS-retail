"use client";

import * as React from "react";
import { CUSTOMER_MOCK_DATA } from "../constants/customers-mock";
import {
  CustomerItem,
  CustomerFilterOption,
  CustomerSortOption,
} from "../types/customers.types";
import { CustomersHeader } from "./CustomersHeader";
import { CustomersToolbar } from "./CustomersToolbar";
import { CustomersTable } from "./CustomersTable";
import { CustomerDetailDrawer } from "./CustomerDetailDrawer";
import { NewCustomerDialog } from "./NewCustomerDialog";
import { exportToCsv } from "@/lib/export";

export function CustomersView() {
  const [customers, setCustomers] =
    React.useState<CustomerItem[]>(CUSTOMER_MOCK_DATA);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [tierFilter, setTierFilter] =
    React.useState<CustomerFilterOption>("all");
  const [sortBy, setSortBy] =
    React.useState<CustomerSortOption>("highest_spend");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Drawer & Dialog State
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<CustomerItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Dynamic Metrics for Header
  const totalProfiles = customers.length;
  const acceptsPromotions = customers.filter(
    (c) => c.acceptsMarketing
  ).length;

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

  // Export to CSV
  const handleExport = () => {
    const headers = [
      "Customer Name",
      "Phone",
      "Tag",
      "Tier",
      "Lifetime Spend (PKR)",
      "Points",
      "Khata Balance (PKR)",
      "Last Visit",
      "Messaging",
    ];

    const rows = filteredCustomers.map((c) => [
      c.name,
      c.phone,
      c.tag || "",
      c.tier,
      c.lifetimeSpend,
      c.points,
      c.khataBalance,
      c.lastVisit,
      c.messaging,
    ]);

    exportToCsv(`customers_directory_${Date.now()}`, headers, rows);
    showNotification("Customer directory exported to CSV successfully.");
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleSaveCustomer = (newCustomer: CustomerItem) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    showNotification(`Customer "${newCustomer.name}" created successfully.`);
  };

  const handleSelectCustomer = (customer: CustomerItem) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleRecordKhataPayment = (customer: CustomerItem) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customer.id ? { ...c, khataBalance: 0 } : c
      )
    );
    if (selectedCustomer && selectedCustomer.id === customer.id) {
      setSelectedCustomer({ ...selectedCustomer, khataBalance: 0 });
    }
    showNotification(
      `Khata payment recorded for ${customer.name}. Balance cleared.`
    );
  };

  const handleUpdateCustomer = (updated: CustomerItem) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedCustomer(updated);
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-dark-primary px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-sans flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Page Header (Figma Node 3411:29202) */}
      <CustomersHeader
        totalProfiles={totalProfiles}
        acceptsPromotions={acceptsPromotions}
        onExport={handleExport}
        onNewCustomer={() => setIsNewCustomerOpen(true)}
      />

      {/* 2. Search & Dropdown Filter Toolbar (Figma Node 3411:29232) */}
      <CustomersToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tierFilter={tierFilter}
        onTierFilterChange={setTierFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* 3. Customer Directory Data Table (Figma Node 3411:30202) */}
      <CustomersTable
        customers={paginatedCustomers}
        onSelectCustomer={handleSelectCustomer}
        page={page}
        pageSize={pageSize}
        totalRecords={filteredCustomers.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* 4. Slide-Over Customer Detail Drawer */}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRecordPayment={handleRecordKhataPayment}
        onUpdateCustomer={handleUpdateCustomer}
      />

      {/* 5. Add New Customer Modal Dialog */}
      <NewCustomerDialog
        open={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        onSaveCustomer={handleSaveCustomer}
      />
    </div>
  );
}
