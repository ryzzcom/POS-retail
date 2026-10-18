"use client";

import * as React from "react";
import { MessageCircle, Copy, Check, ExternalLink } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";
import { KhataAccount } from "../types/khata.types";

interface WhatsAppReminderDialogProps {
  open: boolean;
  onClose: () => void;
  account: KhataAccount | null;
  onSendSuccess?: (account: KhataAccount) => void;
}

export function WhatsAppReminderDialog({
  open,
  onClose,
  account,
  onSendSuccess,
}: WhatsAppReminderDialogProps) {
  const [copied, setCopied] = React.useState(false);

  if (!account) return null;

  const reminderText = `Assalam-o-Alaikum ${account.customerName} sahiba, gentle reminder from Noor Pret & Boutique regarding your outstanding Khata balance of ${formatPKR(account.balance)}, which has been open for ${account.oldestOpenDays} days. Kindly settle at your earliest convenience. JazakAllah khair!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reminderText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = account.customerPhone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("0")
      ? `92${cleanPhone.slice(1)}`
      : cleanPhone;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
      reminderText
    )}`;
    window.open(url, "_blank");
    onSendSuccess?.(account);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Send WhatsApp Payment Reminder"
      subtitle={`Send balance statement to ${account.customerName} (${account.customerPhone})`}
      maxWidthClass="w-full sm:max-w-[540px]"
    >
      <div className="flex flex-col gap-4 p-5 sm:p-6 select-none">
        {/* Recipient Card */}
        <div className="p-3.5 rounded-xl bg-subtle/50 border border-default flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans font-medium text-xs sm:text-sm text-heading">
              {account.customerName}
            </span>
            <span className="font-sans text-xs text-body">
              {account.customerPhone}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-sans text-[11px] text-body">Overdue Balance</span>
            <span className="font-heading font-semibold text-xs sm:text-sm text-status-error">
              {formatPKR(account.balance)}
            </span>
          </div>
        </div>

        {/* Message Preview */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-medium text-heading">
            Message Preview (Urdu / English Boutique Tone)
          </label>
          <div className="p-4 rounded-xl bg-theme border border-default font-sans text-xs sm:text-sm text-body leading-relaxed whitespace-pre-wrap select-text">
            {reminderText}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-default/50 mt-2">
          <Button
            type="button"
            variant="white"
            onClick={handleCopy}
            leftIcon={
              copied ? (
                <Check className="size-4 text-status-success" />
              ) : (
                <Copy className="size-4" />
              )
            }
          >
            {copied ? "Copied" : "Copy Message"}
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleOpenWhatsApp}
              leftIcon={<ExternalLink className="size-4" />}
            >
              Open in WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
