"use client";

import React from "react";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Keyboard,
  ScanBarcode,
  ShoppingCart,
  UserCheck,
  CreditCard,
  PauseCircle,
  ExternalLink,
} from "lucide-react";

export interface PosShortcutsGuideModalProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  badge?: string;
}

interface ShortcutCategory {
  title: string;
  icon: React.ElementType;
  items: ShortcutItem[];
}

const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    title: "Scanning & Catalog",
    icon: ScanBarcode,
    items: [
      {
        keys: ["F2", "/"],
        description: "Focus Barcode scanner & search input",
        badge: "Essential",
      },
      {
        keys: ["Enter"],
        description: "Add scanned product or exact SKU variant to cart",
      },
      {
        keys: ["Esc"],
        description: "Clear search query or dismiss open dropdown",
      },
    ],
  },
  {
    title: "Cart & Line Items",
    icon: ShoppingCart,
    items: [
      {
        keys: ["↑", "↓"],
        description: "Navigate active cart items up and down",
      },
      {
        keys: ["+", "="],
        description: "Increment quantity of selected cart item",
      },
      {
        keys: ["-"],
        description: "Decrement quantity of selected cart item",
      },
      {
        keys: ["Del", "Backspace"],
        description: "Remove selected item from active cart",
      },
      {
        keys: ["F8", "Alt+X"],
        description: "Clear entire active cart",
      },
    ],
  },
  {
    title: "Customer & Discounts",
    icon: UserCheck,
    items: [
      {
        keys: ["F3", "Alt+C"],
        description: "Focus Customer search (by phone or name)",
        badge: "Frequent",
      },
      {
        keys: ["Shift+F3"],
        description: "Detach current customer from active cart",
      },
      {
        keys: ["F4", "Alt+D"],
        description: "Focus Bill-level discount field",
      },
    ],
  },
  {
    title: "Queue & Parking",
    icon: PauseCircle,
    items: [
      {
        keys: ["F6"],
        description: "Park / Hold active customer bill immediately",
      },
      {
        keys: ["F7"],
        description: "Open Held Bills drawer to recall parked carts",
      },
    ],
  },
  {
    title: "Payment & Checkout",
    icon: CreditCard,
    items: [
      {
        keys: ["F9"],
        description: "Trigger Checkout & open payment modal",
        badge: "Essential",
      },
      {
        keys: ["1", "2", "3", "4", "5"],
        description: "Select tender method in checkout (Cash, Card, Bank, Wallet, Khata)",
      },
      {
        keys: ["Enter"],
        description: "Confirm payment and finalize thermal receipt",
      },
    ],
  },
];

export function PosShortcutsGuideModal({
  open,
  onClose,
}: PosShortcutsGuideModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="POS Keyboard Shortcuts & Hotkeys"
      subtitle="Operate the cash counter 100% mouse-free with high-speed keyboard controls"
      maxWidthClass="w-full sm:max-w-[680px]"
    >
      <div className="flex flex-col gap-5 select-none py-1 max-h-[75vh] overflow-y-auto custom-scrollbar pr-1">
        {/* Quick Tip Header */}
        <div className="flex items-center gap-3 p-3 rounded-[14px] bg-subtle/40 border border-default/60">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Keyboard className="size-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-heading font-medium text-xs sm:text-sm text-heading">
              Barcode Scanner Automation
            </span>
            <p className="font-sans text-[11px] sm:text-xs text-body leading-relaxed">
              Standard USB & Bluetooth barcode scanners automatically send an <kbd className="px-1.5 py-0.5 rounded bg-card border border-default text-[10px] font-mono text-heading">Enter</kbd> keycode after every scan, automatically adding items directly to the cart.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SHORTCUT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="flex flex-col gap-2.5 p-3.5 rounded-[16px] bg-card border border-default/70 shadow-xs"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-default/40">
                  <Icon className="size-4 text-accent shrink-0" />
                  <span className="font-heading font-semibold text-xs sm:text-sm text-heading">
                    {cat.title}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {cat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 text-xs font-sans"
                    >
                      <span className="text-body text-[11px] sm:text-xs min-w-0">
                        {item.description}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k) => (
                          <kbd
                            key={k}
                            className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-[6px] bg-subtle/80 border border-default font-mono text-[11px] font-semibold text-heading shadow-xs"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions & Link to Full Guide */}
        <div className="flex items-center justify-between pt-3 border-t border-default/50 gap-3">
          <Link
            href="/pos/shortcuts"
            target="_blank"
            className="inline-flex items-center gap-1.5 font-sans text-xs text-primary hover:underline font-medium"
          >
            <span>Open printable guide page</span>
            <ExternalLink className="size-3.5" />
          </Link>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onClose}
            className="rounded-full px-5 text-xs font-sans"
          >
            Got it (Esc)
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
