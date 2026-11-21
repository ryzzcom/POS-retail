import { apiClient } from "@/lib/api-client";
import {
  LoyaltyRules,
  CouponItem,
  LedgerItem,
  LedgerTransactionType,
  CouponType,
  CouponStatus,
} from "../types/loyalty-referrals.types";
import {
  LoyaltyRulesFormValues,
  CouponFormValues,
} from "../schemas/loyalty-referrals.schemas";

interface BackendRulesResponse {
  summary: {
    monthPointsIssued: number;
    monthPointsRedeemed: number;
    totalPointsOutstanding: number;
    liabilityPKR: number;
    subtitle: string;
    tabCounts: {
      couponsCount: number;
      ledgerCount: number;
    };
    isActiveProgram: boolean;
  };
  rules: {
    isActive: boolean;
    spendPerPoint: number;
    pointValue: number;
    minBillToRedeem: number;
    minPointsToRedeem: number;
    maxPointsPerBill: number;
    maxBillPayablePct: number;
    pointsExpiryMonths: number;
    silverTierThreshold: number;
    goldTierThreshold: number;
    reversePointsOnReturn: boolean;
    referralBonusPoints: number;
  };
  workedExample?: {
    sampleBill: number;
    customerPoints: number;
    redeemablePoints: number;
    discountPKR: number;
    netPayablePKR: number;
    pointsEarned: number;
    text: string;
  };
  recentLedger?: Array<{
    id: string;
    customerName: string;
    actionLabel: string;
    pointsDelta: number;
    pointsFormatted: string;
    dateFormatted: string;
  }>;
}

interface BackendCouponsResponse {
  summary?: {
    monthPointsIssued: number;
    monthPointsRedeemed: number;
    totalPointsOutstanding: number;
    liabilityPKR: number;
    subtitle: string;
    tabCounts: {
      couponsCount: number;
      ledgerCount: number;
    };
    isActiveProgram: boolean;
  };
  items: Array<{
    id: string;
    code: string;
    type: string;
    title: string;
    description: string;
    discountPct?: number;
    discountAmount?: number;
    maxDiscountAmount?: number;
    minBillAmount?: number;
    usesPerCustomer?: number;
    totalUsesLimit?: number;
    validFromFormatted?: string;
    startsAt: string;
    endsAt?: string;
    status: string;
    usedCount: number;
    discountGivenPKR?: number;
    eligibleCategories?: string[];
    firstPurchaseOnly?: boolean;
    isActive: boolean;
  }>;
}

interface BackendLedgerResponse {
  summary?: {
    monthPointsIssued: number;
    monthPointsRedeemed: number;
    totalPointsOutstanding: number;
    liabilityPKR: number;
    subtitle: string;
  };
  items: Array<{
    id: string;
    customer?: {
      id: string;
      name: string;
      phone?: string;
    };
    type: string;
    typeBadge?: string;
    referenceTitle?: string;
    referenceSubtitle?: string;
    dateFormatted?: string;
    pointsDelta: number;
    pointsFormatted?: string;
    direction?: string;
    status?: string;
  }>;
}

