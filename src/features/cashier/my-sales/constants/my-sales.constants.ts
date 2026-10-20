import { CashierSaleItem, CashierPaymentMethod } from "../types";

export const MOCK_CASHIER_SALES: CashierSaleItem[] = [
  {
    id: "NP-010420",
    receiptNumber: "NP-010420",
    time: "2:05 PM",
    itemsCount: 1,
    itemsSummary: "1 items",
    customerName: "Fatima Raza",
    customerPhone: "0300 9876543",
    paidBy: "Card",
    paidByMethod: "card",
    whatsappStatus: "failed",
    totalAmountPKR: 9000,
    cashierName: "Bilal Ahmed",
  },
  {
    id: "NP-010419",
    receiptNumber: "NP-010419",
    time: "12:42 PM",
    itemsCount: 1,
    itemsSummary: "1 items",
    customerName: "Hira Siddiqui",
    customerPhone: "0321 4567890",
    paidBy: "Wallet",
    paidByMethod: "wallet",
    whatsappStatus: "delivered",
    totalAmountPKR: 4650,
    cashierName: "Bilal Ahmed",
  },
  {
    id: "NP-010418",
    receiptNumber: "NP-010418",
    time: "11:14 AM",
    itemsCount: 2,
    itemsSummary: "2 items",
    customerName: "Walk-in",
    customerPhone: "—",
    paidBy: "Cash",
    paidByMethod: "cash",
    whatsappStatus: "not_sent",
    totalAmountPKR: 4640,
    cashierName: "Bilal Ahmed",
  },
];

export const PAYMENT_FILTER_OPTIONS: { label: string; value: CashierPaymentMethod }[] = [
  { label: "All methods", value: "all" },
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
  { label: "Bank transfer", value: "bank_transfer" },
  { label: "Wallet", value: "wallet" },
  { label: "Khata credit", value: "khata_credit" },
];

export const ITEM_CONDITIONS = [
  { label: "Good / restockable", value: "Good / restockable" },
  { label: "Damaged / defective", value: "Damaged / defective" },
  { label: "Wrong size / fitting issue", value: "Wrong size / fitting issue" },
];

export const SETTLEMENT_METHODS = [
  { label: "Cash refund", value: "cash" },
  { label: "Original payment method", value: "original_payment" },
  { label: "Reduce Khata credit balance", value: "reduce_khata" },
  { label: "Product exchange", value: "exchange" },
];
