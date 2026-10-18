"use client";

import * as React from "react";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SegmentedFilter } from "@/components/ui/segmented-filter";
import { formatPKR } from "@/lib/formatters";
import { CustomerItem } from "../types/customers.types";
import { cn } from "@/lib/utils";
import {
  Phone,
  Mail,
  MapPin,
  Tag,
  CreditCard,
  Award,
  Receipt,
  MessageCircle,
  FileText,
  Plus,
  Minus,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

export interface PointHistoryItem {
  id: string;
  type: "earned" | "redeemed" | "manual_add" | "manual_deduct";
  amount: number;
  title: string;
  subtitle: string;
  date: string;
  badgeLabel: string;
  badgeVariant: "success" | "neutral" | "gold" | "failed";
}

interface CustomerDetailDrawerProps {
  customer: CustomerItem | null;
  open: boolean;
  onClose: () => void;
  onRecordPayment?: (customer: CustomerItem) => void;
  onUpdateCustomer?: (customer: CustomerItem) => void;
}

export function CustomerDetailDrawer({
  customer,
  open,
  onClose,
  onRecordPayment,
  onUpdateCustomer,
}: CustomerDetailDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<"overview" | "points">("overview");

  // Local Customer Communication Toggles
  const [serviceMessages, setServiceMessages] = React.useState(true);
  const [promotions, setPromotions] = React.useState(true);

  // Points State & History
  const [pointsBalance, setPointsBalance] = React.useState(0);
  const [adjustmentMode, setAdjustmentMode] = React.useState<"add" | "deduct">("add");
  const [adjustmentAmount, setAdjustmentAmount] = React.useState("");
  const [adjustmentReason, setAdjustmentReason] = React.useState("");
  const [adjustmentSuccess, setAdjustmentSuccess] = React.useState(false);
  const [pointsHistory, setPointsHistory] = React.useState<PointHistoryItem[]>([]);

  // Initialize or reset state when customer changes
  React.useEffect(() => {
    if (customer) {
      setPointsBalance(customer.points);
      setPromotions(customer.acceptsMarketing);
      setServiceMessages(true);
      setAdjustmentAmount("");
      setAdjustmentReason("");
      setAdjustmentMode("add");
      setAdjustmentSuccess(false);
      setActiveTab("overview");

      // Generate realistic initial point history for this customer
      const initialHistory: PointHistoryItem[] = [
        {
          id: `hist-1-${customer.id}`,
          type: "earned",
          amount: 90,
          title: "Earned on Receipt NP-010420",
          subtitle: "Cashier: Ayesha Khan · 1 item purchased",
          date: customer.lastVisit,
          badgeLabel: "Earned",
          badgeVariant: "success",
        },
      ];

      if (customer.points >= 200) {
        initialHistory.push({
          id: `hist-2-${customer.id}`,
          type: "redeemed",
          amount: -300,
          title: "Redeemed on Receipt NP-010385",
          subtitle: "Discounter voucher applied at checkout",
          date: "24 Sep 2026",
          badgeLabel: "Redeemed",
          badgeVariant: "neutral",
        });
      }

      if (customer.tier === "Gold") {
        initialHistory.push({
          id: `hist-3-${customer.id}`,
          type: "manual_add",
          amount: 200,
          title: "Gold Tier Welcome Bonus",
          subtitle: "Automated loyalty upgrade benefit",
          date: customer.createdAt || "Jan 2025",
          badgeLabel: "Tier Bonus",
          badgeVariant: "gold",
        });
      }

      setPointsHistory(initialHistory);
    }
  }, [customer]);

  if (!customer) return null;

  // Handle Communication Toggle Changes
  const handleTogglePromotions = (checked: boolean) => {
    setPromotions(checked);
    if (customer) {
      const updated: CustomerItem = {
        ...customer,
        acceptsMarketing: checked,
        messaging: checked ? "All messages" : "Opted out",
      };
      onUpdateCustomer?.(updated);
    }
  };

  const handleToggleServiceMessages = (checked: boolean) => {
    setServiceMessages(checked);
  };

  // Handle Points Adjustment Submission
  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(adjustmentAmount, 10);
    if (isNaN(qty) || qty <= 0 || !adjustmentReason.trim()) return;

    const isAdding = adjustmentMode === "add";
    const delta = isAdding ? qty : -qty;
    const newTotal = Math.max(0, pointsBalance + delta);

    const newHistoryItem: PointHistoryItem = {
      id: `adj-${Date.now()}`,
      type: isAdding ? "manual_add" : "manual_deduct",
      amount: delta,
      title: isAdding ? `Manual credit (+${qty} pts)` : `Manual deduction (-${qty} pts)`,
      subtitle: `${adjustmentReason.trim()} · By Ayesha Khan (Store Owner)`,
      date: "Just now",
      badgeLabel: isAdding ? "Manual Add" : "Deduction",
      badgeVariant: isAdding ? "success" : "failed",
    };

    setPointsBalance(newTotal);
    setPointsHistory((prev) => [newHistoryItem, ...prev]);
    setAdjustmentAmount("");
    setAdjustmentReason("");
    setAdjustmentSuccess(true);

    setTimeout(() => {
      setAdjustmentSuccess(false);
    }, 2500);

    // Notify parent
    const updated: CustomerItem = {
      ...customer,
      points: newTotal,
    };
    onUpdateCustomer?.(updated);
  };

  const isAdjustmentValid =
    parseInt(adjustmentAmount, 10) > 0 && adjustmentReason.trim().length >= 3;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={customer.name}
      subtitle={`${customer.phone} · Member since ${customer.createdAt || "Jan 2025"}`}
      widthClass="w-full sm:max-w-[540px] md:max-w-[580px]"
    >
      <div className="flex flex-col gap-5 p-4 sm:p-6 select-none">
        {/* 1. Header KPI Cards Strip */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Spend */}
          <div className="bg-card rounded-xl p-3 sm:p-3.5 border border-default/60 shadow-xs flex flex-col justify-between">
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
            onClick={() => setActiveTab("points")}
            className={cn(
              "rounded-xl p-3 sm:p-3.5 border text-left transition-all cursor-pointer shadow-xs flex flex-col justify-between",
              activeTab === "points"
                ? "bg-accent/10 border-accent"
                : "bg-card border-default/60 hover:border-accent/60"
            )}
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
          <div className="bg-card rounded-xl p-3 sm:p-3.5 border border-default/60 shadow-xs flex flex-col justify-between">
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

        {/* 2. Drawer Tab Switcher Pill Bar */}
        <div className="border-b border-default/50 pb-3">
          <SegmentedFilter
            sizeVariant="sm"
            options={[
              { label: "Overview", value: "overview" },
              {
                label: "Points & Loyalty",
                value: "points",
                badge: (
                  <span
                    className={cn(
                      "text-[11px] px-1.5 py-0.2 rounded-full",
                      activeTab === "points"
                        ? "bg-accent/20 text-accent font-semibold"
                        : "bg-subtle text-muted"
                    )}
                  >
                    {pointsBalance.toLocaleString()} pts
                  </span>
                ),
              },
            ]}
            value={activeTab}
            onChange={(val) => setActiveTab(val as "overview" | "points")}
            aria-label="Customer drawer tabs"
          />
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & PROFILE                                                 */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-5 animate-in fade-in-50 duration-150">
            {/* Contact Information */}
            <div className="bg-theme rounded-xl p-4 border border-default/60 flex flex-col gap-3">
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

            {/* Communication Preferences Toggles (Requirement 2) */}
            <div className="bg-theme rounded-xl p-4 border border-default/60 flex flex-col gap-2">
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
                  onCheckedChange={handleToggleServiceMessages}
                  label="WhatsApp receipts & service messages"
                  description="Receipts, Khata reminders, back-in-stock"
                  className="py-2.5"
                />

                <Switch
                  id="comm-promotions"
                  checked={promotions}
                  onCheckedChange={handleTogglePromotions}
                  label="Promotions"
                  description="New arrivals, birthday, win-back campaigns"
                  className="py-2.5"
                />
              </div>
            </div>

            {/* Fitting & Style Notes */}
            {customer.notes && (
              <div className="bg-theme rounded-xl p-4 border border-default/60 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-body">
                  <FileText className="size-4 text-muted" />
                  <span>Customer Style & Fitting Notes</span>
                </div>
                <p className="font-sans text-xs text-heading leading-relaxed">
                  {customer.notes}
                </p>
              </div>
            )}

            {/* Recent Purchase Receipts */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-medium text-xs text-body uppercase tracking-wider">
                  Recent Sales Receipts
                </h4>
                <span className="font-sans text-xs text-muted">
                  Last visited {customer.lastVisit}
                </span>
              </div>

              <div className="flex flex-col divide-y divide-default/40 rounded-xl border border-default/60 bg-theme overflow-hidden">
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

            {/* Bottom Quick Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              {customer.khataBalance > 0 && onRecordPayment && (
                <button
                  type="button"
                  onClick={() => onRecordPayment(customer)}
                  className="flex-1 h-10 px-4 rounded-full bg-primary font-sans font-medium text-xs text-dark-primary hover:bg-primary/90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <CreditCard className="size-3.5" />
                  <span>Record Khata Payment</span>
                </button>
              )}

              <a
                href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-10 px-4 rounded-full border border-default bg-card font-sans font-medium text-xs text-heading hover:bg-subtle/25 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="size-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: POINTS & LOYALTY (Requirement 3)                                  */}
        {/* ========================================================================= */}
        {activeTab === "points" && (
          <div className="flex flex-col gap-5 animate-in fade-in-50 duration-150">
            {/* A. Manual Points Adjustment Card */}
            <div className="bg-page/70 rounded-xl p-4 sm:p-5 border border-default/60 flex flex-col gap-3.5">
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

              <form onSubmit={handleApplyAdjustment} className="flex flex-col gap-3">
                {/* Mode Selector Toggle Pills */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentMode("add")}
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
                    onClick={() => setAdjustmentMode("deduct")}
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
                      onChange={(e) => setAdjustmentAmount(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      label="Reason *"
                      placeholder="Goodwill gesture, billing correction, tier bonus..."
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
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

              <div className="flex flex-col divide-y divide-default/40 rounded-xl border border-default/60 bg-theme overflow-hidden">
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
        )}
      </div>
    </Drawer>
  );
}
