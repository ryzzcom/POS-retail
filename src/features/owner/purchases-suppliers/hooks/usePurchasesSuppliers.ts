"use client";

import * as React from "react";
import { purchasesSuppliersService } from "../services/purchases-suppliers.service";
import {
  PurchasesTabId,
  PurchaseItem,
  SupplierItem,
  SupplierCategory,
  SupplierLedgerEntry,
  PurchasesSummaryStats,
} from "../types/purchases-suppliers.types";
import {
  SupplierFormValues,
  PurchaseOrderFormValues,
  RecordSupplierPaymentFormValues,
} from "../schemas/purchases-suppliers.schemas";
import { exportToCsv } from "@/lib/export";
import { formatPKR } from "@/lib/formatters";

export function usePurchasesSuppliers() {
  const [activeTab, setActiveTab] = React.useState<PurchasesTabId>("purchases");
  const [purchases, setPurchases] = React.useState<PurchaseItem[]>([]);
  const [suppliers, setSuppliers] = React.useState<SupplierItem[]>([]);
  const [ledgerMap, setLedgerMap] = React.useState<Record<string, SupplierLedgerEntry[]>>({});

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Modals & Drawers State
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

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [purchasesData, suppliersData] = await Promise.all([
        purchasesSuppliersService.fetchPurchases(),
        purchasesSuppliersService.fetchSuppliers(),
      ]);

      setPurchases(purchasesData.purchases);
      setSuppliers(suppliersData.suppliers);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load purchases & suppliers data";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

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
  const handleCreateSupplier = async (values: SupplierFormValues) => {
    try {
      await purchasesSuppliersService.createSupplier(values);
      showNotification(`Supplier "${values.name}" registered successfully.`);
      setIsAddSupplierOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register supplier";
      showNotification(`Error: ${msg}`);
    }
  };

  // 2. Create Purchase Order Handler
  const handleCreatePurchase = async (values: PurchaseOrderFormValues) => {
    try {
      await purchasesSuppliersService.createPurchase(values);
      const matchedSupplier = suppliers.find((s) => s.id === values.supplierId);
      showNotification(
        `Purchase order created for ${matchedSupplier?.name || "supplier"}.`
      );
      setIsAddPurchaseOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create purchase order";
      showNotification(`Error: ${msg}`);
    }
  };

  // 3. Record Payment to Supplier Handler
  const handleConfirmPayment = async (values: RecordSupplierPaymentFormValues) => {
    try {
      await purchasesSuppliersService.recordPayment(values);
      const targetSupplier = suppliers.find((s) => s.id === values.supplierId);
      showNotification(
        `Payment of ${formatPKR(values.amount)} recorded for ${targetSupplier?.name || "supplier"}.`
      );
      setIsRecordPaymentOpen(false);
      await loadData();

      // Refresh drawer ledger if open
      if (selectedSupplier && selectedSupplier.id === values.supplierId) {
        const updatedLedger = await purchasesSuppliersService.fetchSupplierLedger(values.supplierId);
        setLedgerMap((prev) => ({
          ...prev,
          [values.supplierId]: updatedLedger,
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record payment";
      showNotification(`Error: ${msg}`);
    }
  };

  // 4. Mark Purchase as Received Handler
  const handleMarkReceived = async (purchaseId: string) => {
    try {
      await purchasesSuppliersService.markPurchaseReceived(purchaseId);
      const target = purchases.find((p) => p.id === purchaseId);
      showNotification(
        `Purchase order ${target?.poNumber || ""} marked as Received. Inventory updated.`
      );
      setIsPurchaseDrawerOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to receive purchase order";
      showNotification(`Error: ${msg}`);
    }
  };

  // 5. Open Supplier Ledger Drawer
  const handleOpenSupplierLedger = async (supplier: SupplierItem) => {
    setSelectedSupplier(supplier);
    setIsSupplierDrawerOpen(true);
    try {
      const entries = await purchasesSuppliersService.fetchSupplierLedger(supplier.id);
      setLedgerMap((prev) => ({
        ...prev,
        [supplier.id]: entries,
      }));
    } catch {
      // Keep existing ledger or empty
    }
  };

  // 6. Open Purchase Detail Drawer
  const handleOpenPurchaseDetail = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
    setIsPurchaseDrawerOpen(true);
  };

  // 7. Export CSV
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

  return {
    activeTab,
    setActiveTab,
    purchases,
    suppliers,
    ledgerMap,
    summary,
    isLoading,
    error,
    notification,
    // Modals & drawers
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
    // Actions
    handleCreateSupplier,
    handleCreatePurchase,
    handleConfirmPayment,
    handleMarkReceived,
    handleOpenSupplierLedger,
    handleOpenPurchaseDetail,
    handleExportCsv,
    refreshData: loadData,
  };
}
