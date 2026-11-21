"use client";

import * as React from "react";
import { useCustomers } from "../hooks/useCustomers";
import type { CustomerItem } from "../types/customers.types";
import { CustomersHeader } from "./CustomersHeader";
import { CustomersToolbar } from "./CustomersToolbar";
import { CustomersTable } from "./CustomersTable";
import { CustomerDetailDrawer } from "./CustomerDetailDrawer";
import { NewCustomerDialog } from "./NewCustomerDialog";

export function CustomersView() {
  const {
    filteredCustomers,
    paginatedCustomers,
    totalProfiles,
    acceptsPromotions,
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
    handleSaveCustomer,
    handleUpdateCustomer,
    handleExport,
  } = useCustomers();

  const handleSelectCustomer = (customer: CustomerItem) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleRecordKhataPayment = (customer: CustomerItem) => {
    handleUpdateCustomer({ ...customer, khataBalance: 0 });
    if (selectedCustomer && selectedCustomer.id === customer.id) {
      setSelectedCustomer({ ...selectedCustomer, khataBalance: 0 });
    }
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
