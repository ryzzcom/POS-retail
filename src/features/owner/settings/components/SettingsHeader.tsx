"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UnderlineTabs, UnderlineTabItem } from "@/components/ui/underline-tabs";
import { SettingsTab } from "../types";
import {
  Store,
  Users,
  CreditCard,
  Printer,
  Sliders,
} from "lucide-react";

interface SettingsHeaderProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const SETTINGS_TABS: UnderlineTabItem<SettingsTab>[] = [
  {
    id: "store-profile",
    label: "Store profile",
    icon: Store,
  },
  {
    id: "team-permissions",
    label: "Team & permissions",
    icon: Users,
  },
  {
    id: "billing-subscription",
    label: "Billing & subscription",
    icon: CreditCard,
  },
  {
    id: "receipt-printer",
    label: "Receipt & printer",
    icon: Printer,
  },
  {
    id: "sales-stock-credit",
    label: "Sales, stock & credit",
    icon: Sliders,
  },
];

export function SettingsHeader({
  activeTab,
  onTabChange,
}: SettingsHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Page Header */}
      <PageHeader
        title="Settings & Preferences"
        description="Configure store identity, staff terminal permissions, hardware printing, and POS checkout policies."
      />

      {/* 5-Tab Underline Strip */}
      <UnderlineTabs
        tabs={SETTINGS_TABS}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );
}
