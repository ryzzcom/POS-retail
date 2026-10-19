"use client";

import * as React from "react";
import {
  CreditUsageBreakdown,
  CreditPack,
  WhatsAppMetricsSummary,
} from "../types/whatsapp-campaigns.types";
import { Crown, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreditsUsageTabProps {
  metrics: WhatsAppMetricsSummary;
  breakdown: CreditUsageBreakdown;
  creditPacks: CreditPack[];
  onBuyPack: (pack: CreditPack) => void;
}

export function CreditsUsageTab({
  metrics,
  breakdown,
  creditPacks,
  onBuyPack,
}: CreditsUsageTabProps) {
  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* 1. Top Section: 2 Cards matching Figma Node 3469:55756 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Dark Card: POS WhatsApp Balance */}
        <div className="lg:col-span-5 bg-primary text-dark-primary rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs relative overflow-hidden">
          {/* Subtle background ambient pattern */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4">
            <span className="font-heading font-medium text-sm text-dark-secondary tracking-tight">
              POS WhatsApp Balance
            </span>
            <Crown className="w-5 h-5 text-accent" />
          </div>

          {/* Huge Metric */}
          <div className="flex flex-col gap-1 py-3">
            <div className="font-heading font-bold text-4xl sm:text-5xl text-dark-primary tracking-tight">
              {metrics.availableCredits.toLocaleString()}
            </div>
            <div className="font-sans text-xs sm:text-sm text-dark-secondary">
              Available Internal Message Credits
            </div>
          </div>

          {/* Breakdown Rows */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-border-dark/60 font-sans text-xs sm:text-sm">
            <div className="flex items-center justify-between text-dark-secondary">
              <span>Monthly Included Allowance:</span>
              <span className="font-medium text-dark-primary">
                {metrics.monthlyAllowance.toLocaleString()} / mo
              </span>
            </div>
            <div className="flex items-center justify-between text-dark-secondary">
              <span>Reserved for Scheduled Campaigns:</span>
              <span className="font-medium text-dark-primary">
                {metrics.reservedCredits.toLocaleString()} credits
              </span>
            </div>
            <div className="flex items-center justify-between text-dark-secondary">
              <span>Purchased Top-ups:</span>
              <span className="font-medium text-dark-primary">
                {metrics.purchasedCredits.toLocaleString()} credits
              </span>
            </div>
          </div>

          {/* Bottom Renewal Row */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-border-dark/60 font-sans text-xs sm:text-sm">
            <span className="text-accent font-medium">Next Renewal Date:</span>
            <span className="font-medium text-dark-primary">{metrics.nextRenewalDate}</span>
          </div>
        </div>

        {/* Right Card: Credit Consumption Breakdown */}
        <div className="lg:col-span-7 bg-card rounded-2xl border border-default/50 p-6 sm:p-7 flex flex-col justify-between shadow-xs">
          <div className="flex flex-col gap-5">
            <h3 className="font-heading font-semibold text-base sm:text-lg text-heading">
              Credit Consumption Breakdown (This Month)
            </h3>

            {/* 4 Stat Boxes matching Figma */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Box 1: Digital Receipts */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-default/50 bg-subtle/20 flex flex-col gap-1">
                <span className="font-sans text-xs text-body">Digital Receipts</span>
                <span className="font-heading font-bold text-xl sm:text-2xl text-heading">
                  {breakdown.digitalReceipts.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-muted">1 credit /receipt</span>
              </div>

              {/* Box 2: Khata Reminders */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-default/50 bg-subtle/20 flex flex-col gap-1">
                <span className="font-sans text-xs text-body">Khata Reminders</span>
                <span className="font-heading font-bold text-xl sm:text-2xl text-heading">
                  {breakdown.khataReminders.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-muted">1 credit / alert</span>
              </div>

              {/* Box 3: Promo Campaigns */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-default/50 bg-subtle/20 flex flex-col gap-1">
                <span className="font-sans text-xs text-body">Promo Campaigns</span>
                <span className="font-heading font-bold text-xl sm:text-2xl text-heading">
                  {breakdown.promoCampaigns.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-muted">1 credit / broadcast</span>
              </div>

              {/* Box 4: Back in Stock */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-default/50 bg-subtle/20 flex flex-col gap-1">
                <span className="font-sans text-xs text-body">Back in Stock</span>
                <span className="font-heading font-bold text-xl sm:text-2xl text-heading">
                  {breakdown.backInStock.toLocaleString()}
                </span>
                <span className="font-sans text-[11px] text-muted">1 credit / alert</span>
              </div>
            </div>
          </div>

          {/* Disclaimer Note matching Figma */}
          <div className="pt-4 mt-4 border-t border-default/30 flex items-start gap-2 text-xs text-body">
            <Info className="w-4 h-4 text-muted shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Note: POS subscription credits represent internal application usage. Meta conversation charges apply separately on your linked Facebook Business Manager.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Bottom Card: Add Top-Up Credit Pack matching Figma */}
      <div className="w-full bg-card rounded-2xl border border-default/50 p-6 sm:p-7 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-heading font-semibold text-base sm:text-lg text-heading">
              Add Top-Up Credit Pack
            </h3>
          </div>
          <p className="font-sans text-xs sm:text-sm text-body">
            Add additional credits instantly if your boutique exceeds the monthly 2,000 message allowance.
          </p>
        </div>

        {/* 3 Credit Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 pt-1">
          {creditPacks.map((pack) => {
            const isFeatured = pack.featured;

            return (
              <div
                key={pack.id}
                className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between gap-5 transition-all ${
                  isFeatured
                    ? "border-primary bg-theme shadow-md ring-1 ring-primary/20"
                    : "border-default/60 bg-card hover:border-default"
                }`}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs sm:text-sm text-body font-medium">
                      {pack.name}
                    </span>
                    {isFeatured && (
                      <span className="font-sans text-[11px] font-semibold text-primary bg-accent/20 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="font-heading font-bold text-2xl sm:text-3xl text-heading">
                    {pack.credits.toLocaleString()} Credits
                  </div>

                  <div className="font-sans text-xs sm:text-sm font-medium text-body pt-1">
                    Rs. {pack.pricePKR.toLocaleString()} + GST
                  </div>
                </div>

                <Button
                  variant={isFeatured ? "primary" : "secondary"}
                  size="default"
                  onClick={() => onBuyPack(pack)}
                  className={`w-full font-medium ${
                    !isFeatured ? "bg-accent hover:bg-accent/90 text-dark-primary" : ""
                  }`}
                >
                  Buy Pack
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
