export interface LoyaltyRules {
  spendPerPoint: number;
  pointValue: number;
  minBillToRedeem: number;
  minPointsToRedeem: number;
  maxPointsPerBill: number;
  maxPercentPayable: number;
  pointsExpiryMonths: number;
  silverThreshold: number;
  goldThreshold: number;
  reverseOnReturn: boolean;
}

export type CouponType = "percentage" | "fixed";
export type CouponStatus = "live" | "expired" | "scheduled" | "draft";

export interface CouponItem {
  id: string;
  code: string;
  type: CouponType;
  title: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  maxDiscount: number;
  minBill: number;
  usesPerCustomer: number;
  totalUses: number;
  starts: string;
  ends: string;
  status: CouponStatus;
  usedCount: number;
  discountGiven: number;
  eligibleCategories: string[];
  firstPurchaseOnly: boolean;
  isActive: boolean;
}

export type LedgerTransactionType = "earn" | "redeem" | "referral" | "adjustment";

export interface LedgerItem {
  id: string;
  customerName: string;
  customerPhone?: string;
  type: LedgerTransactionType;
  points: number;
  title?: string;
  subtitle?: string;
  date: string;
  receiptNo?: string;
  refereeName?: string;
  status: "completed" | "reversed";
}

export type LoyaltyTabType = "rules" | "coupons" | "ledger";
