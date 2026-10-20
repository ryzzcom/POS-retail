"use client";

import * as React from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SegmentedFilter } from "@/components/ui/segmented-filter";
import { CustomerItem, PointHistoryItem } from "../types/customers.types";
import { CustomerOverviewTab } from "./CustomerOverviewTab";
import { CustomerPointsTab } from "./CustomerPointsTab";
import { cn } from "@/lib/utils";
import { CreditCard, MessageCircle } from "lucide-react";

export type { PointHistoryItem };

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
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-default bg-card font-sans font-medium text-xs text-heading hover:bg-subtle/25 transition-colors cursor-pointer"
            >
              <MessageCircle className="size-3.5" />
              <span>WhatsApp</span>
            </a>
            {customer.khataBalance > 0 && onRecordPayment && (
              <Button
                type="button"
                variant="primary"
                onClick={() => onRecordPayment(customer)}
                className="h-9 px-4 rounded-full text-xs gap-1.5"
              >
                <CreditCard className="size-3.5" />
                <span>Record Payment</span>
              </Button>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full px-4 text-xs h-9"
          >
            Close
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 p-4 sm:p-6 select-none">
        {/* Drawer Tab Switcher Pill Bar */}
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

        {/* Tab 1: Overview & Profile */}
        {activeTab === "overview" && (
          <CustomerOverviewTab
            customer={customer}
            pointsBalance={pointsBalance}
            serviceMessages={serviceMessages}
            promotions={promotions}
            onToggleServiceMessages={handleToggleServiceMessages}
            onTogglePromotions={handleTogglePromotions}
            onSwitchToPointsTab={() => setActiveTab("points")}
          />
        )}

        {/* Tab 2: Points & Loyalty */}
        {activeTab === "points" && (
          <CustomerPointsTab
            pointsBalance={pointsBalance}
            pointsHistory={pointsHistory}
            adjustmentMode={adjustmentMode}
            adjustmentAmount={adjustmentAmount}
            adjustmentReason={adjustmentReason}
            adjustmentSuccess={adjustmentSuccess}
            isAdjustmentValid={isAdjustmentValid}
            onModeChange={setAdjustmentMode}
            onAmountChange={setAdjustmentAmount}
            onReasonChange={setAdjustmentReason}
            onApplyAdjustment={handleApplyAdjustment}
          />
        )}
      </div>
    </Drawer>
  );
}
