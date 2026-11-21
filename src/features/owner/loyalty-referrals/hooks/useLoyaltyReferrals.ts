"use client";

import * as React from "react";
import {
  LoyaltyTabType,
  LoyaltyRules,
  CouponItem,
  LedgerItem,
} from "../types/loyalty-referrals.types";
import { defaultLoyaltyRules } from "../constants/loyalty-mock";
import { loyaltyReferralsService } from "../services/loyalty-referrals.service";
import { exportToCsv } from "@/lib/export";
import { CouponFormValues } from "../schemas/loyalty-referrals.schemas";

export function useLoyaltyReferrals() {
  const [activeTab, setActiveTab] = React.useState<LoyaltyTabType>("rules");
  const [rules, setRules] = React.useState<LoyaltyRules>(defaultLoyaltyRules);
  const [coupons, setCoupons] = React.useState<CouponItem[]>([]);
  const [ledger, setLedger] = React.useState<LedgerItem[]>([]);
  const [summary, setSummary] = React.useState<{
    monthPointsIssued: number;
    monthPointsRedeemed: number;
    totalPointsOutstanding: number;
    liabilityPKR: number;
    subtitle: string;
    tabCounts: { couponsCount: number; ledgerCount: number };
    isActiveProgram: boolean;
  } | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Dialog State
  const [isCouponDialogOpen, setIsCouponDialogOpen] = React.useState(false);
  const [couponToEdit, setCouponToEdit] = React.useState<CouponItem | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [rulesData, couponsData, ledgerData] = await Promise.all([
        loyaltyReferralsService.getRules(),
        loyaltyReferralsService.getCoupons(),
        loyaltyReferralsService.getLedger(),
      ]);

      setRules(rulesData.rules);
      setSummary(rulesData.summary);
      setCoupons(couponsData);
      setLedger(ledgerData.length > 0 ? ledgerData : rulesData.recentLedger);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load loyalty program data";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveRules = async (updatedRules: LoyaltyRules) => {
    try {
      await loyaltyReferralsService.updateRules(updatedRules);
      setRules(updatedRules);
      showNotification("Loyalty program rules saved successfully.");
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save loyalty rules";
      showNotification(`Error: ${msg}`);
    }
  };

  const handleOpenNewCoupon = () => {
    setCouponToEdit(null);
    setIsCouponDialogOpen(true);
  };

  const handleOpenEditCoupon = (coupon: CouponItem) => {
    setCouponToEdit(coupon);
    setIsCouponDialogOpen(true);
  };

  const handleSaveCoupon = async (savedCoupon: CouponItem) => {
    try {
      if (couponToEdit) {
        await loyaltyReferralsService.updateCoupon(savedCoupon.id, {
          title: savedCoupon.title,
          description: savedCoupon.description,
          discountPercent: savedCoupon.discountPercent,
          discountAmount: savedCoupon.discountAmount,
          maxDiscount: savedCoupon.maxDiscount,
          minBill: savedCoupon.minBill,
          usesPerCustomer: savedCoupon.usesPerCustomer,
          totalUses: savedCoupon.totalUses,
          ends: savedCoupon.ends,
          eligibleCategories: savedCoupon.eligibleCategories,
          firstPurchaseOnly: savedCoupon.firstPurchaseOnly,
          isActive: savedCoupon.isActive,
        });
        showNotification(`Coupon "${savedCoupon.code}" updated successfully.`);
      } else {
        const formVals: CouponFormValues = {
          code: savedCoupon.code,
          type: savedCoupon.type,
          title: savedCoupon.title,
          description: savedCoupon.description,
          discountPercent: savedCoupon.discountPercent,
          discountAmount: savedCoupon.discountAmount,
          maxDiscount: savedCoupon.maxDiscount,
          minBill: savedCoupon.minBill,
          usesPerCustomer: savedCoupon.usesPerCustomer,
          totalUses: savedCoupon.totalUses,
          starts: savedCoupon.starts || new Date().toISOString().split("T")[0],
          ends: savedCoupon.ends,
          eligibleCategories: savedCoupon.eligibleCategories,
          firstPurchaseOnly: savedCoupon.firstPurchaseOnly,
          isActive: savedCoupon.isActive,
        };
        await loyaltyReferralsService.createCoupon(formVals);
        showNotification(`Coupon "${savedCoupon.code}" created successfully.`);
      }
      setIsCouponDialogOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save coupon";
      showNotification(`Error: ${msg}`);
    }
  };

  const handleExportLedger = () => {
    const headers = ["Customer", "Phone", "Type", "Points", "Details", "Date", "Status"];
    const rows = ledger.map((item) => [
      item.customerName,
      item.customerPhone || "",
      item.type,
      item.points,
      item.refereeName ? `Referee: ${item.refereeName}` : item.receiptNo || item.subtitle || "",
      item.date,
      item.status,
    ]);

    exportToCsv(`loyalty_referrals_ledger_${Date.now()}`, headers, rows);
    showNotification("Loyalty & referrals ledger exported to CSV successfully.");
  };

  return {
    activeTab,
    setActiveTab,
    rules,
    coupons,
    ledger,
    summary,
    isLoading,
    error,
    notification,
    isCouponDialogOpen,
    setIsCouponDialogOpen,
    couponToEdit,
    setCouponToEdit,
    handleSaveRules,
    handleOpenNewCoupon,
    handleOpenEditCoupon,
    handleSaveCoupon,
    handleExportLedger,
    refreshData: loadData,
  };
}
