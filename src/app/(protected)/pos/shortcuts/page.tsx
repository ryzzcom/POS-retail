"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Keyboard,
  ScanBarcode,
  ShoppingCart,
  UserCheck,
  CreditCard,
  PauseCircle,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ShortcutRow {
  key: string;
  action: string;
  context: string;
  description: string;
}

const SHORTCUT_TABLE: ShortcutRow[] = [
  {
    key: "F1 or ?",
    action: "Shortcuts Help",
    context: "Anywhere",
    description: "Open the quick overlay dialog cheat sheet.",
  },
  {
    key: "F2 or /",
    action: "Focus Scanner",
    context: "Anywhere",
    description: "Focus the barcode & search bar. Selects existing text for immediate overwrite.",
  },
  {
    key: "Enter",
    action: "Add to Cart",
    context: "In Search Bar",
    description: "Instantly adds scanned barcode, SKU, or single matched product to the active cart.",
  },
  {
    key: "↑ / ↓",
    action: "Select Cart Item",
    context: "POS Register",
    description: "Move selection highlight up and down through line items in the active cart.",
  },
  {
    key: "+ or =",
    action: "Increase Quantity",
    context: "Cart Selected",
    description: "Increment the quantity of the currently selected cart item by 1.",
  },
  {
    key: "-",
    action: "Decrease Quantity",
    context: "Cart Selected",
    description: "Decrement the quantity of the currently selected cart item by 1.",
  },
  {
    key: "Delete / Backspace",
    action: "Remove Item",
    context: "Cart Selected",
    description: "Remove the selected line item completely from the cart.",
  },
  {
    key: "F3 or Alt + C",
    action: "Customer Search",
    context: "Anywhere",
    description: "Focus customer phone/name lookup input. Type phone number to auto-attach.",
  },
  {
    key: "Shift + F3",
    action: "Detach Customer",
    context: "Anywhere",
    description: "Remove the attached customer and return the cart to Walk-in customer mode.",
  },
  {
    key: "F4 or Alt + D",
    action: "Bill Discount",
    context: "Active Cart",
    description: "Focus the bill-level discount input field to enter a fixed rupee deduction.",
  },
  {
    key: "F6",
    action: "Park / Hold Bill",
    context: "Active Cart",
    description: "Hold the active customer queue immediately and clear register for next customer.",
  },
  {
    key: "F7",
    action: "Recall Parked Bills",
    context: "Anywhere",
    description: "Open the held bills drawer to resume a previously parked customer transaction.",
  },
  {
    key: "F8 or Alt + X",
    action: "Clear Cart",
    context: "Active Cart",
    description: "Clear all items from the current active bill.",
  },
  {
    key: "F9 or Enter",
    action: "Charge / Checkout",
    context: "Cart Ready",
    description: "Open the payment modal dialog to collect payment and print thermal receipt.",
  },
  {
    key: "1 to 5",
    action: "Tender Selection",
    context: "In Checkout Modal",
    description: "1 = Cash, 2 = Card, 3 = Bank Transfer, 4 = JazzCash/EasyPaisa, 5 = Khata.",
  },
  {
    key: "Escape (Esc)",
    action: "Cancel / Close",
    context: "Any Dialog",
    description: "Close any open modal (held bills, checkout, customer, variant, shortcuts).",
  },
];

