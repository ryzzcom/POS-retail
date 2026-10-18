"use client";

import * as React from "react";
import { LoyaltyTabType, LoyaltyRules, CouponItem, LedgerItem } from "../types/loyalty-referrals.types";
import { defaultLoyaltyRules, mockCoupons, mockLedgerItems } from "../constants/loyalty-mock";
import { LoyaltyHeader } from "./LoyaltyHeader";
import { LoyaltyTabsNav } from "./LoyaltyTabsNav";
import { PointRulesTab } from "./PointRulesTab";
import { CouponsTab } from "./CouponsTab";
import { ReferralsLedgerTab } from "./ReferralsLedgerTab";
import { CouponDialog } from "./CouponDialog";
import { exportToCsv } from "@/lib/export";

export function LoyaltyReferralsView() {
  const [activeTab, setActiveTab] = React.useState<LoyaltyTabType>("rules");
  const [rules, setRules] = React.useState<LoyaltyRules>(defaultLoyaltyRules);
  const [coupons, setCoupons] = React.useState<CouponItem[]>(mockCoupons);
  const [ledger, setLedger] = React.useState<LedgerItem[]>(mockLedgerItems);
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

  const handleSaveRules = (updatedRules: LoyaltyRules) => {
    setRules(updatedRules);
    showNotification("Loyalty program rules saved successfully.");
  };

  const handleOpenNewCoupon = () => {
    setCouponToEdit(null);
    setIsCouponDialogOpen(true);
  };

  const handleOpenEditCoupon = (coupon: CouponItem) => {
    setCouponToEdit(coupon);
    setIsCouponDialogOpen(true);
  };

  const handleSaveCoupon = (savedCoupon: CouponItem) => {
    if (couponToEdit) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === savedCoupon.id ? savedCoupon : c))
      );
      showNotification(`Coupon "${savedCoupon.code}" updated successfully.`);
    } else {
      setCoupons((prev) => [savedCoupon, ...prev]);
      showNotification(`Coupon "${savedCoupon.code}" created successfully.`);
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

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-dark-primary px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-sans flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Page Header (Figma Node 3451:42089) */}
      <LoyaltyHeader
        activeTab={activeTab}
        onNewCoupon={handleOpenNewCoupon}
        onExportLedger={handleExportLedger}
      />

      {/* 2. Navigation Tabs Bar (Figma Node 3451:42540) */}
      <LoyaltyTabsNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        couponCount={coupons.length}
        ledgerCount={ledger.length}
      />

      {/* 3. Main Tab Contents */}
      {activeTab === "rules" && (
        <div className="animate-in fade-in-50 duration-150">
          <PointRulesTab
            initialRules={rules}
            recentLedger={ledger}
            onSaveRules={handleSaveRules}
            onNavigateTab={setActiveTab}
          />
        </div>
      )}

      {activeTab === "coupons" && (
        <div className="animate-in fade-in-50 duration-150">
          <CouponsTab
            coupons={coupons}
            onNewCoupon={handleOpenNewCoupon}
            onEditCoupon={handleOpenEditCoupon}
          />
        </div>
      )}

      {activeTab === "ledger" && (
        <div className="animate-in fade-in-50 duration-150">
          <ReferralsLedgerTab ledger={ledger} />
        </div>
      )}

      {/* 4. New / Edit Coupon Modal Dialog (Figma Node 3451:44848) */}
      <CouponDialog
        open={isCouponDialogOpen}
        onClose={() => setIsCouponDialogOpen(false)}
        couponToEdit={couponToEdit}
        onSaveCoupon={handleSaveCoupon}
      />
    </div>
  );
}
