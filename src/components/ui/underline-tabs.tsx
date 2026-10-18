"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface UnderlineTabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export interface UnderlineTabsProps<T extends string = string> {
  tabs: UnderlineTabItem<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  className?: string;
  tabClassName?: string;
  "aria-label"?: string;
}

export function UnderlineTabs<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  className,
  tabClassName,
  "aria-label": ariaLabel = "Navigation tabs",
}: UnderlineTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "w-full border-b border-default/40 overflow-x-auto no-scrollbar select-none",
        className
      )}
    >
      <div className="flex items-center gap-6 sm:gap-8 min-w-max pt-1">
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
                "relative inline-flex items-center gap-2 pb-3.5 pt-1 font-sans text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer",
                isActive
                  ? "text-heading font-medium"
                  : "text-body hover:text-heading font-normal",
                tabClassName
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "size-4 sm:size-4.5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted"
                  )}
                />
              )}
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

              {/* Active bottom indicator line */}
              {isActive && (
                <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default UnderlineTabs;
