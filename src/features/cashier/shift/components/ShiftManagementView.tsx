"use client";

import React, { useState } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";
import { SaleReceiptDrawer } from "@/features/owner/sales-history";
import { ReceiptSummary } from "@/features/owner/sales-history/types/sales-history.types";
import { ShiftGreetingHeader } from "./ShiftGreetingHeader";
import { ShiftHeroCard } from "./ShiftHeroCard";
import { ShiftTransactionsCard } from "./ShiftTransactionsCard";
import { ShiftPermissionsCard } from "./ShiftPermissionsCard";
import { CashDrawerModal } from "./CashDrawerModal";
import { CloseShiftModal } from "./CloseShiftModal";
import { NewCustomerQuickModal } from "./NewCustomerQuickModal";
import { MOCK_SHIFT_DATA, MOCK_SHIFT_TRANSACTIONS } from "../constants";
import { ShiftSummary, ShiftTransaction } from "../types";
import {
  CashDrawerSchemaType,
  CloseShiftSchemaType,
  QuickCustomerSchemaType,
} from "../schemas";

export function ShiftManagementView() {
  const [shift, setShift] = useState<ShiftSummary>(MOCK_SHIFT_DATA);
  const [transactions, setTransactions] = useState<ShiftTransaction[]>(
    MOCK_SHIFT_TRANSACTIONS
  );
  const [activeProfilesCount, setActiveProfilesCount] = useState<number>(7);
  const [promoProfilesCount, setPromoProfilesCount] = useState<number>(5);

  // Modal States
  const [isCashDrawerOpen, setIsCashDrawerOpen] = useState(false);
  const [isCloseShiftOpen, setIsCloseShiftOpen] = useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);

  // Receipt Drawer State
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptSummary | null>(
    null
  );
  const [isReceiptDrawerOpen, setIsReceiptDrawerOpen] = useState(false);

  // Notification Banner
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
  const handleRecordAdjustment = (data: CashDrawerSchemaType) => {
    const amount = Number(data.amount);
    setShift((prev) => {
      const isCashIn = data.type === "cash_in";
      const newCashIn = isCashIn ? prev.cashInTotalPKR + amount : prev.cashInTotalPKR;
      const newCashOut = !isCashIn ? prev.cashOutTotalPKR + amount : prev.cashOutTotalPKR;
      const newExpected = isCashIn
        ? prev.expectedCashInDrawerPKR + amount
        : Math.max(0, prev.expectedCashInDrawerPKR - amount);

      return {
        ...prev,
        cashInTotalPKR: newCashIn,
        cashOutTotalPKR: newCashOut,
        expectedCashInDrawerPKR: newExpected,
      };
    });

    showNotification(
      `${data.type === "cash_in" ? "Cash In" : "Cash Out"} of ${formatPKR(
        amount
      )} recorded (${data.reason}).`
    );
  };

  // 3. Close Shift Handler
  const handleConfirmCloseShift = (data: CloseShiftSchemaType) => {
    setShift((prev) => ({
      ...prev,
      status: "closed",
    }));

    const actual = Number(data.actualCash);
    const diff = actual - shift.expectedCashInDrawerPKR;
    const diffText =
      diff === 0
        ? "Drawer perfectly balanced"
        : diff < 0
        ? `Shortage of ${formatPKR(Math.abs(diff))}`
        : `Surplus of ${formatPKR(diff)}`;

    showNotification(
      `Shift closed successfully. Counted: ${formatPKR(actual)} (${diffText}).`
    );
  };

  // 4. Quick Customer Registration Handler
  const handleCustomerCreated = (data: QuickCustomerSchemaType) => {
    setActiveProfilesCount((prev) => prev + 1);
    setPromoProfilesCount((prev) => prev + 1);
    showNotification(`New customer profile for "${data.fullName}" created.`);
  };

  // 5. Select Transaction to View Receipt
  const handleSelectTransaction = (tx: ShiftTransaction) => {
    setSelectedReceipt({
      id: tx.id,
      receiptNumber: tx.id,
      time: tx.time,
      itemCount: tx.itemsCount,
      customerName: tx.customerName,
      customerPhone: "0300 1234567",
      paymentMethod: "cash",
      paymentMethodLabel: "Cash",
      cashierName: shift.openedBy,
      whatsappStatus: "delivered",
      totalAmount: tx.amountPKR,
    });
    setIsReceiptDrawerOpen(true);
  };

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

      {/* Greeting Row */}
      <ShiftGreetingHeader
        cashierName={shift.openedBy}
        activeProfilesCount={activeProfilesCount}
        promoProfilesCount={promoProfilesCount}
        onExport={handleExport}
        onNewCustomer={() => setIsNewCustomerOpen(true)}
      />

      {/* Hero Shift Status Card */}
      <ShiftHeroCard
        shift={shift}
        onCashInOut={() => setIsCashDrawerOpen(true)}
        onCloseShift={() => setIsCloseShiftOpen(true)}
      />

      {/* Bottom 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <ShiftTransactionsCard
          transactions={transactions}
          onSelectTransaction={handleSelectTransaction}
        />
        <ShiftPermissionsCard maxDiscountPercent={10} />
      </div>

      {/* Cash In / Out Adjustment Modal */}
      <CashDrawerModal
        open={isCashDrawerOpen}
        onClose={() => setIsCashDrawerOpen(false)}
        currentExpectedCashPKR={shift.expectedCashInDrawerPKR}
        onRecordAdjustment={handleRecordAdjustment}
      />

      {/* Close Shift Modal */}
      <CloseShiftModal
        open={isCloseShiftOpen}
        onClose={() => setIsCloseShiftOpen(false)}
        shift={shift}
        onConfirmCloseShift={handleConfirmCloseShift}
      />

      {/* Quick Customer Profile Modal */}
      <NewCustomerQuickModal
        open={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        onCreated={handleCustomerCreated}
      />

      {/* Slide-Over Receipt Detail Drawer */}
      <SaleReceiptDrawer
        open={isReceiptDrawerOpen}
        onClose={() => setIsReceiptDrawerOpen(false)}
        receipt={selectedReceipt}
      />
    </div>
  );
}
