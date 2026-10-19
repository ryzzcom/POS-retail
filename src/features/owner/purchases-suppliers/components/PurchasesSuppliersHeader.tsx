"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UnderlineTabs, UnderlineTabItem } from "@/components/ui/underline-tabs";
import { Button } from "@/components/ui/button";
import { PurchasesTabId, PurchasesSummaryStats } from "../types/purchases-suppliers.types";
import { formatPKR } from "@/lib/formatters";
import { Tag, Building2, Plus, Download, UserPlus } from "lucide-react";

interface PurchasesSuppliersHeaderProps {
  activeTab: PurchasesTabId;
  onTabChange: (tab: PurchasesTabId) => void;
  summary: PurchasesSummaryStats;
  onOpenNewPurchase: () => void;
  onOpenAddSupplier: () => void;
  onExportCsv: () => void;
}

const TABS: UnderlineTabItem<PurchasesTabId>[] = [
  { id: "purchases", label: "Purchases", icon: Tag },
  { id: "suppliers", label: "Suppliers", icon: Building2 },
];

export function PurchasesSuppliersHeader({
  activeTab,
  onTabChange,
  summary,
  onOpenNewPurchase,
  onOpenAddSupplier,
  onExportCsv,
}: PurchasesSuppliersHeaderProps) {
  return (
    <div className="w-full flex flex-col gap-5 select-none">
      <PageHeader
        title="Purchases & Suppliers"
        description={
          <div className="flex items-center gap-2 flex-wrap font-sans text-xs sm:text-sm text-body">
            <span className="font-medium text-heading">
              {summary.openOrdersCount} open orders
            </span>
            <span className="text-muted">·</span>
            <span>
              {formatPKR(summary.pendingDeliveryPKR)} still to arrive
            </span>
            <span className="text-muted">·</span>
            <span>
              you owe suppliers{" "}
              <strong className="font-semibold text-heading">
                {formatPKR(summary.totalPayablePKR)}
              </strong>
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              className="gap-2 font-medium"
            >
              <Download className="w-4 h-4 text-body" />
              <span>Export CSV</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAddSupplier}
              className="gap-2 font-medium bg-card hover:bg-subtle/40"
            >
              <UserPlus className="w-4 h-4 text-body" />
              <span>Add Supplier</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onOpenNewPurchase}
              className="gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New Purchase</span>
            </Button>
          </div>
        }
      />

      {/* Underline Tabs Strip matching Figma */}
      <UnderlineTabs<PurchasesTabId>
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={onTabChange}
        aria-label="Purchases and Suppliers module navigation"
      />
    </div>
  );
}