export const loyaltyReferralsService = {
  getRules: async (): Promise<{
    rules: LoyaltyRules;
    recentLedger: LedgerItem[];
    summary: BackendRulesResponse["summary"];
  }> => {
    const res = await apiClient.get<BackendRulesResponse>("/loyalty/rules");
    const r = res.rules;

    const mappedRules: LoyaltyRules = {
      spendPerPoint: r.spendPerPoint ?? 100,
      pointValue: r.pointValue ?? 1,
      minBillToRedeem: r.minBillToRedeem ?? 1000,
      minPointsToRedeem: r.minPointsToRedeem ?? 100,
      maxPointsPerBill: r.maxPointsPerBill ?? 1000,
      maxPercentPayable: r.maxBillPayablePct ?? 20,
      pointsExpiryMonths: r.pointsExpiryMonths ?? 12,
      silverThreshold: r.silverTierThreshold ?? 40000,
      goldThreshold: r.goldTierThreshold ?? 150000,
      reverseOnReturn: r.reversePointsOnReturn ?? false,
    };

    const recentLedger: LedgerItem[] = (res.recentLedger || []).map((item) => {
      let type: LedgerTransactionType = "earn";
      const lbl = item.actionLabel.toLowerCase();
      if (lbl.includes("redeem")) type = "redeem";
      else if (lbl.includes("referral")) type = "referral";
      else if (lbl.includes("adjust") || lbl.includes("return")) type = "adjustment";

      return {
        id: item.id,
        customerName: item.customerName || "Customer",
        type,
        points: item.pointsDelta,
        date: item.dateFormatted || "",
        status: "completed",
      };
    });

    return {
      rules: mappedRules,
      recentLedger,
      summary: res.summary,
    };
  },

  updateRules: async (
    values: LoyaltyRulesFormValues
  ): Promise<{ success: boolean }> => {
    const payload = {
      spendPerPoint: values.spendPerPoint,
      pointValue: values.pointValue,
      minBillToRedeem: values.minBillToRedeem,
      minPointsToRedeem: values.minPointsToRedeem,
      maxPointsPerBill: values.maxPointsPerBill,
      maxBillPayablePct: values.maxPercentPayable,
      pointsExpiryMonths: values.pointsExpiryMonths,
      silverTierThreshold: values.silverThreshold,
      goldTierThreshold: values.goldThreshold,
      reversePointsOnReturn: values.reverseOnReturn,
    };

    await apiClient.patch("/loyalty/rules", payload);
    return { success: true };
  },

  getCoupons: async (): Promise<CouponItem[]> => {
    const res = await apiClient.get<BackendCouponsResponse>("/loyalty/coupons");
    const rawItems = res?.items || [];

    return rawItems.map((c) => {
      const type: CouponType =
        c.type?.toUpperCase() === "FIXED" ? "fixed" : "percentage";
      let status: CouponStatus = "live";
      const s = c.status?.toLowerCase();
      if (s === "expired") status = "expired";
      else if (s === "scheduled") status = "scheduled";
      else if (s === "draft") status = "draft";

      return {
        id: c.id,
        code: c.code,
        type,
        title: c.title,
        description: c.description,
        discountPercent: c.discountPct,
        discountAmount: c.discountAmount,
        maxDiscount: c.maxDiscountAmount || 0,
        minBill: c.minBillAmount || 0,
        usesPerCustomer: c.usesPerCustomer || 1,
        totalUses: c.totalUsesLimit || 0,
        starts: c.validFromFormatted || c.startsAt?.split("T")[0] || "",
        ends: c.endsAt ? c.endsAt.split("T")[0] : "",
        status,
        usedCount: c.usedCount || 0,
        discountGiven: c.discountGivenPKR || 0,
        eligibleCategories: c.eligibleCategories || [],
        firstPurchaseOnly: !!c.firstPurchaseOnly,
        isActive: !!c.isActive,
      };
    });
  },

  createCoupon: async (values: CouponFormValues): Promise<{ success: boolean; id?: string }> => {
    const payload = {
      code: values.code,
      type: values.type === "fixed" ? "FIXED" : "PERCENTAGE",
      title: values.title,
      description: values.description,
      discountPct: values.discountPercent || undefined,
      discountAmount: values.discountAmount || undefined,
      maxDiscountAmount: values.maxDiscount || 0,
      minBillAmount: values.minBill || 0,
      usesPerCustomer: values.usesPerCustomer || 1,
      totalUsesLimit: values.totalUses || 0,
      startsAt: new Date(values.starts).toISOString(),
      endsAt: values.ends ? new Date(values.ends).toISOString() : undefined,
      eligibleCategories: values.eligibleCategories || [],
      firstPurchaseOnly: values.firstPurchaseOnly,
      isActive: values.isActive,
    };

    const res = await apiClient.post<{ id?: string }>("/loyalty/coupons", payload);
    return { success: true, id: res?.id };
  },

  updateCoupon: async (
    id: string,
    values: Partial<CouponFormValues>
  ): Promise<{ success: boolean }> => {
    const payload: Record<string, unknown> = {};
    if (values.title !== undefined) payload.title = values.title;
    if (values.description !== undefined) payload.description = values.description;
    if (values.discountPercent !== undefined) payload.discountPct = values.discountPercent;
    if (values.discountAmount !== undefined) payload.discountAmount = values.discountAmount;
    if (values.maxDiscount !== undefined) payload.maxDiscountAmount = values.maxDiscount;
    if (values.minBill !== undefined) payload.minBillAmount = values.minBill;
    if (values.usesPerCustomer !== undefined) payload.usesPerCustomer = values.usesPerCustomer;
    if (values.totalUses !== undefined) payload.totalUsesLimit = values.totalUses;
    if (values.ends !== undefined) payload.endsAt = new Date(values.ends).toISOString();
    if (values.eligibleCategories !== undefined) payload.eligibleCategories = values.eligibleCategories;
    if (values.firstPurchaseOnly !== undefined) payload.firstPurchaseOnly = values.firstPurchaseOnly;
    if (values.isActive !== undefined) payload.isActive = values.isActive;

    await apiClient.patch(`/loyalty/coupons/${id}`, payload);
    return { success: true };
  },

  getLedger: async (): Promise<LedgerItem[]> => {
    const res = await apiClient.get<BackendLedgerResponse>("/loyalty/ledger");
    const rawItems = res?.items || [];

    return rawItems.map((e) => {
      let type: LedgerTransactionType = "earn";
      const t = e.type?.toUpperCase();
      if (t === "REDEMPTION") type = "redeem";
      else if (t === "REFERRAL_BONUS") type = "referral";
      else if (t === "RETURN_REVERSAL" || t === "MANUAL_ADJUSTMENT") type = "adjustment";

      return {
        id: e.id,
        customerName: e.customer?.name || "Customer",
        customerPhone: e.customer?.phone,
        type,
        points: e.pointsDelta,
        title: e.referenceTitle,
        subtitle: e.referenceSubtitle,
        date: e.dateFormatted || "",
        status: e.status?.toLowerCase() === "reversed" ? "reversed" : "completed",
      };
    });
  },
};
