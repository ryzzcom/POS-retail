"use client";

import * as React from "react";
import { ConnectionConsentConfig } from "../types/whatsapp-campaigns.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Info, CheckCircle2 } from "lucide-react";

interface ConnectionConsentTabProps {
  initialConfig: ConnectionConsentConfig;
  onSaveConfig: (config: ConnectionConsentConfig) => void;
  onCancel: () => void;
}

export function ConnectionConsentTab({
  initialConfig,
  onSaveConfig,
  onCancel,
}: ConnectionConsentTabProps) {
  const [config, setConfig] = React.useState<ConnectionConsentConfig>(initialConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(config);
  };

  return (
    <div className="w-full flex flex-col gap-6 select-none max-w-5xl">
      {/* 1. Main Card matching Figma Node 3469:55490 */}
      <div className="w-full bg-card rounded-2xl border border-default/50 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 pb-2 border-b border-default/30">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading font-semibold text-lg sm:text-xl text-heading tracking-tight">
                WhatsApp Business Cloud API
              </h2>
              <p className="font-sans text-xs sm:text-sm text-body leading-normal">
                Messages are sent by a background worker; the POS never waits for delivery.
              </p>
            </div>

            <Switch
              checked={config.isApiEnabled}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({ ...prev, isApiEnabled: checked }))
              }
              aria-label="Toggle WhatsApp Business Cloud API"
            />
          </div>

          {/* Form Fields matching Figma */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Phone Number ID */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phoneNumberId"
                className="font-sans text-xs sm:text-sm font-medium text-heading"
              >
                Phone Number ID
              </label>
              <Input
                id="phoneNumberId"
                value={config.phoneNumberId}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, phoneNumberId: e.target.value }))
                }
                placeholder="From Meta Business Manager"
                disabled={!config.isApiEnabled}
              />
            </div>

            {/* Business Display Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="businessDisplayName"
                className="font-sans text-xs sm:text-sm font-medium text-heading"
              >
                Business display name
              </label>
              <Input
                id="businessDisplayName"
                value={config.businessDisplayName}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, businessDisplayName: e.target.value }))
                }
                placeholder="Enter business display name"
                disabled={!config.isApiEnabled}
              />
            </div>
          </div>

          {/* Google Review Link */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="googleReviewLink"
              className="font-sans text-xs sm:text-sm font-medium text-heading"
            >
              Google review link
            </label>
            <Input
              id="googleReviewLink"
              value={config.googleReviewLink}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, googleReviewLink: e.target.value }))
              }
              placeholder="google.com/secret pret/review"
              disabled={!config.isApiEnabled}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-default/30">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onCancel}
              className="px-6 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="default"
              className="px-7 rounded-full"
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Customer Consent & Compliance Section */}
      <div className="w-full bg-card rounded-2xl border border-default/50 p-6 sm:p-8 shadow-xs flex flex-col gap-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-default/30">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <div className="flex flex-col">
            <h3 className="font-heading font-semibold text-base sm:text-lg text-heading">
              Consent & Meta Compliance Rules
            </h3>
            <p className="font-sans text-xs text-body">
              Configure automated safeguards to protect your WhatsApp business rating.
            </p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-default/30">
          {/* Rule 1: Explicit POS Opt-in */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans font-medium text-sm text-heading">
                Require explicit customer opt-in at POS checkout
              </span>
              <span className="font-sans text-xs text-body">
                Cashiers will be prompted with an opt-in checkbox before promotional messages can be dispatched.
              </span>
            </div>
            <Switch
              checked={config.requireExplicitOptIn}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({ ...prev, requireExplicitOptIn: checked }))
              }
              aria-label="Require explicit POS opt-in"
            />
          </div>

          {/* Rule 2: Quiet Hours */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans font-medium text-sm text-heading">
                Enforce quiet hours (9:00 PM – 9:00 AM PKT)
              </span>
              <span className="font-sans text-xs text-body">
                Marketing broadcasts triggered during nighttime will automatically queue until morning.
              </span>
            </div>
            <Switch
              checked={config.enforceQuietHours}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({ ...prev, enforceQuietHours: checked }))
              }
              aria-label="Enforce quiet hours"
            />
          </div>

          {/* Rule 3: STOP Keyword Opt-out */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans font-medium text-sm text-heading">
                Automatic STOP keyword opt-out handling
              </span>
              <span className="font-sans text-xs text-body">
                If a customer replies with STOP or UNSUBSCRIBE, their profile will be unflagged for future marketing broadcasts.
              </span>
            </div>
            <Switch
              checked={config.autoUnsubscribeKeyword}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({ ...prev, autoUnsubscribeKeyword: checked }))
              }
              aria-label="Automatic STOP keyword opt-out"
            />
          </div>
        </div>

        {/* Informational Callout */}
        <div className="p-3.5 bg-subtle/30 rounded-xl border border-default/40 flex items-start gap-2.5 text-xs text-body">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <span>
            Utility messages (Digital receipts and Khata debt reminders) are exempt from quiet hours and deliver immediately per Meta WhatsApp Business terms.
          </span>
        </div>
      </div>
    </div>
  );
}
