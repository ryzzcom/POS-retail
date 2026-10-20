"use client";

import * as React from "react";
import { SALES_RECEIPTS_MOCK_DATA } from "../constants/sales-history-mock";
import { PaymentMethod, ReceiptSummary } from "../types/sales-history.types";
import { SalesTable, SalesToolbar } from "@/components/common";
import { SalesHistoryHeader } from "./SalesHistoryHeader";
import { SaleReceiptDrawer } from "./SaleReceiptDrawer";

export function SalesHistoryView() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [selectedReceipt, setSelectedReceipt] = React.useState<ReceiptSummary | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleSelectReceipt = (receipt: ReceiptSummary) => {
    setSelectedReceipt(receipt);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Reset to page 1 whenever search query or payment method filter changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleMethodChange = (method: string) => {
    setSelectedMethod(method as PaymentMethod);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // 1. Live filtered receipts based on search query and payment method
  const allFilteredReceipts = React.useMemo(() => {
    return SALES_RECEIPTS_MOCK_DATA.filter((receipt) => {
      // Payment method filter
      if (selectedMethod !== "all" && receipt.paymentMethod !== selectedMethod) {
        return false;
      }

      // Search query filter (matches receipt number, customer name, or phone)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesReceipt = receipt.receiptNumber.toLowerCase().includes(query);
        const matchesCustomer = receipt.customerName.toLowerCase().includes(query);
        const matchesPhone = receipt.customerPhone
          ? receipt.customerPhone.toLowerCase().includes(query)
          : false;

        if (!matchesReceipt && !matchesCustomer && !matchesPhone) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedMethod]);

  // 2. Dynamic summary metrics across all filtered receipts
  const summaryMetrics = React.useMemo(() => {
    const count = allFilteredReceipts.length;
    const items = allFilteredReceipts.reduce((acc, curr) => acc + curr.itemCount, 0);
    const total = allFilteredReceipts.reduce((acc, curr) => acc + curr.totalAmount, 0);

    return { count, items, total };
  }, [allFilteredReceipts]);

  // 3. Paginated slice of receipts for the current page
  const totalPages = Math.max(1, Math.ceil(allFilteredReceipts.length / pageSize));
  const paginatedReceipts = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return allFilteredReceipts.slice(start, start + pageSize);
  }, [allFilteredReceipts, currentPage, pageSize]);

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
          sales={paginatedReceipts}
          showCashierColumn={true}
          onSelectSale={handleSelectReceipt}
          pagination={{
            currentPage,
            totalPages,
            totalItems: allFilteredReceipts.length,
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
