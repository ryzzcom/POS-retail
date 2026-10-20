"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newCampaignSchema,
  NewCampaignFormValues,
} from "../schemas/whatsapp-campaigns.schemas";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCheck, Send, Smartphone } from "lucide-react";

interface NewCampaignModalProps {
  open: boolean;
  onClose: () => void;
  availableCredits: number;
  availableCoupons: { label: string; value: string }[];
  onSubmitCampaign: (values: NewCampaignFormValues) => void;
}

const AUDIENCE_OPTIONS = [
  { label: "All Active Customers (450 contacts)", value: "all_active" },
  { label: "VIP Boutique Tier — Spent > Rs. 50k (100 contacts)", value: "vip_tier" },
  { label: "Khata Balance Overdue (42 contacts)", value: "khata_overdue" },
  { label: "Inactive 60+ Days (210 contacts)", value: "inactive_60" },
];

const TEMPLATE_OPTIONS = [
  { label: "New arrivals & Promo Announcement", value: "tpl-new-arrivals" },
  { label: "Points balance & Loyalty Boost", value: "tpl-points-boost" },
  { label: "Khata Payment Due Reminder", value: "tpl-khata-reminder" },
  { label: "Post-Purchase VIP Feedback", value: "tpl-feedback" },
];

export function NewCampaignModal({
  open,
  onClose,
  availableCredits,
  availableCoupons,
  onSubmitCampaign,
}: NewCampaignModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewCampaignFormValues>({
    resolver: zodResolver(newCampaignSchema),
    defaultValues: {
      title: "",
      purpose: "",
      audienceSegment: "all_active",
      couponCode: availableCoupons[0]?.value || "SILK2026",
      templateId: "tpl-new-arrivals",
      scheduleType: "now",
      customNote: "",
    },
  });

  const selectedAudience = watch("audienceSegment");
  const selectedCoupon = watch("couponCode");
  const selectedTitle = watch("title");

  // Determine audience recipient count
  const recipientCount = React.useMemo(() => {
    switch (selectedAudience) {
      case "vip_tier":
        return 100;
      case "khata_overdue":
        return 42;
      case "inactive_60":
        return 210;
      case "all_active":
      default:
        return 450;
    }
  }, [selectedAudience]);

  const remainingCredits = availableCredits - recipientCount;

  const onFormSubmit = (data: NewCampaignFormValues) => {
    onSubmitCampaign(data);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create & Broadcast WhatsApp Campaign"
      subtitle="Engage customer segments with personalized WhatsApp promotional messages and track POS redemption."
      maxWidthClass="w-full sm:max-w-4xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6 pt-2 select-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div>
              <Input
                label="Campaign Title *"
                placeholder="e.g. Mid-Season Unstitched Clearance"
                error={errors.title?.message}
                {...register("title")}
              />
            </div>

            <div>
              <Input
                label="Campaign Purpose / Goal *"
                placeholder="e.g. Clear summer lawn stock before Winter launch"
                error={errors.purpose?.message}
                {...register("purpose")}
              />
            </div>

            {/* Target Audience Segment */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs sm:text-sm font-medium text-heading">
                Target Audience Segment *
              </label>
              <Controller
                name="audienceSegment"
                control={control}
                render={({ field }) => (
                  <Select
                    options={AUDIENCE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    fullWidth
                  />
                )}
              />
            </div>

            {/* Template & Linked Coupon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs sm:text-sm font-medium text-heading">
                  WhatsApp Template *
                </label>
                <Controller
                  name="templateId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={TEMPLATE_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs sm:text-sm font-medium text-heading">
                  Attach POS Coupon Code
                </label>
                <Controller
                  name="couponCode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={availableCoupons}
                      value={field.value}
                      onChange={field.onChange}
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>

            {/* Cost Estimate Strip */}
            <div className="p-4 rounded-xl border border-default/60 bg-subtle/30 flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
                <span className="text-body">Selected Recipients:</span>
                <span className="font-semibold text-heading">{recipientCount} customers</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
                <span className="text-body">Credits Required:</span>
                <span className="font-semibold text-heading">{recipientCount} credits</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-sans pt-1 border-t border-default/40">
                <span className="text-body">Credits Remaining After Send:</span>
                <span
                  className={`font-semibold ${
                    remainingCredits >= 0 ? "text-status-success" : "text-status-error"
                  }`}
                >
                  {remainingCredits.toLocaleString()} credits
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live WhatsApp Mobile Preview */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-heading">
              <Smartphone className="w-4 h-4 text-accent" />
              <span>Live WhatsApp Message Preview</span>
            </div>

            {/* Simulated Phone Chat Frame */}
            <div className="w-full bg-subtle/70 rounded-2xl border border-default/60 p-4 shadow-inner flex flex-col gap-3 min-h-[300px]">
              {/* WhatsApp Header bar */}
              <div className="bg-primary text-dark-primary px-3 py-2 rounded-xl flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent text-dark-primary flex items-center justify-center font-bold text-[10px]">
                    N
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium">Noor Pret & Boutique</span>
                    <span className="text-[10px] text-dark-secondary flex items-center gap-1">
                      Verified Business Account
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Bubble */}
              <div className="self-start max-w-[90%] bg-card text-heading rounded-2xl rounded-tl-none p-3.5 shadow-sm text-xs leading-relaxed flex flex-col gap-2 border border-default/30">
                <p>
                  Assalam o Alaikum <strong>Fatima Raza</strong>,
                </p>
                <p>
                  {selectedTitle || "The Winter 26 luxury pret collection has officially arrived at Noor Pret & Boutique!"}
                </p>
                {selectedCoupon && (
                  <div className="p-2.5 rounded-lg bg-subtle/50 border border-default/40 flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted">Special Offer Code:</span>
                    <span className="font-mono font-bold text-sm text-primary tracking-wider">
                      {selectedCoupon}
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-body">
                  Valid across our Gulberg & DHA boutiques. Show this message at counter checkout to redeem.
                </p>

                <div className="flex items-center justify-end gap-1 text-[10px] text-muted pt-1">
                  <span>10:30 PM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-default/30">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onClose}
            className="px-6 rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={isSubmitting || remainingCredits < 0}
            className="px-7 rounded-full gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Launch Campaign</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
