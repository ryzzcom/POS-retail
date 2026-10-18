"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loyaltyRulesSchema, LoyaltyRulesFormValues } from "../schemas/loyalty-referrals.schemas";
import { LoyaltyRules, LedgerItem, LoyaltyTabType } from "../types/loyalty-referrals.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

interface PointRulesTabProps {
  initialRules: LoyaltyRules;
  recentLedger: LedgerItem[];
  onSaveRules: (rules: LoyaltyRules) => void;
  onNavigateTab: (tab: LoyaltyTabType) => void;
}

export function PointRulesTab({
  initialRules,
  recentLedger,
  onSaveRules,
  onNavigateTab,
}: PointRulesTabProps) {
  const [isSavedToast, setIsSavedToast] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<LoyaltyRulesFormValues>({
    resolver: zodResolver(loyaltyRulesSchema),
    defaultValues: {
      spendPerPoint: initialRules.spendPerPoint,
      pointValue: initialRules.pointValue,
      minBillToRedeem: initialRules.minBillToRedeem,
      minPointsToRedeem: initialRules.minPointsToRedeem,
      maxPointsPerBill: initialRules.maxPointsPerBill,
      maxPercentPayable: initialRules.maxPercentPayable,
      pointsExpiryMonths: initialRules.pointsExpiryMonths,
      silverThreshold: initialRules.silverThreshold,
      goldThreshold: initialRules.goldThreshold,
      reverseOnReturn: initialRules.reverseOnReturn,
    },
  });

  const reverseOnReturn = watch("reverseOnReturn");
  const watchedSpendPerPoint = watch("spendPerPoint") || 100;
  const watchedPointValue = watch("pointValue") || 1;
  const watchedMaxPercent = watch("maxPercentPayable") || 20;

  // Calculate live dynamic values for the "Worked example" card
  const exampleBill = 2000;
  const exampleCustomerPts = 500;
  const maxRedeemRupees = Math.round((exampleBill * watchedMaxPercent) / 100);
  const maxRedeemPtsFromRupees = Math.round(maxRedeemRupees / watchedPointValue);
  const actualRedeemPts = Math.min(exampleCustomerPts, maxRedeemPtsFromRupees);
  const actualDiscountRupees = Math.round(actualRedeemPts * watchedPointValue);
  const actualPayAmount = exampleBill - actualDiscountRupees;
  const actualEarnedPts = Math.floor(actualPayAmount / watchedSpendPerPoint);

  const onSubmit = (data: LoyaltyRulesFormValues) => {
    onSaveRules(data);
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
    }, 3000);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* ========================================================================= */}
      {/* 1. LEFT COLUMN: MAIN CONFIGURATION FORM (Figma Node 3451:43418)          */}
      {/* ========================================================================= */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 w-full bg-card rounded-[22px] sm:rounded-[26px] p-5 sm:p-7 lg:p-8 border border-default/60 shadow-xs flex flex-col gap-8 select-none"
      >
        {/* Toast confirmation */}
        {isSavedToast && (
          <div className="bg-status-success-bg border border-status-success/30 text-status-success text-xs sm:text-sm font-sans px-4 py-2.5 rounded-xl flex items-center gap-2 animate-in fade-in-50">
            <span>✓</span>
            <span>Loyalty & VIP tier rules updated successfully.</span>
          </div>
        )}

        {/* Section 1: Earning & redemption */}
        <div className="flex flex-col gap-5">
          <h2 className="font-heading font-semibold text-xl sm:text-2xl text-heading tracking-[-0.3px]">
            Earning & redemption
          </h2>

          <div className="flex flex-col gap-4">
            {/* Row 1: Spend per point, Point value, Minimum bill to redeem */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Spend per point (Rs.)"
                type="number"
                min={1}
                helperText="Earned on the amount actually paid"
                error={errors.spendPerPoint?.message}
                {...register("spendPerPoint")}
              />

              <Input
                label="1 point is worth (Rs.)"
                type="number"
                step="0.01"
                min={0.01}
                error={errors.pointValue?.message}
                {...register("pointValue")}
              />

              <Input
                label="Minimum bill to redeem (Rs.)"
                type="number"
                min={0}
                error={errors.minBillToRedeem?.message}
                {...register("minBillToRedeem")}
              />
            </div>

            {/* Row 2: Minimum points to redeem, Max points per bill, Max % of bill */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Minimum points to redeem"
                type="number"
                min={0}
                error={errors.minPointsToRedeem?.message}
                {...register("minPointsToRedeem")}
              />

              <Input
                label="Max points per bill"
                type="number"
                min={1}
                error={errors.maxPointsPerBill?.message}
                {...register("maxPointsPerBill")}
              />

              <Input
                label="Max % of bill payable by points"
                type="number"
                min={1}
                max={100}
                error={errors.maxPercentPayable?.message}
                {...register("maxPercentPayable")}
              />
            </div>

            {/* Row 3: Points expire after (months) */}
            <div className="w-full">
              <Input
                label="Points expire after (months)"
                type="number"
                min={1}
                error={errors.pointsExpiryMonths?.message}
                {...register("pointsExpiryMonths")}
              />
            </div>
          </div>
        </div>

        {/* Section 2: VIP tiers (by lifetime spend) */}
        <div className="flex flex-col gap-5 pt-2 border-t border-default/40">
          <h2 className="font-heading font-semibold text-xl sm:text-2xl text-heading tracking-[-0.3px]">
            VIP tiers (by lifetime spend)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Silver from (Rs.)"
              type="number"
              min={0}
              error={errors.silverThreshold?.message}
              {...register("silverThreshold")}
            />

            <Input
              label="Gold from (Rs.)"
              type="number"
              min={0}
              error={errors.goldThreshold?.message}
              {...register("goldThreshold")}
            />
          </div>

          {/* Toggle Switch */}
          <div className="pt-2">
            <Switch
              id="reverse-on-return-toggle"
              checked={Boolean(reverseOnReturn)}
              onCheckedChange={(checked) => setValue("reverseOnReturn", checked, { shouldDirty: true })}
              label="Reverse earned points when items are returned"
              description="Balance may go negative and is automatically recovered from future customer purchases"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="h-11 px-8 rounded-full font-sans font-medium text-sm text-dark-primary shadow-xs"
          >
            Save
          </Button>
        </div>
      </form>

      {/* ========================================================================= */}
      {/* 2. RIGHT COLUMN: WORKED EXAMPLE & RECENT LEDGER (Figma Node 3451:43471)   */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-6 select-none">
        {/* Card 1: Worked Example */}
        <div className="bg-card rounded-2xl p-6 border border-default/60 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-base sm:text-lg text-heading">
              Worked example
            </h3>
            <Sparkles className="size-4 text-accent" />
          </div>

          <p className="font-sans text-xs sm:text-sm text-body leading-relaxed">
            Bill Rs. {exampleBill.toLocaleString()} · customer has {exampleCustomerPts} pts.
          </p>

          <p className="font-sans text-xs sm:text-sm text-body leading-relaxed">
            Can redeem {actualRedeemPts} pts = −Rs. {actualDiscountRupees}. Pays Rs. {actualPayAmount.toLocaleString()}, earns {actualEarnedPts} pts.
          </p>
        </div>

        {/* Card 2: Recent Ledger */}
        <div className="bg-card rounded-2xl p-6 border border-default/60 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1 border-b border-default/30">
            <h3 className="font-heading font-semibold text-base sm:text-lg text-heading">
              Recent ledger
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab("ledger")}
              className="font-sans text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="size-3" />
            </button>
          </div>

          <div className="flex flex-col divide-y divide-default/30">
            {recentLedger.slice(0, 5).map((item) => {
              const isPositive = item.points > 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 text-xs sm:text-sm font-sans"
                >
                  <div className="flex items-center gap-1 truncate pr-2">
                    <span className="font-medium text-heading truncate">
                      {item.customerName}
                    </span>
                    <span className="text-body shrink-0">
                      · {item.type}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "font-semibold text-xs sm:text-sm shrink-0",
                      isPositive ? "text-status-success" : "text-status-error"
                    )}
                  >
                    {isPositive ? `+${item.points}` : item.points}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