export default function PosShortcutsGuidePage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen w-full bg-page text-heading font-sans selection:bg-primary selection:text-white p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-6 sm:gap-8">
        {/* Navigation & Action Header */}
        <header className="flex items-center justify-between gap-4 border-b border-default/60 pb-4">
          <Link
            href="/pos"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-body hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span>Return to POS Terminal</span>
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-2 text-xs font-sans rounded-full border-default hover:bg-subtle/50"
          >
            <Printer className="size-3.5" />
            <span className="hidden sm:inline">Print / Save as PDF</span>
          </Button>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-heading text-xs font-medium w-fit">
            <Zap className="size-3.5 text-accent shrink-0" />
            <span>High-Speed Cashier Ergonomics</span>
          </div>

          <h1 className="font-heading font-bold text-2xl sm:text-4xl text-heading tracking-tight">
            POS Keyboard Shortcuts & Barcode Guide
          </h1>

          <p className="font-sans text-xs sm:text-sm text-body max-w-2xl leading-relaxed">
            Master rapid, 100% mouse-free sales transactions. Every feature in the POS terminal can be navigated instantly with standard barcode scanners and keyboard hotkeys.
          </p>
        </div>

        {/* 4-Step Standard Transaction Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-[18px] bg-card border border-default shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="size-6 rounded-full bg-primary/10 text-primary font-heading font-semibold text-xs flex items-center justify-center">
                1
              </span>
              <kbd className="px-2 py-0.5 rounded bg-subtle text-[11px] font-mono font-medium border border-default">
                F2 or /
              </kbd>
            </div>
            <h3 className="font-heading font-semibold text-sm text-heading mt-1">
              Scan / Search
            </h3>
            <p className="font-sans text-xs text-body leading-relaxed">
              Focus the scanner input. Scan product tag barcode or type design code and press <kbd className="font-mono text-[10px]">Enter</kbd>.
            </p>
          </div>

          <div className="p-4 rounded-[18px] bg-card border border-default shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="size-6 rounded-full bg-primary/10 text-primary font-heading font-semibold text-xs flex items-center justify-center">
                2
              </span>
              <kbd className="px-2 py-0.5 rounded bg-subtle text-[11px] font-mono font-medium border border-default">
                + / - / Del
              </kbd>
            </div>
            <h3 className="font-heading font-semibold text-sm text-heading mt-1">
              Adjust Cart
            </h3>
            <p className="font-sans text-xs text-body leading-relaxed">
              Navigate items with <kbd className="font-mono text-[10px]">↑/↓</kbd>. Tap <kbd className="font-mono text-[10px]">+</kbd> or <kbd className="font-mono text-[10px]">-</kbd> to change quantity, or <kbd className="font-mono text-[10px]">Del</kbd> to remove.
            </p>
          </div>

          <div className="p-4 rounded-[18px] bg-card border border-default shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="size-6 rounded-full bg-primary/10 text-primary font-heading font-semibold text-xs flex items-center justify-center">
                3
              </span>
              <kbd className="px-2 py-0.5 rounded bg-subtle text-[11px] font-mono font-medium border border-default">
                F3 / F4
              </kbd>
            </div>
            <h3 className="font-heading font-semibold text-sm text-heading mt-1">
              Customer & Discount
            </h3>
            <p className="font-sans text-xs text-body leading-relaxed">
              Press <kbd className="font-mono text-[10px]">F3</kbd> to type customer phone. Press <kbd className="font-mono text-[10px]">F4</kbd> to apply rupee discount if authorized.
            </p>
          </div>

          <div className="p-4 rounded-[18px] bg-card border border-default shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="size-6 rounded-full bg-primary/10 text-primary font-heading font-semibold text-xs flex items-center justify-center">
                4
              </span>
              <kbd className="px-2 py-0.5 rounded bg-primary text-white text-[11px] font-mono font-medium">
                F9
              </kbd>
            </div>
            <h3 className="font-heading font-semibold text-sm text-heading mt-1">
              Charge & Print
            </h3>
            <p className="font-sans text-xs text-body leading-relaxed">
              Press <kbd className="font-mono text-[10px]">F9</kbd> to open checkout. Select tender (<kbd className="font-mono text-[10px]">1-5</kbd>) and tap <kbd className="font-mono text-[10px]">Enter</kbd> to finish.
            </p>
          </div>
        </div>

        {/* Master Shortcut Table */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg sm:text-xl text-heading">
              Complete Keyboard Hotkeys Reference
            </h2>
            <Badge variant="secondary" size="sm">
              {SHORTCUT_TABLE.length} Hotkeys
            </Badge>
          </div>

          <div className="w-full overflow-x-auto rounded-[20px] border border-default bg-card shadow-xs">
            <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-default/60 bg-subtle/30 text-heading font-heading">
                  <th className="py-3 px-4 font-semibold w-36">Hotkey</th>
                  <th className="py-3 px-4 font-semibold w-40">Action</th>
                  <th className="py-3 px-4 font-semibold w-36">Scope</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default/30">
                {SHORTCUT_TABLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-subtle/20 transition-colors">
                    <td className="py-3 px-4">
                      <kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-[6px] bg-subtle/80 border border-default font-mono text-xs font-semibold text-heading shadow-xs">
                        {row.key}
                      </kbd>
                    </td>
                    <td className="py-3 px-4 font-medium text-heading">
                      {row.action}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-subtle/70 text-[11px] text-body font-medium">
                        {row.context}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-body text-xs sm:text-[13px] leading-relaxed">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hardware & Barcode Scanner Integration Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-[20px] bg-card border border-default shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ScanBarcode className="size-5 text-accent shrink-0" />
              <h3 className="font-heading font-semibold text-base text-heading">
                Barcode Scanner Compatibility
              </h3>
            </div>
            <p className="font-sans text-xs text-body leading-relaxed">
              Any standard USB or Wireless (Bluetooth / 2.4G) handheld barcode reader configured as an <strong>HID Keyboard Device</strong> works plug-and-play without extra drivers.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-body pt-1 border-t border-default/40">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-status-success shrink-0" />
                <span>Default Carriage Return (CR/Enter) suffix auto-supported.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-status-success shrink-0" />
                <span>1D EAN-13, UPC-A, Code-128 and 2D QR tags recognized.</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-[20px] bg-card border border-default shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-accent shrink-0" />
              <h3 className="font-heading font-semibold text-base text-heading">
                Checkout Numpad Controls
              </h3>
            </div>
            <p className="font-sans text-xs text-body leading-relaxed">
              When in the payment modal (<kbd className="font-mono text-[10px]">F9</kbd>), you can select tender with single digits:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans text-body pt-1 border-t border-default/40">
              <div><strong className="text-heading">1</strong> &rarr; Cash Tender</div>
              <div><strong className="text-heading">2</strong> &rarr; Credit/Debit Card</div>
              <div><strong className="text-heading">3</strong> &rarr; Bank Transfer</div>
              <div><strong className="text-heading">4</strong> &rarr; JazzCash / EasyPaisa</div>
              <div><strong className="text-heading">5</strong> &rarr; Khata (Store Credit)</div>
              <div><strong className="text-heading">Enter</strong> &rarr; Finalize Receipt</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-muted border-t border-default/50">
          Retail POS &bull; Enterprise Boutique Edition &bull; Keyboard-First Terminal Reference
        </footer>
      </div>
    </div>
  );
}
