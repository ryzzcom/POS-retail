import {
  PurchaseItem,
  SupplierItem,
  SupplierLedgerEntry,
} from "../types/purchases-suppliers.types";
import {
  SupplierFormValues,
  PurchaseOrderFormValues,
  RecordSupplierPaymentFormValues,
} from "../schemas/purchases-suppliers.schemas";

export const purchasesSuppliersService = {
  fetchPurchases: async (): Promise<PurchaseItem[]> => {
    return Promise.resolve([]);
  },

  createPurchase: async (
    values: PurchaseOrderFormValues
  ): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },

  markPurchaseReceived: async (
    purchaseId: string
  ): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },

  fetchSuppliers: async (): Promise<SupplierItem[]> => {
    return Promise.resolve([]);
  },

  createSupplier: async (
    values: SupplierFormValues
  ): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },

  fetchSupplierLedger: async (
    supplierId: string
  ): Promise<SupplierLedgerEntry[]> => {
    return Promise.resolve([]);
  },

  recordPayment: async (
    values: RecordSupplierPaymentFormValues
  ): Promise<{ success: boolean }> => {
    return Promise.resolve({ success: true });
  },
};
