"use client";

import * as React from "react";
import { useSalesHistory } from "../hooks/useSalesHistory";
import { ReceiptSummary } from "../types/sales-history.types";
import { SalesTable, SalesToolbar } from "@/components/common";
import { SalesHistoryHeader } from "./SalesHistoryHeader";
import { SaleReceiptDrawer } from "./SaleReceiptDrawer";

export function SalesHistoryView() {
  const {
    receipts,
    allReceipts,
    summaryMetrics,
    searchQuery,
    selectedMethod,
    currentPage,
    pageSize,
    totalPages,
    selectedReceipt,
    isDrawerOpen,
    handleSelectReceipt,
    handleCloseDrawer,
    handleSearchChange,
    handleMethodChange,
    handlePageSizeChange,
    setCurrentPage,
  } = useSalesHistory();

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200">
      {/* 1. Header Section with Title & Dynamic Subtitle Metrics */}
      <SalesHistoryHeader
        receiptCount={summaryMetrics.count}
        itemCount={summaryMetrics.items}
        totalAmount={summaryMetrics.total}
      />

      {/* 2. Toolbar Row (Search Pill + Payment Method Segmented Filter) */}
      <div className="flex flex-col gap-6">
        <SalesToolbar
          search={searchQuery}
          onSearchChange={handleSearchChange}
          selectedMethod={selectedMethod}
          onMethodChange={handleMethodChange}
        />

        {/* 3. Receipts DataTable with Integrated Pagination (Figma Node 3386:16476) */}
        <SalesTable<ReceiptSummary>
          sales={receipts}
          showCashierColumn={true}
          onSelectSale={handleSelectReceipt}
          pagination={{
            currentPage,
            totalPages,
            totalItems: allReceipts.length,
            pageSize,
            onPageChange: setCurrentPage,
            onPageSizeChange: handlePageSizeChange,
            pageSizeOptions: [5, 10, 20],
            itemLabel: "receipts",
          }}
        />
      </div>

      {/* 4. Sale Receipt Detail Slide-Over Drawer (Figma Node 3386:17230) */}
      <SaleReceiptDrawer
        receipt={selectedReceipt}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
