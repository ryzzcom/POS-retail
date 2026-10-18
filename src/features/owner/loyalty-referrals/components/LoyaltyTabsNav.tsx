"use client";

import * as React from "react";
import { Table, Ticket, Users } from "lucide-react";
import { UnderlineTabs, UnderlineTabItem } from "@/components/ui/underline-tabs";
import { LoyaltyTabType } from "../types/loyalty-referrals.types";

interface LoyaltyTabsNavProps {
  activeTab: LoyaltyTabType;
  onTabChange: (tab: LoyaltyTabType) => void;
  couponCount?: number;
  ledgerCount?: number;
  className?: string;
}

export function LoyaltyTabsNav({
  activeTab,
  onTabChange,
  couponCount = 0,
  ledgerCount = 0,
  className,
}: LoyaltyTabsNavProps) {
  const tabs: UnderlineTabItem<LoyaltyTabType>[] = [
    {
      id: "rules",
      label: "Point Rules",
      icon: Table,
    },
    {
      id: "coupons",
      label: "Coupons",
      icon: Ticket,
      badge: couponCount > 0 ? couponCount : undefined,
    },
    {
      id: "ledger",
      label: "Referrals & Ledger",
      icon: Users,
      badge: ledgerCount > 0 ? ledgerCount : undefined,
    },
  ];

  return (
    <UnderlineTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      className={className}
      aria-label="Loyalty program navigation"
    />
  );
}

