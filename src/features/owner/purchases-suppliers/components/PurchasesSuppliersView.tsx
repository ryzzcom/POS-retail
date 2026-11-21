"use client";

import * as React from "react";
import { formatPKR } from "@/lib/formatters";
import { usePurchasesSuppliers } from "../hooks/usePurchasesSuppliers";
import { PurchasesSuppliersHeader } from "./PurchasesSuppliersHeader";
import { PurchasesTab } from "./PurchasesTab";
import { SuppliersTab } from "./SuppliersTab";
import { AddSupplierDialog } from "./AddSupplierDialog";
import { AddPurchaseModal } from "./AddPurchaseModal";
import { SupplierLedgerDrawer } from "./SupplierLedgerDrawer";
import { PurchaseDetailDrawer } from "./PurchaseDetailDrawer";
import { RecordSupplierPaymentDialog } from "./RecordSupplierPaymentDialog";
import { StatCard } from "@/components/common";
import { Tag, Building2, CreditCard, Loader2 } from "lucide-react";

export function PurchasesSuppliersView() {
  const {
    activeTab,
    setActiveTab,
    purchases,
    suppliers,
    ledgerMap,
    summary,
    isLoading,
    error,
    notification,
    isAddSupplierOpen,
    setIsAddSupplierOpen,
    isAddPurchaseOpen,
    setIsAddPurchaseOpen,
    isRecordPaymentOpen,
    setIsRecordPaymentOpen,
    selectedSupplier,
    setSelectedSupplier,
    isSupplierDrawerOpen,
    setIsSupplierDrawerOpen,
    selectedPurchase,
    isPurchaseDrawerOpen,
    setIsPurchaseDrawerOpen,
    handleCreateSupplier,
    handleCreatePurchase,
    handleConfirmPayment,
    handleMarkReceived,
    handleOpenSupplierLedger,
    handleOpenPurchaseDetail,
    handleExportCsv,
  } = usePurchasesSuppliers();

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-dark-primary px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-sans flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Header with PageHeader & UnderlineTabs matching Figma */}
      <PurchasesSuppliersHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        summary={summary}
        onOpenNewPurchase={() => setIsAddPurchaseOpen(true)}
        onOpenAddSupplier={() => setIsAddSupplierOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Top KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <StatCard
          label="Open purchase orders"
          value={summary.openOrdersCount}
          subtext="Orders awaiting receipt"
          icon={Tag}
        />
        <StatCard
          label="Pending delivery"
          value={formatPKR(summary.pendingDeliveryPKR)}
          subtext="Ordered value still to arrive"
          icon={Building2}
        />
        <StatCard
          label="Total payable"
          value={formatPKR(summary.totalPayablePKR)}
          subtext="Outstanding balance to suppliers"
          valueClassName="text-status-error"
          icon={CreditCard}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-default">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-body">Loading purchases & suppliers...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-status-error-bg text-status-error rounded-2xl border border-status-error text-center">
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* 2. Active Tab Content */}
          {activeTab === "purchases" && (
            <PurchasesTab
              purchases={purchases}
              onSelectPurchase={handleOpenPurchaseDetail}
            />
          )}

          {activeTab === "suppliers" && (
            <SuppliersTab
              suppliers={suppliers}
              onSelectSupplier={handleOpenSupplierLedger}
              onPaySupplier={(s) => {
                setSelectedSupplier(s);
                setIsRecordPaymentOpen(true);
              }}
            />
          )}
        </>
      )}

      {/* 3. Modals & Drawers */}
      {/* Add Supplier Dialog */}
      <AddSupplierDialog
        open={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
        onSubmitSupplier={handleCreateSupplier}
      />

      {/* Add Purchase / PO Modal */}
      <AddPurchaseModal
        open={isAddPurchaseOpen}
        onClose={() => setIsAddPurchaseOpen(false)}
        suppliers={suppliers}
        onSubmitPurchase={handleCreatePurchase}
      />

      {/* Supplier Ledger Drawer */}
      <SupplierLedgerDrawer
        open={isSupplierDrawerOpen}
        onClose={() => setIsSupplierDrawerOpen(false)}
        supplier={selectedSupplier}
        ledgerEntries={selectedSupplier ? ledgerMap[selectedSupplier.id] || [] : []}
        onOpenRecordPayment={(s) => {
          setSelectedSupplier(s);
          setIsRecordPaymentOpen(true);
        }}
        onOpenNewPurchase={() => {
          setIsSupplierDrawerOpen(false);
          setIsAddPurchaseOpen(true);
        }}
      />

      {/* Purchase Detail Drawer */}
      <PurchaseDetailDrawer
        open={isPurchaseDrawerOpen}
        onClose={() => setIsPurchaseDrawerOpen(false)}
        purchase={selectedPurchase}
        onMarkReceived={handleMarkReceived}
      />

      {/* Record Payment to Supplier Dialog */}
      <RecordSupplierPaymentDialog
        open={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        supplier={selectedSupplier}
        suppliers={suppliers}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
