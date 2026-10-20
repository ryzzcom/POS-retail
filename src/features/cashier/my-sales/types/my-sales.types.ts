export type CashierPaymentMethod =
  | "all"
  | "cash"
  | "card"
  | "bank_transfer"
  | "wallet"
  | "khata_credit";

export type CashierWhatsAppStatus = "delivered" | "failed" | "not_sent";

export interface CashierSaleItem {
  id: string;
  receiptNumber: string;
  time: string;
  itemsCount: number;
  itemsSummary: string;
  customerName: string;
  customerPhone?: string;
  paidBy: string;
  paidByMethod: CashierPaymentMethod;
  whatsappStatus: CashierWhatsAppStatus;
  totalAmountPKR: number;
  cashierName: string;
}

export interface MySalesFilterState {
  search: string;
  paymentMethod: CashierPaymentMethod;
}

export interface MySalesSummary {
  receiptsCount: number;
  itemsCount: number;
  totalSalesPKR: number;
}
