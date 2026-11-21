"use client";

import React from "react";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import {
  SaleReceiptDrawer,
  ReturnExchangeDialog,
} from "@/features/owner/sales-history";
import { SalesTable, SalesToolbar } from "@/components/common";
import { MySalesHeader } from "./MySalesHeader";
import {
  CashierSaleItem,
  CashierPaymentMethod,
} from "../types";
import { ReturnExchangeSchemaType } from "../schemas";
import { useMySales } from "../hooks/useMySales";

export function MySalesView() {
  const {
    salesList,
    filteredSales,
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
    showNotification,
  } = useMySales();

  // 1. Select Sale Row -> Open Slide-Over Thermal Receipt Drawer
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

  // 2. Confirm Return Handler
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
        onExport={handleExportCsv}
      />

      {/* Toolbar: Search & Payment Method Pills */}
      <SalesToolbar
        search={search}
        onSearchChange={handleSearchChange}
        selectedMethod={selectedMethod}
        onMethodChange={(method) => handleMethodChange(method as CashierPaymentMethod)}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-default">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-body">Loading sales history...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-status-error-bg text-status-error rounded-2xl border border-status-error text-center">
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        /* Sales DataTable */
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
      )}

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
