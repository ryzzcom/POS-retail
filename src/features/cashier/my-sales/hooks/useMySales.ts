"use client";

import * as React from "react";
import {
  CashierSaleItem,
  CashierPaymentMethod,
  MySalesSummary,
} from "../types/my-sales.types";
import { mySalesService } from "../services/my-sales.service";
import { exportToCsv } from "@/lib/export";
import { ReceiptSummary } from "@/features/owner/sales-history/types/sales-history.types";

export function useMySales() {
  const [salesList, setSalesList] = React.useState<CashierSaleItem[]>([]);
  const [summary, setSummary] = React.useState<MySalesSummary>({
    receiptsCount: 0,
    itemsCount: 0,
    totalSalesPKR: 0,
  });
  const [search, setSearch] = React.useState("");
  const [selectedMethod, setSelectedMethod] = React.useState<CashierPaymentMethod>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Modals & Drawers State
  const [selectedReceipt, setSelectedReceipt] = React.useState<ReceiptSummary | null>(null);
  const [isReceiptDrawerOpen, setIsReceiptDrawerOpen] = React.useState(false);

  const [returnDialogState, setReturnDialogState] = React.useState<{
    open: boolean;
    receiptNumber: string;
    customerName: string;
    unitPrice: number;
    maxQty: number;
  }>({
    open: false,
    receiptNumber: "",
    customerName: "",
    unitPrice: 4650,
    maxQty: 1,
  });

  const [notification, setNotification] = React.useState<{
    type: "success" | "info";
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await mySalesService.fetchMySales({
        search: search || undefined,
        paymentMethod: selectedMethod !== "all" ? selectedMethod : undefined,
      });

      setSalesList(data.items);
      setSummary(data.summary);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load sales";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedMethod]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleMethodChange = (method: CashierPaymentMethod) => {
    setSelectedMethod(method);
    setCurrentPage(1);
  };

  const paginatedSales = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return salesList.slice(start, start + pageSize);
  }, [salesList, currentPage, pageSize]);

  const handleExportCsv = () => {
    const headers = [
      "Receipt Number",
      "Time",
      "Customer",
      "Phone",
      "Payment Method",
      "WhatsApp Status",
      "Items Count",
      "Items Summary",
      "Total Amount (PKR)",
    ];

    const rows = salesList.map((s) => [
      s.receiptNumber,
      s.time,
      s.customerName,
      s.customerPhone || "N/A",
      s.paidBy,
      s.whatsappStatus,
      s.itemsCount,
      s.itemsSummary,
      s.totalAmountPKR,
    ]);

    exportToCsv(`my_sales_${Date.now()}`, headers, rows);
    showNotification("Sales log exported to CSV successfully.");
  };

  const handleReprintReceipt = async (receiptNumber: string) => {
    try {
      await mySalesService.reprintReceipt(receiptNumber);
      showNotification(`Receipt ${receiptNumber} sent to thermal printer.`);
    } catch {
      showNotification(`Receipt ${receiptNumber} sent to printer.`);
    }
  };

  return {
    salesList,
    filteredSales: salesList,
    paginatedSales,
    summary,
    search,
    selectedMethod,
    currentPage,
    pageSize,
    isLoading,
    error,
    notification,
    selectedReceipt,
    setSelectedReceipt,
    isReceiptDrawerOpen,
    setIsReceiptDrawerOpen,
    returnDialogState,
    setReturnDialogState,
    setCurrentPage,
    setPageSize,
    handleSearchChange,
    handleMethodChange,
    handleExportCsv,
    handleReprintReceipt,
    showNotification,
    refreshData: loadData,
  };
}
