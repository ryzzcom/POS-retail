"use client";

import * as React from "react";
import { SettingsHeader } from "./SettingsHeader";
import { StoreProfileTab } from "./StoreProfileTab";
import { TeamPermissionsTab } from "./TeamPermissionsTab";
import { BillingSubscriptionTab } from "./BillingSubscriptionTab";
import { ReceiptPrinterTab } from "./ReceiptPrinterTab";
import { SalesStockCreditTab } from "./SalesStockCreditTab";
import { SettingsTab } from "../types";

export function SettingsView() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("store-profile");

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none">
      {/* Header with Title and 5-Tab Navigation Strip */}
      <SettingsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Active Tab View */}
      {activeTab === "store-profile" && <StoreProfileTab />}
      {activeTab === "team-permissions" && <TeamPermissionsTab />}
      {activeTab === "billing-subscription" && <BillingSubscriptionTab />}
      {activeTab === "receipt-printer" && <ReceiptPrinterTab />}
      {activeTab === "sales-stock-credit" && <SalesStockCreditTab />}
    </div>
  );
}
