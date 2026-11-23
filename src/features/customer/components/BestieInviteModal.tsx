"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Send, Copy, Sparkles } from "lucide-react";
import type { CustomerStore } from "../types/customer.types";

interface BestieInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  store?: CustomerStore | null;
}

export function BestieInviteModal({ isOpen, onClose, store }: BestieInviteModalProps) {
  const [copied, setCopied] = React.useState(false);

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/customer/${store?.slug || ""}`
      : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsApp = () => {
    const storeName = store?.name || "Boutique";
    const text = `Hey! 👯 Join me to browse and try on luxury outfits at ${storeName}! We can vote on looks and try clothes virtually with AI: ${inviteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Bring Your Bestie 👯"
      subtitle="Shopping is 10x more fun together! Invite a friend to browse, vote on outfits, and try clothes virtually with AI."
      maxWidthClass="w-full sm:max-w-[480px]"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-[16px] bg-theme border border-default/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-heading">
            <Sparkles className="size-4 text-accent" />
            <span>Bestie Rewards Perk</span>
          </div>
          <p className="text-xs text-body leading-relaxed">
            When your bestie connects to <strong>{store?.name || "our boutique"}</strong>, you both receive{" "}
            <strong>+{store?.tryOnSignupCredits || 5} AI Try-On Credits</strong> to test new looks together!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="h-11 text-xs"
          >
            <Copy className="size-4 mr-1.5" />
            {copied ? "Copied Link!" : "Copy Invite Link"}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleWhatsApp}
            className="h-11 text-xs bg-status-success hover:bg-status-success/90 text-theme border-0"
          >
            <Send className="size-4 mr-1.5" />
            Invite on WhatsApp
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
