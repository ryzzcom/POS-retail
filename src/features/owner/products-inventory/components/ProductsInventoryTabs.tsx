"use client";

import * as React from "react";
import { BookOpen, ClipboardCheck, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { InventoryTab } from "../types/products-inventory.types";

interface ProductsInventoryTabsProps {
  activeTab: InventoryTab;
  onTabChange: (tab: InventoryTab) => void;
  className?: string;
}

export function ProductsInventoryTabs({
  activeTab,
  onTabChange,
  className,
}: ProductsInventoryTabsProps) {
  const tabs = [
    {
      id: "catalog" as const,
      label: "Catalog",
      icon: BookOpen,
    },
    {
      id: "stocktake" as const,
      label: "Stocktake",
      icon: ClipboardCheck,
    },
    {
      id: "ledger" as const,
      label: "Stock ledger",
      icon: History,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Products and inventory views"
      className={cn(
        "w-full flex items-center gap-6 sm:gap-8 border-b border-default/40 pt-1 select-none overflow-x-auto custom-scrollbar",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 pb-3.5 pt-1 font-sans text-xs sm:text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer",
              isActive
                ? "text-heading"
                : "text-body hover:text-heading"
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0 transition-colors",
                isActive ? "text-primary" : "text-muted"
              )}
            />
            <span>{tab.label}</span>

            {/* Active underline indicator */}
            {isActive && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
