"use client";

import * as React from "react";
import { salesHistoryService } from "../services/sales-history.service";
import type { PaymentMethod, ReceiptSummary } from "../types/sales-history.types";
import { SALES_RECEIPTS_MOCK_DATA } from "../constants/sales-history-mock";

export function useSalesHistory() {
  const [receipts, setReceipts] = React.useState<ReceiptSummary[]>(SALES_RECEIPTS_MOCK_DATA);
  const [summary, setSummary] = React.useState({
    count: SALES_RECEIPTS_MOCK_DATA.length,
    items: SALES_RECEIPTS_MOCK_DATA.reduce((acc, curr) => acc + curr.itemCount, 0),
    total: SALES_RECEIPTS_MOCK_DATA.reduce((acc, curr) => acc + curr.totalAmount, 0),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedReceipt, setSelectedReceipt] = React.useState<ReceiptSummary | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const loadSales = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await salesHistoryService.getSales({
        search: searchQuery.trim() || undefined,
        paymentMethod: selectedMethod !== "all" ? selectedMethod : undefined,
      });

      if (res.items && res.items.length > 0) {
        setReceipts(res.items);
        setSummary({
          count: res.summary.receiptsCount,
          items: res.summary.itemsCount,
          total: res.summary.totalSalesPKR,
        });
      }
    } catch (err: unknown) {
      console.warn("Failed to load sales from API, using fallback:", err);
      setError(err instanceof Error ? err.message : "Failed to load sales history");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedMethod]);

  React.useEffect(() => {
    loadSales();
  }, [loadSales]);

  const handleSelectReceipt = (receipt: ReceiptSummary) => {
    setSelectedReceipt(receipt);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

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

  // Filtered & Paginated items
  const totalPages = Math.max(1, Math.ceil(receipts.length / pageSize));
  const paginatedReceipts = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return receipts.slice(start, start + pageSize);
  }, [receipts, currentPage, pageSize]);

  return {
    receipts: paginatedReceipts,
    allReceipts: receipts,
    summaryMetrics: summary,
    isLoading,
    error,
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
    refresh: loadSales,
  };
}
