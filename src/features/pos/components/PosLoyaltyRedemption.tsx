"use client";

import React from "react";
import { formatPKR } from "@/lib/formatters";
import { PosCustomer } from "../types";

export interface PosLoyaltyRedemptionProps {
  customer: PosCustomer;
  subtotal: number;
  pointsRedeemed: number;
  onPointsChange: (points: number) => void;
}

/**
 * Loyalty Points Redemption Box matching Figma nodes 3432:37518 & 3437:39407.
 */
export function PosLoyaltyRedemption({
  customer,
  subtotal,
  pointsRedeemed,
  onPointsChange,
}: PosLoyaltyRedemptionProps) {
  // Cap redemption at 20% of subtotal or total customer points
  const maxCapFromBill = Math.floor(subtotal * 0.2);
  const maxRedeemable = Math.min(customer.pointsBalance, maxCapFromBill);

  const canRedeem = customer.pointsBalance >= 100 && maxRedeemable > 0;

  if (!canRedeem) {
    return (
      <div className="w-full rounded-[14px] p-3 bg-card border border-default/50 flex flex-col gap-1 select-none text-xs font-sans">
        <div className="flex items-center justify-between text-body">
          <span>Loyalty · {customer.pointsBalance} pts available</span>
          <span>1 pt = Rs. 1</span>
        </div>
        <p className="text-muted text-[11px] mt-0.5">
          {customer.pointsBalance < 100
            ? "Needs 100 points to redeem."
            : "Add items to cart to redeem points."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-[14px] p-3 bg-card border border-default/50 flex flex-col gap-2 select-none text-xs font-sans">
      <div className="flex items-center justify-between text-body">
        <span className="font-medium text-heading">
          Loyalty · {customer.pointsBalance} pts available
        </span>
        <span>1 pt = Rs. 1</span>
      </div>

      {/* Slider Control */}
      <div className="flex flex-col gap-1.5 mt-1">
        <input
          type="range"
          min={0}
          max={maxRedeemable}
          step={10}
          value={pointsRedeemed}
          onChange={(e) => onPointsChange(parseInt(e.target.value) || 0)}
          className="w-full h-2 bg-subtle/80 rounded-lg appearance-none cursor-pointer accent-accent"
        />

        <div className="flex items-center justify-between text-[11px] text-body">
          <span>
            Using {pointsRedeemed} of max {maxRedeemable} (cap 20% of bill)
          </span>
          <span className="font-semibold text-status-error font-heading">
            -Rs. {pointsRedeemed}
          </span>
        </div>
      </div>
    </div>
  );
}
