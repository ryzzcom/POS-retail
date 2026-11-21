import { apiClient } from "@/lib/api-client";
import {
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

interface BackendPurchasesResponse {
  summary?: {
    totalPOsCount: number;
    pendingOrdersCount: number;
    receivedShipmentsCount: number;
    totalPurchasesCostPKR: number;
  };
  items: Array<{
    id: string;
    poNumber: string;
    orderDate: string;
    orderDateFormatted?: string;
    expectedDueDate?: string;
    expectedDueDateFormatted?: string;
    supplier?: {
      id: string;
      name: string;
      phone?: string;
      city?: string;
    };
    itemsSummary?: string;
    totalOrderedQty: number;
    totalReceivedQty: number;
    totalBillAmount: number;
    amountPaid: number;
    remainingDue: number;
    status: string;
    paymentStatus: string;
    notes?: string;
    items?: Array<{
      id: string;
      variant?: {
        name?: string;
        sku?: string;
        size?: string;
        color?: string;
      };
      orderedQty: number;
      receivedQty?: number;
      unitCostPrice: number;
      totalCost: number;
    }>;
  }>;
}

interface BackendSuppliersResponse {
  summary?: {
    totalSuppliersCount: number;
    activeSuppliersCount: number;
    totalPayablesPKR: number;
  };
  items: Array<{
    id: string;
    name: string;
    category?: string;
    contactPerson?: string;
    phone: string;
    email?: string;
    ntn?: string;
    city?: string;
    address?: string;
    paymentTerms?: string;
    totalOrdersCount?: number;
    openOrdersCount?: number;
    lastReceivedDate?: string;
    outstandingBalance: number;
    notes?: string;
  }>;
}

interface BackendLedgerResponse {
  supplier: {
    id: string;
    name: string;
    contactPerson?: string;
    phone?: string;
    city?: string;
    currentPayableBalance: number;
  };
  entries: Array<{
    id: string;
    type: string;
    dateFormatted?: string;
    createdAt?: string;
    description?: string;
    billAmount?: number | null;
    paidAmount?: number | null;
    runningBalance: number;
    reference?: string;
    paymentMethod?: string;
  }>;
}

export const purchasesSuppliersService = {
  fetchPurchases: async (): Promise<{
    purchases: PurchaseItem[];
    summary: PurchasesSummaryStats;
  }> => {
    const res = await apiClient.get<BackendPurchasesResponse>("/purchases");
    const rawList = res?.items || [];

    const purchases: PurchaseItem[] = rawList.map((p) => {
      let status: PurchaseItem["status"] = "Draft";
      if (p.status === "RECEIVED") status = "Received";
      else if (p.status === "PARTIAL") status = "Partial";
      else if (p.status === "ORDERED") status = "Ordered";
      else if (p.status === "CANCELLED") status = "Cancelled";

      let paymentStatus: PurchaseItem["paymentStatus"] = "Unpaid";
      if (p.paymentStatus === "PAID") paymentStatus = "Paid";
      else if (p.paymentStatus === "PARTIAL") paymentStatus = "Partial";

      const lineItems = (p.items || []).map((li) => {
        const descParts = [
          li.variant?.name,
          li.variant?.color,
          li.variant?.size,
        ].filter(Boolean);
        return {
          id: li.id,
          description: descParts.length > 0 ? descParts.join(" · ") : "Item",
          quantity: li.orderedQty,
          unitPrice: li.unitCostPrice,
          total: li.totalCost || li.orderedQty * li.unitCostPrice,
          receivedQuantity: li.receivedQty ?? li.orderedQty,
        };
      });

      return {
        id: p.id,
        poNumber: p.poNumber,
        orderDate: p.orderDateFormatted || p.orderDate,
        supplierId: p.supplier?.id || "",
        supplierName: p.supplier?.name || "Supplier",
        status,
        receivedItems: p.totalReceivedQty,
        totalItems: p.totalOrderedQty,
        dueDate: p.expectedDueDateFormatted || p.expectedDueDate || "",
        totalAmount: p.totalBillAmount,
        paidAmount: p.amountPaid,
        paymentStatus,
        notes: p.notes,
        lineItems:
          lineItems.length > 0
            ? lineItems
            : [
                {
                  id: `li-${p.id}`,
                  description: p.itemsSummary || "Fabric consignment",
                  quantity: p.totalOrderedQty,
                  unitPrice:
                    p.totalOrderedQty > 0
                      ? Math.round(p.totalBillAmount / p.totalOrderedQty)
                      : p.totalBillAmount,
                  total: p.totalBillAmount,
                  receivedQuantity: p.totalReceivedQty,
                },
              ],
      };
    });

    const summary: PurchasesSummaryStats = {
      openOrdersCount: res?.summary?.pendingOrdersCount ?? 0,
      pendingDeliveryPKR: 0,
      totalPayablePKR: 0,
      activeSuppliersCount: 0,
    };

    return { purchases, summary };
  },

  fetchSuppliers: async (): Promise<{
    suppliers: SupplierItem[];
    totalPayablesPKR: number;
    activeCount: number;
  }> => {
    const res = await apiClient.get<BackendSuppliersResponse>("/purchases/suppliers");
    const rawList = res?.items || [];

    const suppliers: SupplierItem[] = rawList.map((s) => ({
      id: s.id,
      name: s.name,
      category: (s.category as SupplierCategory) || "Fabric Mill",
      description: s.notes || `${s.category || "Fabric Mill"}. ${s.paymentTerms || "Net 30"}.`,
      contactPerson: s.contactPerson || "Contact",
      phone: s.phone,
      email: s.email,
      ntn: s.ntn,
      city: s.city || "Karachi",
      address: s.address,
      paymentTerms: s.paymentTerms || "Net 30",
      openOrdersCount: s.openOrdersCount || 0,
      lastReceivedDate: s.lastReceivedDate || "Recent",
      outstandingBalance: s.outstandingBalance || 0,
    }));

    return {
      suppliers,
      totalPayablesPKR: res?.summary?.totalPayablesPKR ?? 0,
      activeCount: res?.summary?.activeSuppliersCount ?? suppliers.length,
    };
  },

  createPurchase: async (
    values: PurchaseOrderFormValues
  ): Promise<{ success: boolean; id?: string }> => {
    // If the backend requires variantIds, we can fetch available variants or use first product variant
    let catalogVariants: Array<{ id: string }> = [];
    try {
      const catalogRes = await apiClient.get<{ items: Array<{ variants?: Array<{ id: string }> }> }>("/catalog/products?limit=5");
      if (catalogRes?.items) {
        for (const item of catalogRes.items) {
          if (item.variants && item.variants.length > 0) {
            catalogVariants.push(...item.variants);
          }
        }
      }
    } catch {
      // fallback
    }

    const defaultVariantId = catalogVariants[0]?.id || "default-variant";

    const payload = {
      supplierId: values.supplierId,
      orderDate: values.orderDate,
      expectedDueDate: values.dueDate,
      notes: values.notes,
      amountPaid: values.paidAmount || 0,
      directReceiveStockNow: values.status === "Received",
      items: values.lineItems.map((li, idx) => ({
        variantId: catalogVariants[idx]?.id || defaultVariantId,
        orderedQty: li.quantity,
        unitCostPrice: li.unitPrice,
      })),
    };

    const res = await apiClient.post<{ id?: string }>("/purchases", payload);
    return { success: true, id: res?.id };
  },

  markPurchaseReceived: async (
    purchaseId: string
  ): Promise<{ success: boolean }> => {
    await apiClient.post(`/purchases/${purchaseId}/receive`, {});
    return { success: true };
  },

  createSupplier: async (
    values: SupplierFormValues
  ): Promise<{ success: boolean; id?: string }> => {
    const payload = {
      name: values.name,
      contactPerson: values.contactPerson,
      phone: values.phone,
      email: values.email || undefined,
      ntn: values.ntn || undefined,
      city: values.city,
      address: values.address || undefined,
      openingBalance: values.openingBalance || 0,
      notes: `${values.category}. Terms: ${values.paymentTerms}`,
    };

    const res = await apiClient.post<{ id?: string }>("/purchases/suppliers", payload);
    return { success: true, id: res?.id };
  },

  fetchSupplierLedger: async (
    supplierId: string
  ): Promise<SupplierLedgerEntry[]> => {
    const res = await apiClient.get<BackendLedgerResponse>(
      `/purchases/suppliers/${supplierId}/ledger`
    );
    const rawEntries = res?.entries || [];

    return rawEntries.map((e) => {
      let type: SupplierLedgerEntry["type"] = "PURCHASE";
      if (e.type === "PAYMENT_MADE") type = "PAYMENT";
      else if (e.type === "BILL_INVOICE") type = "PURCHASE";

      return {
        id: e.id,
        date: e.dateFormatted || e.createdAt || "",
        type,
        reference: e.reference || "REF",
        debit: e.paidAmount || 0,
        credit: e.billAmount || 0,
        balance: e.runningBalance || 0,
        notes: e.description || "",
      };
    });
  },

  recordPayment: async (
    values: RecordSupplierPaymentFormValues
  ): Promise<{ success: boolean }> => {
    const payload = {
      amount: values.amount,
      paymentMethod: values.paymentMethod === "bank_transfer" ? "BANK_TRANSFER" : "CASH",
      reference: values.reference,
      notes: values.notes,
    };

    await apiClient.post(`/purchases/suppliers/${values.supplierId}/pay`, payload);
    return { success: true };
  },
};
