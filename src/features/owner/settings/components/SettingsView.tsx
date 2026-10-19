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
    <div className="space-y-6 pb-12">
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
