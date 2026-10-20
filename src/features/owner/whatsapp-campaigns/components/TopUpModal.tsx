"use client";

import * as React from "react";
import { CreditPack } from "../types/whatsapp-campaigns.types";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins, CheckCircle2, ShieldCheck } from "lucide-react";
import { formatPKR } from "@/lib/formatters";

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  pack: CreditPack | null;
  onConfirmPurchase: (pack: CreditPack) => void;
}

export function TopUpModal({
  open,
  onClose,
  pack,
  onConfirmPurchase,
}: TopUpModalProps) {
  if (!pack) return null;

  const gstAmount = Math.round(pack.pricePKR * 0.16); // 16% GST in Pakistan
  const grandTotal = pack.pricePKR + gstAmount;

  const handleConfirm = () => {
    onConfirmPurchase(pack);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Top-Up WhatsApp Message Credits"
      subtitle="Instantly add internal broadcast credits to your store's WhatsApp pool."
      maxWidthClass="w-full sm:max-w-md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
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
            type="button"
            variant="primary"
            size="default"
            onClick={handleConfirm}
            className="px-7 rounded-full gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Recharge</span>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 pt-2 select-none">
        {/* Pack Summary Box */}
        <div className="p-4 rounded-2xl border border-primary/30 bg-theme flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-primary">
              <Coins className="w-5 h-5 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-base text-heading">
                {pack.name}
              </span>
              <span className="font-sans text-xs text-body">
                {pack.credits.toLocaleString()} message credits
              </span>
            </div>
          </div>
          <span className="font-heading font-bold text-lg text-primary">
            {pack.credits.toLocaleString()}
          </span>
        </div>

        {/* Pricing Breakdown */}
        <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-default/50 bg-subtle/20 font-sans text-xs sm:text-sm">
          <div className="flex items-center justify-between text-body">
            <span>Base Pack Price:</span>
            <span className="font-medium text-heading">{formatPKR(pack.pricePKR)}</span>
          </div>
          <div className="flex items-center justify-between text-body">
            <span>Sales Tax (16% PRA GST):</span>
            <span className="font-medium text-heading">{formatPKR(gstAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-heading font-semibold pt-2 border-t border-default/40 text-sm sm:text-base">
            <span>Total Payable:</span>
            <span className="text-primary">{formatPKR(grandTotal)}</span>
          </div>
        </div>

        {/* Payment Methods Notice */}
        <div className="flex items-center gap-2 text-xs text-muted">
          <ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
          <span>Billed directly to your registered store business account via 1Link / Card.</span>
        </div>
      </div>
    </Dialog>
  );
}
