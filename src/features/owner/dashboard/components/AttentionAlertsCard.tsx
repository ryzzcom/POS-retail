"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttentionAlertItem } from "../types/dashboard.types";

interface AttentionAlertsCardProps {
  alerts: AttentionAlertItem[];
  className?: string;
}

export function AttentionAlertsCard({
  alerts,
  className,
}: AttentionAlertsCardProps) {
  return (
    <div
      className={cn(
        "w-full bg-theme rounded-[22px] p-5 sm:p-6 border border-default/40 shadow-xs flex flex-col select-none",
        className
      )}
    >
      {/* Card Header (Figma Node 3382:12072) */}
      <div className="pb-3 border-b border-default">
        <h2 className="font-sans font-medium text-sm text-heading tracking-normal">
          Needs your attention
        </h2>
      </div>

      {/* List of Actionable Alerts (Figma Node 3382:12074) */}
      <div className="flex flex-col divide-y divide-default/50">
        {alerts.map((alert) => {
          const itemContent = (
            <div className="flex items-center justify-between py-3 px-1 sm:px-2 group hover:bg-subtle/25 rounded-lg transition-colors">
              {/* Left: Icon & Description */}
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <AlertCircle
                  className={cn(
                    "size-4 shrink-0 mt-0.5",
                    alert.severity === "error"
                      ? "text-status-error"
                      : "text-status-warning"
                  )}
                  aria-hidden="true"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-sm text-heading leading-tight truncate">
                    {alert.title}
                  </span>
                  <span className="font-sans text-xs text-body leading-tight mt-0.5 truncate">
                    {alert.subtitle}
                  </span>
                </div>
              </div>

              {/* Right: Action Arrow */}
              <ArrowRight
                className="size-4 shrink-0 text-muted group-hover:text-heading group-hover:translate-x-0.5 transition-all"
                aria-hidden="true"
              />
            </div>
          );

          if (alert.href) {
            return (
              <Link
                key={alert.id}
                href={alert.href}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              >
                {itemContent}
              </Link>
            );
          }

          return <div key={alert.id}>{itemContent}</div>;
        })}
      </div>
    </div>
  );
}
