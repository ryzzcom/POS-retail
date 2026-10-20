"use client";

import * as React from "react";
import { CustomerItem } from "../types/customers.types";
import { Switch } from "@/components/ui/switch";
import { formatPKR } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  Phone,
  Mail,
  MapPin,
  Tag,
  Receipt,
  FileText,
  Sparkles,
} from "lucide-react";

export interface CustomerOverviewTabProps {
  customer: CustomerItem;
  pointsBalance: number;
  serviceMessages: boolean;
  promotions: boolean;
  onToggleServiceMessages: (checked: boolean) => void;
  onTogglePromotions: (checked: boolean) => void;
  onSwitchToPointsTab: () => void;
}

export function CustomerOverviewTab({
  customer,
  pointsBalance,
  serviceMessages,
  promotions,
  onToggleServiceMessages,
  onTogglePromotions,
  onSwitchToPointsTab,
}: CustomerOverviewTabProps) {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in-50 duration-150">
      {/* 1. Header KPI Cards Strip */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Spend */}
        <div className="bg-card rounded-[14px] sm:rounded-[16px] p-3 sm:p-3.5 border border-default/60 shadow-xs flex flex-col justify-between">
          <span className="font-sans text-[11px] text-body">Lifetime spend</span>
          <span className="font-heading font-semibold text-base sm:text-lg text-heading mt-1">
            {formatPKR(customer.lifetimeSpend)}
          </span>
          <span className="font-sans text-[11px] text-muted mt-0.5">
            {customer.totalOrders || 1} orders
          </span>
        </div>

        {/* Points (Clickable to switch to Points Tab) */}
        <button
          type="button"
          onClick={onSwitchToPointsTab}
          className="rounded-[14px] sm:rounded-[16px] p-3 sm:p-3.5 border text-left transition-all cursor-pointer shadow-xs flex flex-col justify-between bg-card border-default/60 hover:border-accent/60"
        >
          <span className="font-sans text-[11px] text-body flex items-center justify-between">
            <span>Loyalty points</span>
            <Sparkles className="size-3 text-accent" />
          </span>
          <span className="font-heading font-semibold text-base sm:text-lg text-accent mt-1">
            {pointsBalance.toLocaleString()}
          </span>
          <span className="font-sans text-[11px] text-muted mt-0.5">
            Tier: {customer.tier}
          </span>
        </button>

        {/* Khata Balance */}
        <div className="bg-card rounded-[14px] sm:rounded-[16px] p-3 sm:p-3.5 border border-default/60 shadow-xs flex flex-col justify-between">
          <span className="font-sans text-[11px] text-body">Khata balance</span>
          <span
            className={cn(
              "font-heading font-semibold text-base sm:text-lg mt-1",
              customer.khataBalance > 0
                ? "text-status-error"
                : "text-status-success"
            )}
          >
            {customer.khataBalance > 0
              ? formatPKR(customer.khataBalance)
              : "Rs. 0"}
          </span>
          <span className="font-sans text-[11px] text-muted mt-0.5">
            {customer.khataBalance > 0 ? "Receivable" : "Clear"}
          </span>
        </div>
      </div>

      {/* 2. Contact Information */}
      <div className="bg-theme rounded-[14px] sm:rounded-[16px] p-4 border border-default/60 flex flex-col gap-3">
        <h4 className="font-heading font-medium text-xs text-body uppercase tracking-wider">
          Contact Information
        </h4>

        <div className="flex flex-col gap-2.5 text-xs font-sans text-heading">
          <div className="flex items-center gap-2.5">
            <Phone className="size-4 text-muted shrink-0" />
            <span className="font-medium">{customer.phone}</span>
          </div>

          {customer.email && (
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 text-muted shrink-0" />
              <span>{customer.email}</span>
            </div>
          )}

          {customer.address && (
            <div className="flex items-center gap-2.5">
              <MapPin className="size-4 text-muted shrink-0" />
              <span>
                {customer.address}
                {customer.city ? `, ${customer.city}` : ""}
              </span>
            </div>
          )}

          {customer.tag && (
            <div className="flex items-center gap-2.5">
              <Tag className="size-4 text-muted shrink-0" />
              <span className="px-2 py-0.5 rounded-full bg-subtle/50 text-body font-medium">
                {customer.tag}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Communication Preferences Toggles */}
      <div className="bg-theme rounded-[14px] sm:rounded-[16px] p-4 border border-default/60 flex flex-col gap-2">
        <div className="flex items-center justify-between pb-2 border-b border-default/40">
          <h4 className="font-heading font-medium text-xs text-body uppercase tracking-wider">
            Communication Preferences
          </h4>
          <span className="font-sans text-[11px] text-muted">
            {promotions ? "Subscribed to marketing" : "Marketing paused"}
          </span>
        </div>

        <div className="flex flex-col divide-y divide-default/30">
          <Switch
            id="comm-service-msg"
            checked={serviceMessages}
            onCheckedChange={onToggleServiceMessages}
            label="WhatsApp receipts & service messages"
            description="Receipts, Khata reminders, back-in-stock"
            className="py-2.5"
          />

          <Switch
            id="comm-promotions"
            checked={promotions}
            onCheckedChange={onTogglePromotions}
            label="Promotions"
            description="New arrivals, birthday, win-back campaigns"
            className="py-2.5"
          />
        </div>
      </div>

      {/* 4. Fitting & Style Notes */}
      {customer.notes && (
        <div className="bg-theme rounded-[14px] sm:rounded-[16px] p-4 border border-default/60 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-body">
            <FileText className="size-4 text-muted" />
            <span>Customer Style & Fitting Notes</span>
          </div>
          <p className="font-sans text-xs text-heading leading-relaxed">
            {customer.notes}
          </p>
        </div>
      )}

      {/* 5. Recent Purchase Receipts */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-heading font-medium text-xs text-body uppercase tracking-wider">
            Recent Sales Receipts
          </h4>
          <span className="font-sans text-xs text-muted">
            Last visited {customer.lastVisit}
          </span>
        </div>

        <div className="flex flex-col divide-y divide-default/40 rounded-[14px] sm:rounded-[16px] border border-default/60 bg-theme overflow-hidden">
          <div className="p-3 flex items-center justify-between text-xs font-sans hover:bg-subtle/15 transition-colors">
            <div className="flex items-center gap-2.5">
              <Receipt className="size-4 text-muted" />
              <div className="flex flex-col">
                <span className="font-medium text-heading">NP-010420</span>
                <span className="text-[11px] text-body">
                  Chiffon Formal Shirt · {customer.lastVisit}
                </span>
              </div>
            </div>
            <span className="font-medium text-heading">Rs. 9,500</span>
          </div>

          {customer.lifetimeSpend > 20000 && (
            <div className="p-3 flex items-center justify-between text-xs font-sans hover:bg-subtle/15 transition-colors">
              <div className="flex items-center gap-2.5">
                <Receipt className="size-4 text-muted" />
                <div className="flex flex-col">
                  <span className="font-medium text-heading">NP-010385</span>
                  <span className="text-[11px] text-body">
                    Embroidered Raw Silk Suit · 24 Sep 2026
                  </span>
                </div>
              </div>
              <span className="font-medium text-heading">Rs. 24,500</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
