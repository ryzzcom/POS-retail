"use client";

import * as React from "react";
import { BookOpen, ClipboardCheck, History } from "lucide-react";
import { UnderlineTabs, UnderlineTabItem } from "@/components/ui/underline-tabs";
import { InventoryTab } from "../types/products-inventory.types";

interface ProductsInventoryTabsProps {
  activeTab: InventoryTab;
  onTabChange: (tab: InventoryTab) => void;
  className?: string;
}

const TABS: UnderlineTabItem<InventoryTab>[] = [
  {
    id: "catalog",
    label: "Catalog",
    icon: BookOpen,
  },
  {
    id: "stocktake",
    label: "Stocktake",
    icon: ClipboardCheck,
  },
  {
    id: "ledger",
    label: "Stock ledger",
    icon: History,
  },
];

export function ProductsInventoryTabs({
  activeTab,
  onTabChange,
  className,
}: ProductsInventoryTabsProps) {
  return (
    <UnderlineTabs
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      className={className}
      aria-label="Products and inventory views"
    />
  );
}

