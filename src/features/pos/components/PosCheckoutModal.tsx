"use client";

import React, { useState, useMemo } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";
import {
  PosPaymentMethod,
  PosTender,
  PosCustomer,
} from "../types";
import { CreditCard, Banknote, Smartphone, Building, BookOpen, Trash2 } from "lucide-react";

export interface PosCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  grandTotal: number;
  customer: PosCustomer | null;
  onConfirmSale: (tenders: PosTender[]) => void;
}

const TENDER_METHODS: { id: PosPaymentMethod; label: string; icon: any }[] = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "bank_transfer", label: "Bank Transfer", icon: Building },
  { id: "jazzcash_easypaisa", label: "JaazCash / EasyPaisa", icon: Smartphone },
  { id: "khata", label: "Khata ( Credit)", icon: BookOpen },
];

/**
 * Take Payment & Checkout Tender Modal matching Figma node 3441:40030.
 * Supports Cash, Card, Bank Transfer, JazzCash/EasyPaisa, Khata credit, and multi-tender Split Payment.
 */
export function PosCheckoutModal({
  open,
  onClose,
  grandTotal,
  customer,
  onConfirmSale,
}: PosCheckoutModalProps) {
  const [activeMethod, setActiveMethod] = useState<PosPaymentMethod>("cash");
  const [tenders, setTenders] = useState<PosTender[]>([]);

  // Input states
  const [cashTenderedInput, setCashTenderedInput] = useState<string>("");
  const [otherAmountInput, setOtherAmountInput] = useState<string>("");
  const [referenceInput, setReferenceInput] = useState<string>("");

  // Sum of payments added so far
  const totalPaid = useMemo(
    () => tenders.reduce((acc, curr) => acc + curr.amount, 0),
    [tenders]
  );

  const remaining = Math.max(0, grandTotal - totalPaid);

  // Set default tender amount to remaining when dialog opens or active tab changes
  React.useEffect(() => {
    if (open) {
      setTenders([]);
      setCashTenderedInput(String(grandTotal));
      setOtherAmountInput(String(grandTotal));
      setReferenceInput("");
      setActiveMethod("cash");
    }
  }, [open, grandTotal]);

  // Quick cash denomination options
  const quickCashOptions = useMemo(() => {
    const opts = [grandTotal];
    if (grandTotal < 5000) opts.push(5000);
    if (grandTotal < 10000) opts.push(10000);
    if (grandTotal < 15000) opts.push(15000);
    return Array.from(new Set(opts)).sort((a, b) => a - b);
  }, [grandTotal]);

  // Handle adding a payment tender
  const handleAddTender = () => {
    if (activeMethod === "cash") {
      const tendered = parseFloat(cashTenderedInput) || remaining;
      const actualApplied = Math.min(tendered, remaining);
      const changeDue = Math.max(0, tendered - remaining);

      const newTender: PosTender = {
        id: `tender-${Date.now()}`,
        method: "cash",
        amount: actualApplied,
        cashTendered: tendered,
        changeDue,
      };

      setTenders((prev) => [...prev, newTender]);
      setCashTenderedInput(String(Math.max(0, remaining - actualApplied)));
    } else {
      const amt = parseFloat(otherAmountInput) || remaining;
      const actualApplied = Math.min(amt, remaining);

      const newTender: PosTender = {
        id: `tender-${Date.now()}`,
        method: activeMethod,
        amount: actualApplied,
        reference: referenceInput.trim() || undefined,
      };

      setTenders((prev) => [...prev, newTender]);
      setOtherAmountInput(String(Math.max(0, remaining - actualApplied)));
      setReferenceInput("");
    }
  };

  const handleRemoveTender = (tenderId: string) => {
    setTenders((prev) => prev.filter((t) => t.id !== tenderId));
  };

  const handleComplete = () => {
    if (tenders.length === 0) {
      // Auto-apply single cash tender of full amount if none added yet
      const defaultTender: PosTender = {
        id: `tender-${Date.now()}`,
        method: activeMethod,
        amount: grandTotal,
        cashTendered: parseFloat(cashTenderedInput) || grandTotal,
      };
      onConfirmSale([defaultTender]);
    } else {
      onConfirmSale(tenders);
    }
  };

  // Khata eligibility check
  const availableKhataLimit = customer
    ? Math.max(0, customer.khataLimit - customer.khataBalance)
    : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Take payment"
      subtitle="Split across methods if needed. Nothing is saved until you complete the sale."
      maxWidthClass="sm:max-w-[740px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 select-none py-1">
        {/* Left Column: Payment Method Tabs & Inputs (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* Method Selector Pills */}
          <div className="bg-card border border-default p-1 rounded-full flex items-center gap-1 overflow-x-auto no-scrollbar shadow-xs">
            {TENDER_METHODS.map((m) => {
              const isActive = activeMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setActiveMethod(m.id);
                    setOtherAmountInput(String(remaining));
                    setCashTenderedInput(String(remaining));
                  }}
                  className={`px-3 py-1.5 rounded-full font-sans text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-dark-primary font-medium shadow-xs"
                      : "text-body hover:text-heading hover:bg-subtle/50 font-normal"
                  }`}
                >
                  <m.icon className="size-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Method Input Panel */}
          <div className="p-4 rounded-[16px] bg-theme border border-default/60 flex flex-col gap-3.5">
            {activeMethod === "cash" && (
              <>
                <label className="font-sans text-xs font-medium text-heading">
                  Cash tendered
                </label>
                <div className="relative w-full">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans text-xs text-muted">
                    Rs .
                  </span>
                  <input
                    type="number"
                    value={cashTenderedInput}
                    onChange={(e) => setCashTenderedInput(e.target.value)}
                    placeholder={String(remaining)}
                    className="w-full pl-12 pr-4 py-2.5 rounded-[12px] border border-default bg-card font-heading font-semibold text-sm text-heading focus:border-focus focus:outline-none"
                  />
                </div>

                {/* Quick Cash Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {quickCashOptions.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashTenderedInput(String(amt))}
                      className="px-3 py-1.5 rounded-[10px] border border-default bg-card font-sans text-xs font-medium text-heading hover:bg-subtle/40 transition-colors cursor-pointer"
                    >
                      {formatPKR(amt)}
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeMethod === "card" && (
              <>
                <label className="font-sans text-xs font-medium text-heading">
                  Card payment amount
                </label>
                <input
                  type="number"
                  value={otherAmountInput}
                  onChange={(e) => setOtherAmountInput(e.target.value)}
                  placeholder={String(remaining)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-default bg-card font-heading font-semibold text-sm text-heading focus:border-focus focus:outline-none"
                />

                <label className="font-sans text-xs font-medium text-heading mt-1">
                  Card approval / terminal reference code (optional)
                </label>
                <input
                  type="text"
                  value={referenceInput}
                  onChange={(e) => setReferenceInput(e.target.value)}
                  placeholder="e.g. POS-9842 or last 4 digits"
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-default bg-card font-sans text-xs text-heading focus:border-focus focus:outline-none"
                />
              </>
            )}

            {(activeMethod === "bank_transfer" ||
              activeMethod === "jazzcash_easypaisa") && (
              <>
                <label className="font-sans text-xs font-medium text-heading">
                  Digital transfer amount
                </label>
                <input
                  type="number"
                  value={otherAmountInput}
                  onChange={(e) => setOtherAmountInput(e.target.value)}
                  placeholder={String(remaining)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-default bg-card font-heading font-semibold text-sm text-heading focus:border-focus focus:outline-none"
                />

                <label className="font-sans text-xs font-medium text-heading mt-1">
                  Transaction ID / Sender Phone
                </label>
                <input
                  type="text"
                  value={referenceInput}
                  onChange={(e) => setReferenceInput(e.target.value)}
                  placeholder="e.g. Raast ID / 0300-1234567"
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-default bg-card font-sans text-xs text-heading focus:border-focus focus:outline-none"
                />
              </>
            )}

            {activeMethod === "khata" && (
              <>
                {customer ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="text-body">Customer: {customer.name}</span>
                      <span className="text-accent font-medium">
                        Available credit: {formatPKR(availableKhataLimit)}
                      </span>
                    </div>

                    <label className="font-sans text-xs font-medium text-heading mt-1">
                      Amount to add to Khata ledger
                    </label>
                    <input
                      type="number"
                      max={availableKhataLimit}
                      value={otherAmountInput}
                      onChange={(e) => setOtherAmountInput(e.target.value)}
                      placeholder={String(Math.min(remaining, availableKhataLimit))}
                      className="w-full px-3.5 py-2.5 rounded-[12px] border border-default bg-card font-heading font-semibold text-sm text-heading focus:border-focus focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="p-3 text-center rounded-[10px] bg-status-warning-bg border border-status-warning text-xs font-sans text-status-warning">
                    Khata credit requires an attached customer. Please close this modal and attach a customer from the cart panel.
                  </div>
                )}
              </>
            )}

            {/* Add to Tender List Button */}
            {remaining > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTender}
                disabled={activeMethod === "khata" && !customer}
                className="w-full rounded-[10px] h-9 text-xs font-sans font-medium mt-1 border-default bg-card hover:bg-subtle/50"
              >
                Add payment to bill
              </Button>
            )}
          </div>

          {/* List of Applied Tenders */}
          {tenders.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="font-sans text-xs font-medium text-heading">
                Payments added:
              </span>
              <div className="divide-y divide-default/30 border border-default/40 rounded-[12px] bg-card overflow-hidden">
                {tenders.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 px-3 flex items-center justify-between text-xs font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <span className="capitalize font-medium text-heading">
                        {t.method.replace("_", " ")}
                      </span>
                      {t.reference && (
                        <span className="text-muted">({t.reference})</span>
                      )}
                      {t.cashTendered && t.cashTendered > t.amount && (
                        <span className="text-body text-[11px]">
                          (Given: {formatPKR(t.cashTendered)})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-heading font-semibold text-heading">
                        {formatPKR(t.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTender(t.id)}
                        className="text-status-error hover:opacity-80 cursor-pointer"
                        title="Remove payment"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Breakdown & Complete Action (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between gap-4">
          <div className="p-4 sm:p-5 rounded-[18px] bg-card border border-default flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between font-sans text-xs sm:text-sm text-body">
              <span>Payable</span>
              <span className="font-heading font-medium text-heading">
                {formatPKR(grandTotal)}
              </span>
            </div>

            <div className="flex items-center justify-between font-sans text-xs sm:text-sm text-body">
              <span>Paid</span>
              <span className="font-heading font-medium text-status-success">
                {formatPKR(totalPaid)}
              </span>
            </div>

            <div className="pt-2 border-t border-default/50 flex flex-col gap-1">
              <span className="font-sans text-xs text-body">Remaining</span>
              <span className="font-heading font-bold text-2xl text-heading">
                {formatPKR(remaining)}
              </span>
            </div>

            {tenders.some((t) => (t.changeDue || 0) > 0) && (
              <div className="p-2.5 rounded-[10px] bg-status-success-bg border border-status-success flex items-center justify-between text-xs font-sans">
                <span className="text-status-success font-medium">Change due:</span>
                <span className="font-heading font-semibold text-status-success text-sm">
                  {formatPKR(
                    tenders.reduce((acc, curr) => acc + (curr.changeDue || 0), 0)
                  )}
                </span>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleComplete}
            disabled={tenders.length > 0 && remaining > 0}
            className="w-full rounded-full h-12 text-sm font-sans font-medium shadow-xs"
          >
            Complete Sale
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
