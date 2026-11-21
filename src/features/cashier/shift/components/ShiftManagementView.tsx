"use client";

import React from "react";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { SaleReceiptDrawer } from "@/features/owner/sales-history";
import { ShiftGreetingHeader } from "./ShiftGreetingHeader";
import { ShiftHeroCard } from "./ShiftHeroCard";
import { ShiftTransactionsCard } from "./ShiftTransactionsCard";
import { ShiftPermissionsCard } from "./ShiftPermissionsCard";
import { CashDrawerModal } from "./CashDrawerModal";
import { CloseShiftModal } from "./CloseShiftModal";
import { NewCustomerQuickModal } from "./NewCustomerQuickModal";
import { useShiftManagement } from "../hooks/useShiftManagement";

export function ShiftManagementView() {
  const {
    shift,
    transactions,
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
  } = useShiftManagement();

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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-default">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-body">Loading shift status & transactions...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-status-error-bg text-status-error rounded-2xl border border-status-error text-center">
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
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
        </>
      )}

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
        onCreated={handleRegisterQuickCustomer}
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
