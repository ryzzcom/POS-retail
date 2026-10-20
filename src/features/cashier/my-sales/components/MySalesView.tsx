"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";
import {
  SaleReceiptDrawer,
  ReturnExchangeDialog,
} from "@/features/owner/sales-history";
import { ReceiptSummary } from "@/features/owner/sales-history/types/sales-history.types";
import { SalesTable, SalesToolbar } from "@/components/common";
import { MySalesHeader } from "./MySalesHeader";
import { MOCK_CASHIER_SALES } from "../constants";
import {
  CashierSaleItem,
  CashierPaymentMethod,
} from "../types";
import { ReturnExchangeSchemaType } from "../schemas";

export function MySalesView() {
  const [salesList, setSalesList] = useState<CashierSaleItem[]>(MOCK_CASHIER_SALES);
  const [search, setSearch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<CashierPaymentMethod>("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Drawers State
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptSummary | null>(null);
  const [isReceiptDrawerOpen, setIsReceiptDrawerOpen] = useState(false);

  const [returnDialogState, setReturnDialogState] = useState<{
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

  // Notification Toast
  const [notification, setNotification] = useState<{
    type: "success" | "info";
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // 1. Search Change Handler
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  // 2. Method Filter Change Handler
  const handleMethodChange = (method: CashierPaymentMethod) => {
    setSelectedMethod(method);
    setCurrentPage(1);
  };

  // 3. Filtered Sales List
  const filteredSales = useMemo(() => {
    return salesList.filter((item) => {
      // Method Match
      const matchesMethod =
        selectedMethod === "all" || item.paidByMethod === selectedMethod;

      // Search Match
      const searchLower = search.trim().toLowerCase();
      const matchesSearch =
        !searchLower ||
        item.receiptNumber.toLowerCase().includes(searchLower) ||
        item.customerName.toLowerCase().includes(searchLower) ||
        (item.customerPhone && item.customerPhone.includes(searchLower));

      return matchesMethod && matchesSearch;
    });
  }, [salesList, selectedMethod, search]);

  // 4. Paginated Sales
  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSales.slice(start, start + pageSize);
  }, [filteredSales, currentPage, pageSize]);

  // 5. Dynamic Summary Metrics
  const summary = useMemo(() => {
    const receiptsCount = filteredSales.length;
    const itemsCount = filteredSales.reduce((acc, curr) => acc + curr.itemsCount, 0);
    const totalSalesPKR = filteredSales.reduce(
      (acc, curr) => acc + curr.totalAmountPKR,
      0
    );
    return { receiptsCount, itemsCount, totalSalesPKR };
  }, [filteredSales]);

  // 6. Export to CSV Handler
  const handleExport = () => {
    const headers = [
      "Receipt No",
      "Time",
      "Customer",
      "Phone",
      "Items Count",
      "Payment Method",
      "WhatsApp Status",
      "Total (PKR)",
    ];

    const rows = filteredSales.map((s) => [
      s.receiptNumber,
      s.time,
      s.customerName,
      s.customerPhone || "—",
      s.itemsCount,
      s.paidBy,
      s.whatsappStatus,
      s.totalAmountPKR,
    ]);

    exportToCsv("cashier-my-sales-today", headers, rows);
    showNotification("My sales report exported to CSV successfully.");
  };

  // 7. Select Sale Row -> Open Slide-Over Thermal Receipt Drawer
  const handleSelectSale = (sale: CashierSaleItem) => {
    setSelectedReceipt({
      id: sale.id,
      receiptNumber: sale.receiptNumber,
      time: sale.time,
      itemCount: sale.itemsCount,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      paymentMethod: sale.paidByMethod as any,
      paymentMethodLabel: sale.paidBy,
      cashierName: sale.cashierName,
      whatsappStatus: sale.whatsappStatus,
      totalAmount: sale.totalAmountPKR,
    });
    setIsReceiptDrawerOpen(true);
  };

  // 8. Confirm Return Handler
  const handleConfirmReturn = (data: ReturnExchangeSchemaType) => {
    showNotification(
      `Return processed for receipt ${data.receiptNumber}. Refund settlement: ${data.settlementMethod.replace("_", " ")}.`
    );
  };

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / pageSize));

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200">
      {/* Dynamic Toast / Feedback Notification */}
      {notification && (
        <div
          role="status"
          className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-[14px] bg-card border border-default shadow-lg text-heading text-sm font-sans animate-in slide-in-from-top-4 duration-200"
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="size-5 text-status-success shrink-0" />
          ) : (
            <Info className="size-5 text-accent shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Row */}
      <MySalesHeader
        receiptsCount={summary.receiptsCount}
        itemsCount={summary.itemsCount}
        totalSalesPKR={summary.totalSalesPKR}
        onExport={handleExport}
      />

      {/* Toolbar: Search & Payment Method Pills */}
      <SalesToolbar
        search={search}
        onSearchChange={handleSearchChange}
        selectedMethod={selectedMethod}
        onMethodChange={(method) => handleMethodChange(method as CashierPaymentMethod)}
      />

      {/* Sales DataTable */}
      <SalesTable<CashierSaleItem>
        sales={paginatedSales}
        showCashierColumn={false}
        onSelectSale={handleSelectSale}
        pagination={{
          currentPage,
          totalPages,
          totalItems: filteredSales.length,
          pageSize,
          onPageChange: setCurrentPage,
          onPageSizeChange: (newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          },
          itemLabel: "receipts",
        }}
      />

      {/* Thermal Receipt Slide-Over Drawer */}
      <SaleReceiptDrawer
        open={isReceiptDrawerOpen}
        onClose={() => setIsReceiptDrawerOpen(false)}
        receipt={selectedReceipt}
      />

      {/* Standalone Return & Exchange Modal */}
      <ReturnExchangeDialog
        open={returnDialogState.open}
        onClose={() =>
          setReturnDialogState((prev) => ({ ...prev, open: false }))
        }
        receiptNumber={returnDialogState.receiptNumber}
        customerName={returnDialogState.customerName}
        unitPricePKR={returnDialogState.unitPrice}
        maxReturnableQty={returnDialogState.maxQty}
        onConfirmReturn={handleConfirmReturn}
      />
    </div>
  );
}
