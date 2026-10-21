"use client";

import * as React from "react";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";
import {
  PurchasesTabId,
  PurchaseItem,
  SupplierItem,
  SupplierCategory,
  SupplierLedgerEntry,
  PurchasesSummaryStats,
} from "../types/purchases-suppliers.types";
import {
  MOCK_PURCHASES,
  MOCK_SUPPLIERS,
  MOCK_SUPPLIER_LEDGER,
  MOCK_SUMMARY_STATS,
} from "../constants/purchases-mock";
import {
  SupplierFormValues,
  PurchaseOrderFormValues,
  RecordSupplierPaymentFormValues,
} from "../schemas/purchases-suppliers.schemas";
import { PurchasesSuppliersHeader } from "./PurchasesSuppliersHeader";
import { PurchasesTab } from "./PurchasesTab";
import { SuppliersTab } from "./SuppliersTab";
import { AddSupplierDialog } from "./AddSupplierDialog";
import { AddPurchaseModal } from "./AddPurchaseModal";
import { SupplierLedgerDrawer } from "./SupplierLedgerDrawer";
import { PurchaseDetailDrawer } from "./PurchaseDetailDrawer";
import { RecordSupplierPaymentDialog } from "./RecordSupplierPaymentDialog";
import { StatCard } from "@/components/common";
import { Tag, Building2, CreditCard } from "lucide-react";

