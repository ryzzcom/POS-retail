"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Sparkles } from "lucide-react";
import { LoyaltyTabType } from "../types/loyalty-referrals.types";

interface LoyaltyHeaderProps {
  activeTab: LoyaltyTabType;
  onNewCoupon: () => void;
  onExportLedger?: () => void;
}

export function LoyaltyHeader({
  activeTab,
  onNewCoupon,
  onExportLedger,
}: LoyaltyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title & Live Monthly Metrics Subtitle (Figma Node 3451:42089) */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <h1 className="font-heading font-semibold text-2xl sm:text-[28px] text-heading tracking-[-0.4px] leading-tight">
          Loyalty & Referrals
        </h1>
        <p className="font-sans text-xs sm:text-sm text-body leading-relaxed">
          This month: 248 pts issued · 200 redeemed · 2,545 pts outstanding (Rs. 2,545 liability)
        </p>
      </div>

      {/* Dynamic Header Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {activeTab === "coupons" && (
          <Button
            type="button"
            variant="primary"
            onClick={onNewCoupon}
            leftIcon={<Plus className="size-4" />}
            className="h-11 px-5 rounded-full text-xs sm:text-sm font-medium shadow-xs"
          >
            New Coupon
          </Button>
        )}

        {activeTab === "ledger" && onExportLedger && (
          <Button
            type="button"
            variant="white"
            onClick={onExportLedger}
            leftIcon={<Download className="size-4 text-body" />}
            className="h-11 px-5 rounded-full text-xs sm:text-sm font-medium shadow-xs"
          >
            Export Ledger
          </Button>
        )}

        {activeTab === "rules" && (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-theme border border-default/70 text-xs font-sans text-heading shadow-xs">
            <span className="size-2 rounded-full bg-status-success animate-pulse" />
            <span className="font-medium">Active Loyalty Program</span>
            <Sparkles className="size-3.5 text-accent" />
          </div>
        )}
      </div>
    </div>
  );
}
