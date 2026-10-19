"use client";

import * as React from "react";
import { AutomatedMessageRule } from "../types/whatsapp-campaigns.types";
import { Switch } from "@/components/ui/switch";
import { Clock, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AutomatedMessagesTabProps {
  rules: AutomatedMessageRule[];
  onToggleRule: (ruleId: string, enabled: boolean) => void;
  onConfigureRule?: (rule: AutomatedMessageRule) => void;
}

export function AutomatedMessagesTab({
  rules,
  onToggleRule,
  onConfigureRule,
}: AutomatedMessagesTabProps) {
  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {rules.map((rule) => {
        const isImmediate = rule.timing.toLowerCase().includes("immediate");

        return (
          <div
            key={rule.id}
            className="w-full bg-card rounded-2xl border border-default/50 p-5 sm:p-6 flex items-center justify-between gap-4 shadow-xs hover:border-default transition-all"
          >
            {/* Rule Details matching Figma Node 3469:54890 */}
            <div className="flex flex-col gap-1.5 min-w-0">
              {/* Row 1: Title · Timing */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-semibold text-sm sm:text-base text-heading">
                  {rule.title}
                </span>
                <span className="text-muted text-xs">·</span>
                <span className="inline-flex items-center gap-1 font-sans text-xs text-body font-medium">
                  {isImmediate ? (
                    <Zap className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-muted" />
                  )}
                  {rule.timing}
                </span>
              </div>

              {/* Row 2: Trigger */}
              <div className="font-sans text-xs sm:text-sm text-body leading-normal">
                <span className="font-medium text-heading">Trigger:</span> {rule.trigger}
              </div>

              {/* Row 3: Template & Last run */}
              <div className="font-sans text-xs text-muted flex items-center gap-2 flex-wrap pt-0.5">
                <span>
                  <strong className="font-medium text-body">Template:</strong> {rule.templateName}
                </span>
                <span>|</span>
                <span>
                  <strong className="font-medium text-body">Last run:</strong> {rule.lastRun}
                </span>
              </div>
            </div>

            {/* Right: Switch Toggle & Config */}
            <div className="flex items-center gap-3 shrink-0">
              {onConfigureRule && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onConfigureRule(rule)}
                  className="hidden sm:inline-flex h-8 px-2 text-xs text-body hover:text-heading"
                >
                  <Settings className="w-3.5 h-3.5" />
                </Button>
              )}

              <Switch
                checked={rule.enabled}
                onCheckedChange={(checked) => onToggleRule(rule.id, checked)}
                aria-label={`Toggle ${rule.title}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