export function PurchasesSuppliersView() {
  const [activeTab, setActiveTab] = React.useState<PurchasesTabId>("purchases");
  const [notification, setNotification] = React.useState<string | null>(null);

  // Core Data State
  const [purchases, setPurchases] = React.useState<PurchaseItem[]>(MOCK_PURCHASES);
  const [suppliers, setSuppliers] = React.useState<SupplierItem[]>(MOCK_SUPPLIERS);
  const [ledgerMap, setLedgerMap] = React.useState<Record<string, SupplierLedgerEntry[]>>(
    MOCK_SUPPLIER_LEDGER
  );

  // Modals & Drawers
  const [isAddSupplierOpen, setIsAddSupplierOpen] = React.useState(false);
  const [isAddPurchaseOpen, setIsAddPurchaseOpen] = React.useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = React.useState(false);

  const [selectedSupplier, setSelectedSupplier] = React.useState<SupplierItem | null>(null);
  const [isSupplierDrawerOpen, setIsSupplierDrawerOpen] = React.useState(false);

  const [selectedPurchase, setSelectedPurchase] = React.useState<PurchaseItem | null>(null);
  const [isPurchaseDrawerOpen, setIsPurchaseDrawerOpen] = React.useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Dynamic Summary Metrics
  const summary: PurchasesSummaryStats = React.useMemo(() => {
    let openOrdersCount = 0;
    let pendingDeliveryPKR = 0;
    let totalPayablePKR = 0;

    purchases.forEach((p) => {
      if (p.status === "Ordered" || p.status === "Partial") {
        openOrdersCount += 1;
        const unreceivedRatio =
          p.totalItems > 0 ? (p.totalItems - p.receivedItems) / p.totalItems : 1;
        pendingDeliveryPKR += Math.round(p.totalAmount * unreceivedRatio);
      }
    });

    suppliers.forEach((s) => {
      totalPayablePKR += s.outstandingBalance;
    });

    return {
      openOrdersCount,
      pendingDeliveryPKR,
      totalPayablePKR,
      activeSuppliersCount: suppliers.length,
    };
  }, [purchases, suppliers]);

  // 1. Create Supplier Handler
  const handleCreateSupplier = (values: SupplierFormValues) => {
    const newSupplier: SupplierItem = {
      id: `sup-${Date.now()}`,
      name: values.name,
      category: values.category as SupplierCategory,
      description: `${values.category}. ${values.paymentTerms}.`,
      contactPerson: values.contactPerson,
      phone: values.phone,
      email: values.email || undefined,
      ntn: values.ntn || undefined,
      city: values.city,
      address: values.address || undefined,
      paymentTerms: values.paymentTerms,
      openOrdersCount: 0,
      lastReceivedDate: "Never",
      outstandingBalance: values.openingBalance || 0,
    };

    setSuppliers((prev) => [newSupplier, ...prev]);
    showNotification(`Supplier "${values.name}" registered successfully.`);
  };

  // 2. Create Purchase Order Handler
  const handleCreatePurchase = (values: PurchaseOrderFormValues) => {
    const matchedSupplier = suppliers.find((s) => s.id === values.supplierId);
    const subtotal = values.lineItems.reduce(
      (sum, li) => sum + li.quantity * li.unitPrice,
      0
    );
    const totalAmount = subtotal + (values.shippingCost || 0) + (values.taxAmount || 0);
    const totalItems = values.lineItems.reduce((sum, li) => sum + li.quantity, 0);

    const newPurchase: PurchaseItem = {
      id: `po-${Date.now()}`,
      poNumber: values.poNumber,
      orderDate: values.orderDate,
      supplierId: values.supplierId,
      supplierName: matchedSupplier?.name || "Selected Supplier",
      status: values.status,
      receivedItems: values.status === "Received" ? totalItems : 0,
      totalItems,
      dueDate: values.dueDate,
      totalAmount,
      paidAmount: values.paidAmount || 0,
      paymentStatus: values.paymentStatus,
      notes: values.notes,
      lineItems: values.lineItems.map((li, idx) => ({
        id: `li-${Date.now()}-${idx}`,
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        total: li.quantity * li.unitPrice,
        receivedQuantity: values.status === "Received" ? li.quantity : 0,
      })),
    };

    setPurchases((prev) => [newPurchase, ...prev]);

    // Update supplier open orders & balance if unpaid
    if (matchedSupplier) {
      const unpaidAmount = Math.max(0, totalAmount - (values.paidAmount || 0));
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === matchedSupplier.id
            ? {
              ...s,
              openOrdersCount:
                values.status === "Ordered" || values.status === "Partial"
                  ? s.openOrdersCount + 1
                  : s.openOrdersCount,
              outstandingBalance: s.outstandingBalance + unpaidAmount,
            }
            : s
        )
      );

      // Append purchase to ledger
      const newEntry: SupplierLedgerEntry = {
        id: `led-${Date.now()}`,
        date: values.orderDate,
        type: "PURCHASE",
        reference: values.poNumber,
        debit: 0,
        credit: totalAmount,
        balance: matchedSupplier.outstandingBalance + unpaidAmount,
        notes: values.notes || `${totalItems} items consignment`,
      };

      setLedgerMap((prev) => ({
        ...prev,
        [matchedSupplier.id]: [newEntry, ...(prev[matchedSupplier.id] || [])],
      }));
    }

    showNotification(
      `Purchase order ${values.poNumber} created for ${matchedSupplier?.name || "supplier"}.`
    );
  };

  // 3. Record Payment to Supplier Handler
  const handleConfirmPayment = (values: RecordSupplierPaymentFormValues) => {
    const targetSupplier = suppliers.find((s) => s.id === values.supplierId);
    if (!targetSupplier) return;

    const newBalance = Math.max(0, targetSupplier.outstandingBalance - values.amount);

    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === values.supplierId
          ? {
            ...s,
            outstandingBalance: newBalance,
          }
          : s
      )
    );

    const paymentEntry: SupplierLedgerEntry = {
      id: `led-${Date.now()}`,
      date: values.paymentDate,
      type: "PAYMENT",
      reference: values.reference || "PV-Payment Voucher",
      debit: values.amount,
      credit: 0,
      balance: newBalance,
      notes: values.notes || `Payment via ${values.paymentMethod}`,
    };

    setLedgerMap((prev) => ({
      ...prev,
      [values.supplierId]: [paymentEntry, ...(prev[values.supplierId] || [])],
    }));

    if (selectedSupplier?.id === values.supplierId) {
      setSelectedSupplier((prev) =>
        prev ? { ...prev, outstandingBalance: newBalance } : null
      );
    }

    showNotification(
      `Payment of ${formatPKR(values.amount)} recorded for ${targetSupplier.name}.`
    );
  };

  // 4. Mark Purchase as Received Handler
  const handleMarkReceived = (purchaseId: string) => {
    setPurchases((prev) =>
      prev.map((p) =>
        p.id === purchaseId
          ? {
            ...p,
            status: "Received",
            receivedItems: p.totalItems,
            lineItems: p.lineItems.map((li) => ({
              ...li,
              receivedQuantity: li.quantity,
            })),
          }
          : p
      )
    );

    const target = purchases.find((p) => p.id === purchaseId);
    showNotification(
      `Purchase order ${target?.poNumber || ""} marked as Received. Inventory updated.`
    );
  };

  // 5. Export to CSV
  const handleExportCsv = () => {
    if (activeTab === "purchases") {
      const headers = [
        "PO / Bill Number",
        "Supplier",
        "Order Date",
        "Due Date",
        "Status",
        "Items Received",
        "Total Items",
        "Total Amount (PKR)",
        "Paid Amount (PKR)",
        "Payment Status",
      ];
      const rows = purchases.map((p) => [
        p.poNumber,
        p.supplierName,
        p.orderDate,
        p.dueDate,
        p.status,
        p.receivedItems,
        p.totalItems,
        p.totalAmount,
        p.paidAmount,
        p.paymentStatus,
      ]);
      exportToCsv(`purchases_${Date.now()}`, headers, rows);
      showNotification("Purchase orders exported to CSV.");
    } else {
      const headers = [
        "Supplier Name",
        "Category",
        "Contact Person",
        "Phone",
        "City",
        "Payment Terms",
        "Open Orders",
        "Last Received",
        "Outstanding Payable (PKR)",
      ];
      const rows = suppliers.map((s) => [
        s.name,
        s.category,
        s.contactPerson,
        s.phone,
        s.city,
        s.paymentTerms,
        s.openOrdersCount,
        s.lastReceivedDate,
        s.outstandingBalance,
      ]);
      exportToCsv(`suppliers_${Date.now()}`, headers, rows);
      showNotification("Suppliers directory exported to CSV.");
    }
  };

  // Drawer Opener Handlers
  const handleOpenSupplierLedger = (supplier: SupplierItem) => {
    setSelectedSupplier(supplier);
    setIsSupplierDrawerOpen(true);
  };

  const handleOpenPurchaseDetail = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
    setIsPurchaseDrawerOpen(true);
  };

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
