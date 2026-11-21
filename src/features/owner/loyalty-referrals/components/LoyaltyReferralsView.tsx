"use client";

import * as React from "react";
import { useLoyaltyReferrals } from "../hooks/useLoyaltyReferrals";
import { LoyaltyHeader } from "./LoyaltyHeader";
import { LoyaltyTabsNav } from "./LoyaltyTabsNav";
import { PointRulesTab } from "./PointRulesTab";
import { CouponsTab } from "./CouponsTab";
import { ReferralsLedgerTab } from "./ReferralsLedgerTab";
import { CouponDialog } from "./CouponDialog";
import { Loader2 } from "lucide-react";

export function LoyaltyReferralsView() {
  const {
    activeTab,
    setActiveTab,
    rules,
    coupons,
    ledger,
    isLoading,
    error,
    notification,
    isCouponDialogOpen,
    setIsCouponDialogOpen,
    couponToEdit,
    handleSaveRules,
    handleOpenNewCoupon,
    handleOpenEditCoupon,
    handleSaveCoupon,
    handleExportLedger,
  } = useLoyaltyReferrals();

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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-default">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-body">Loading loyalty & referrals data...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-status-error-bg text-status-error rounded-2xl border border-status-error text-center">
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
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
        </>
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
