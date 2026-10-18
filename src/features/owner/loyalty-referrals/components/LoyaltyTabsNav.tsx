"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Table, Ticket, Users } from "lucide-react";
import { LoyaltyTabType } from "../types/loyalty-referrals.types";

interface LoyaltyTabsNavProps {
  activeTab: LoyaltyTabType;
  onTabChange: (tab: LoyaltyTabType) => void;
  couponCount?: number;
  ledgerCount?: number;
}

export function LoyaltyTabsNav({
  activeTab,
  onTabChange,
  couponCount = 0,
  ledgerCount = 0,
}: LoyaltyTabsNavProps) {
  const tabs = [
    {
      id: "rules" as LoyaltyTabType,
      label: "Point Rules",
      icon: Table,
    },
    {
      id: "coupons" as LoyaltyTabType,
      label: "Coupons",
      icon: Ticket,
      badge: couponCount > 0 ? couponCount : undefined,
    },
    {
      id: "ledger" as LoyaltyTabType,
      label: "Referrals & Ledger",
      icon: Users,
      badge: ledgerCount > 0 ? ledgerCount : undefined,
    },
  ];

  return (
    <div className="w-full border-b border-default/50 overflow-x-auto no-scrollbar select-none">
      <div className="flex items-center gap-8 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 py-3.5 text-sm font-sans transition-all cursor-pointer",
                isActive
                  ? "text-heading font-medium"
                  : "text-body hover:text-heading font-normal"
              )}
            >
              <Icon
                className={cn(
                  "size-4.5 transition-colors",
                  isActive ? "text-primary" : "text-muted"
                )}
              />
              <span>{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors",
                    isActive
                      ? "bg-primary text-dark-primary"
                      : "bg-subtle text-body"
                  )}
                >
                  {tab.badge}
                </span>
              )}

              {/* Active Tab Bottom Indicator Line (Figma Node 3451:42548) */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
