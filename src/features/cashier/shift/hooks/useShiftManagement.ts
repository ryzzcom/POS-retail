"use client";

import * as React from "react";
import {
  ShiftSummary,
  ShiftTransaction,
  CashDrawerEntry,
} from "../types/shift.types";
import { MOCK_SHIFT_DATA, MOCK_SHIFT_TRANSACTIONS } from "../constants";
import { shiftService } from "../services/shift.service";
import {
  CashDrawerSchemaType,
  CloseShiftSchemaType,
  QuickCustomerSchemaType,
} from "../schemas";
import { ReceiptSummary } from "@/features/owner/sales-history/types/sales-history.types";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";

export function useShiftManagement() {
  const [shift, setShift] = React.useState<ShiftSummary>(MOCK_SHIFT_DATA);
  const [transactions, setTransactions] = React.useState<ShiftTransaction[]>(MOCK_SHIFT_TRANSACTIONS);
  const [adjustments, setAdjustments] = React.useState<CashDrawerEntry[]>([]);
  const [activeProfilesCount, setActiveProfilesCount] = React.useState<number>(7);
  const [promoProfilesCount, setPromoProfilesCount] = React.useState<number>(5);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Modal States
  const [isCashDrawerOpen, setIsCashDrawerOpen] = React.useState(false);
  const [isCloseShiftOpen, setIsCloseShiftOpen] = React.useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = React.useState(false);

  // Receipt Drawer State
  const [selectedReceipt, setSelectedReceipt] = React.useState<ReceiptSummary | null>(null);
  const [isReceiptDrawerOpen, setIsReceiptDrawerOpen] = React.useState(false);

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

      const data = await shiftService.getCurrentShift();
      if (data.summary) {
        setShift(data.summary);
      }
      if (data.transactions.length > 0) {
        setTransactions(data.transactions);
      }
      if (data.adjustments.length > 0) {
        setAdjustments(data.adjustments);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load active shift";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // 1. Export Transactions Handler
  const handleExport = () => {
    const headers = [
      "Receipt ID",
      "Timestamp",
      "Customer",
      "Payment Method",
      "Items Count",
      "Amount (PKR)",
    ];

    const rows = transactions.map((t) => [
      t.id,
      t.time,
      t.customerName,
      t.paymentMethod,
      t.itemsCount,
      t.amountPKR,
    ]);

    exportToCsv(
      `cashier-shift-${shift.openedBy.toLowerCase().replace(/\s+/g, "-")}-transactions`,
      headers,
      rows
    );

    showNotification("Shift transactions report exported to CSV successfully.");
  };

  // 2. Cash In / Out Adjustment Handler
  const handleRecordAdjustment = async (data: CashDrawerSchemaType) => {
    try {
      const amount = Number(data.amount);
      await shiftService.recordCashMovement({
        type: data.type,
        amount,
        reason: data.reason,
        notes: data.notes,
      });

      showNotification(
        `Recorded ${data.type === "cash_in" ? "Cash In" : "Cash Out"} of ${formatPKR(
          amount
        )} successfully.`
      );
      setIsCashDrawerOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record cash movement";
      showNotification(`Error: ${msg}`, "info");
    }
  };

  // 3. Close Shift Handler
  const handleConfirmCloseShift = async (data: CloseShiftSchemaType) => {
    try {
      await shiftService.closeShift({
        actualCash: Number(data.actualCash),
        notes: data.notes,
      });

      showNotification("Shift successfully reconciled and closed.");
      setIsCloseShiftOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to close shift";
      showNotification(`Error: ${msg}`, "info");
    }
  };

  // 4. Quick Customer Registration Handler
  const handleRegisterQuickCustomer = async (data: QuickCustomerSchemaType) => {
    try {
      await shiftService.quickRegisterCustomer({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        notes: data.notes,
      });

      setActiveProfilesCount((prev) => prev + 1);
      showNotification(`Customer ${data.fullName} registered successfully.`);
      setIsNewCustomerOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register customer";
      showNotification(`Error: ${msg}`, "info");
    }
  };

  const handleSelectTransaction = (t: ShiftTransaction) => {
    setSelectedReceipt({
      id: t.id,
      receiptNumber: t.id,
      time: t.time,
      itemCount: t.itemsCount,
      customerName: t.customerName,
      paymentMethod: t.paymentMethod as any,
      paymentMethodLabel: t.paymentMethod,
      cashierName: shift.openedBy,
      whatsappStatus: "delivered",
      totalAmount: t.amountPKR,
    });
    setIsReceiptDrawerOpen(true);
  };

  return {
    shift,
    transactions,
    adjustments,
    activeProfilesCount,
    promoProfilesCount,
    isLoading,
    error,
    isCashDrawerOpen,
    setIsCashDrawerOpen,
    isCloseShiftOpen,
    setIsCloseShiftOpen,
    isNewCustomerOpen,
    setIsNewCustomerOpen,
    selectedReceipt,
    isReceiptDrawerOpen,
    setIsReceiptDrawerOpen,
    notification,
    handleExport,
    handleRecordAdjustment,
    handleConfirmCloseShift,
    handleRegisterQuickCustomer,
    handleSelectTransaction,
    showNotification,
    refreshData: loadData,
  };
}
