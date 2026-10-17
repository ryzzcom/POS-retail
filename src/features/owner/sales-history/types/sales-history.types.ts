export type PaymentMethod =
  | "all"
  | "cash"
  | "card"
  | "bank_transfer"
  | "wallet"
  | "khata_credit";

export type WhatsAppDeliveryStatus = "delivered" | "failed" | "not_sent";

export interface ReceiptSummary {
  id: string;
  receiptNumber: string;
  time: string;
  itemCount: number;
  customerName: string;
  customerPhone?: string;
  paymentMethod: PaymentMethod;
  paymentMethodLabel: string;
  cashierName: string;
  whatsappStatus: WhatsAppDeliveryStatus;
  totalAmount: number;
}

export interface SalesHistoryFilterState {
  search: string;
  paymentMethod: PaymentMethod;
}
