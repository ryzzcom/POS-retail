import { ShiftSummary, ShiftTransaction } from "../types";

export const MOCK_SHIFT_DATA: ShiftSummary = {
  status: "open",
  openedAt: "10:02 AM",
  openedBy: "Bilal Ahmed",
  startingFloatPKR: 5000,
  netSalesPKR: 9290,
  receiptsCount: 2,
  cashCollectedPKR: 9290,
  cardDigitalCollectedPKR: 0,
  cashInTotalPKR: 0,
  cashOutTotalPKR: 0,
  expectedCashInDrawerPKR: 14290, // 5000 + 9290
};

export const MOCK_SHIFT_TRANSACTIONS: ShiftTransaction[] = [
  {
    id: "NP-010419",
    time: "12:42 PM",
    customerName: "Hira Siddiqui",
    amountPKR: 4650,
    paymentMethod: "Cash",
    itemsCount: 2,
  },
  {
    id: "NP-010418",
    time: "11:14 AM",
    customerName: "Walk-in",
    amountPKR: 4640,
    paymentMethod: "Cash",
    itemsCount: 1,
  },
];

export const CASHIER_PERMISSIONS = [
  "Item-level discounts",
  "Returns & exchanges",
  "Khata collection entry",
  "Loyalty redemption",
  "Coupon & referral codes",
  "Receipt reprint",
  "Open & close shift",
  "Wishlist capture",
  "Own sales history",
] as const;

export const CASH_IN_REASONS = [
  "Starting float top-up",
  "Customer change replenishment",
  "Owner petty cash deposit",
  "Other Cash In",
];

export const CASH_OUT_REASONS = [
  "Mid-day safe drop (excess cash)",
  "Store supplies / petty expense",
  "Staff meal / refreshments",
  "Courier / delivery freight",
  "Vendor quick payout",
  "Other Cash Out",
];
