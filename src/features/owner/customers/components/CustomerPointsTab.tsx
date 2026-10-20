"use client";

import * as React from "react";
import { PointHistoryItem } from "../types/customers.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, Minus, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export interface CustomerPointsTabProps {
  pointsBalance: number;
  pointsHistory: PointHistoryItem[];
  adjustmentMode: "add" | "deduct";
  adjustmentAmount: string;
  adjustmentReason: string;
  adjustmentSuccess: boolean;
  isAdjustmentValid: boolean;
  onModeChange: (mode: "add" | "deduct") => void;
  onAmountChange: (amount: string) => void;
  onReasonChange: (reason: string) => void;
  onApplyAdjustment: (e: React.FormEvent) => void;
}

export function CustomerPointsTab({
  pointsBalance,
  pointsHistory,
  adjustmentMode,
  adjustmentAmount,
  adjustmentReason,
  adjustmentSuccess,
  isAdjustmentValid,
  onModeChange,
  onAmountChange,
  onReasonChange,
  onApplyAdjustment,
}: CustomerPointsTabProps) {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in-50 duration-150">
      {/* A. Manual Points Adjustment Card */}
      <div className="bg-page/70 rounded-[14px] sm:rounded-[16px] p-4 sm:p-5 border border-default/60 flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-heading font-medium text-xs text-body uppercase tracking-wider">
              Manual adjustment
            </h4>
            <Badge variant="gold" size="sm">
              {pointsBalance.toLocaleString()} pts available
            </Badge>
          </div>
        </div>

        {/* Adjustment Success Toast */}
        {adjustmentSuccess && (
          <div className="bg-status-success-bg border border-status-success/40 text-status-success text-xs font-sans px-3 py-2 rounded-lg flex items-center gap-1.5 animate-in fade-in-50">
            <span>✓</span>
            <span>Points adjustment applied successfully to customer balance.</span>
          </div>
        )}

        <form onSubmit={onApplyAdjustment} className="flex flex-col gap-3">
          {/* Mode Selector Toggle Pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onModeChange("add")}
              className={cn(
                "flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 font-sans font-medium text-xs transition-all cursor-pointer border",
                adjustmentMode === "add"
                  ? "bg-primary text-dark-primary border-primary shadow-xs"
                  : "bg-card border-default text-body hover:text-heading"
              )}
            >
              <Plus className="size-3.5" />
              <span>+ Add points</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange("deduct")}
              className={cn(
                "flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 font-sans font-medium text-xs transition-all cursor-pointer border",
                adjustmentMode === "deduct"
                  ? "bg-primary text-dark-primary border-primary shadow-xs"
                  : "bg-card border-default text-body hover:text-heading"
              )}
            >
              <Minus className="size-3.5" />
              <span>- Deduct points</span>
            </button>
          </div>

          {/* Amount and Reason Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-1">
              <Input
                label="Points amount *"
                type="number"
                min={1}
                placeholder="e.g. 150"
                value={adjustmentAmount}
                onChange={(e) => onAmountChange(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Reason *"
                placeholder="Goodwill gesture, billing correction, tier bonus..."
                value={adjustmentReason}
                onChange={(e) => onReasonChange(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-1 flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={!isAdjustmentValid}
              className="h-9 px-5 rounded-lg text-xs"
            >
              {adjustmentMode === "add" ? "Credit Points" : "Deduct Points"}
            </Button>
          </div>
        </form>
      </div>

      {/* B. Points History List */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-heading font-medium text-xs text-body uppercase tracking-wider">
            Points history
          </h4>
          <span className="font-sans text-xs text-muted">
            {pointsHistory.length} transactions
          </span>
        </div>

        <div className="flex flex-col divide-y divide-default/40 rounded-[14px] sm:rounded-[16px] border border-default/60 bg-theme overflow-hidden">
          {pointsHistory.map((item) => {
            const isPositive = item.amount > 0;
            return (
              <div
                key={item.id}
                className="p-3.5 flex items-center justify-between text-xs font-sans hover:bg-subtle/15 transition-colors gap-3"
              >
                {/* Left: Direction Icon & Transaction Details */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center shrink-0 border",
                      isPositive
                        ? "bg-status-success-bg border-status-success/30 text-status-success"
                        : "bg-status-error-bg border-status-error/30 text-status-error"
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="size-4" />
                    ) : (
                      <ArrowDownLeft className="size-4" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-heading truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-body mt-0.5 truncate">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                {/* Right: Points Delta & Badge */}
                <div className="flex flex-col items-end shrink-0">
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      isPositive
                        ? "text-status-success"
                        : "text-heading"
                    )}
                  >
                    {isPositive ? `+${item.amount}` : item.amount} pts
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10.5px] text-muted">{item.date}</span>
                    <Badge
                      variant={item.badgeVariant}
                      size="sm"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {item.badgeLabel}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
