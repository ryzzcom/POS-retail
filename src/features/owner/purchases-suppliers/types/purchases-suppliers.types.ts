export type PurchasesTabId = "purchases" | "suppliers";

export type PurchaseStatus = "Draft" | "Ordered" | "Partial" | "Received" | "Cancelled";

export type PurchasePaymentStatus = "Paid" | "Partial" | "Unpaid";

export interface PurchaseLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  receivedQuantity?: number;
}

export interface PurchaseItem {
  id: string;
  poNumber: string;
  orderDate: string;
  supplierId: string;
  supplierName: string;
  status: PurchaseStatus;
  receivedItems: number;
  totalItems: number;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PurchasePaymentStatus;
  notes?: string;
  lineItems: PurchaseLineItem[];
}

export type SupplierCategory =
  | "Fabric Mill"
  | "Embroidery"
  | "Stitching"
  | "Packaging"
  | "Accessories";

export interface SupplierItem {
  id: string;
  name: string;
  category: SupplierCategory;
  description: string;
  contactPerson: string;
  phone: string;
  email?: string;
  ntn?: string;
  city: string;
  address?: string;
  paymentTerms: string;
  openOrdersCount: number;
  lastReceivedDate: string;
  outstandingBalance: number;
}

export interface SupplierLedgerEntry {
  id: string;
  date: string;
  type: "PURCHASE" | "PAYMENT" | "RETURN";
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  notes?: string;
}

export interface PurchasesSummaryStats {
  openOrdersCount: number;
  pendingDeliveryPKR: number;
  totalPayablePKR: number;
  activeSuppliersCount: number;
}
