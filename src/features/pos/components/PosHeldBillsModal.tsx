"use client";

import React, { useState } from "react";
import { Clock, Play, Trash2, BookmarkCheck } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";
import { PosHeldBill } from "../types";

export interface PosHeldBillsModalProps {
  open: boolean;
  onClose: () => void;
  heldBills: PosHeldBill[];
  onRecallBill: (heldBillId: string) => void;
  onHoldCurrentCart: (note?: string) => void;
  canHoldCurrent: boolean;
}

/**
 * Held Bills / Park Sale Modal Dialog for POS Terminal.
 */
export function PosHeldBillsModal({
  open,
  onClose,
  heldBills,
  onRecallBill,
  onHoldCurrentCart,
  canHoldCurrent,
}: PosHeldBillsModalProps) {
  const [holdNote, setHoldNote] = useState("");

  const handleHold = () => {
    onHoldCurrentCart(holdNote.trim() || undefined);
    setHoldNote("");
    onClose();
  };

  const handleRecall = (id: string) => {
    onRecallBill(id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Park & Recall Bills"
      subtitle="Hold the current customer bill to attend to another queue, or recall a previously parked bill."
      maxWidthClass="sm:max-w-[560px]"
    >
      <div className="flex flex-col gap-5 select-none py-1">
        {/* 1. Hold Current Active Cart Action */}
        {canHoldCurrent && (
          <div className="p-4 rounded-[16px] bg-subtle/30 border border-default/50 flex flex-col gap-3">
            <span className="font-heading font-medium text-xs sm:text-sm text-heading">
              Park active customer bill
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={holdNote}
                onChange={(e) => setHoldNote(e.target.value)}
                placeholder="Optional customer reference or note..."
                className="flex-1 px-3 py-2 rounded-[10px] border border-default bg-card font-sans text-xs text-heading focus:border-focus focus:outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleHold}
                className="rounded-[10px] text-xs h-9 px-4 shrink-0"
              >
                Park Bill
              </Button>
            </div>
          </div>
        )}

        {/* 2. List of Parked Bills */}
        <div className="flex flex-col gap-2">
          <span className="font-sans font-medium text-xs text-heading">
            Currently held bills ({heldBills.length})
          </span>

          {heldBills.length > 0 ? (
            <div className="divide-y divide-default/30 max-h-64 overflow-y-auto custom-scrollbar border border-default/50 rounded-[14px] bg-card">
              {heldBills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-subtle/20 transition-colors"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-medium text-xs sm:text-sm text-heading truncate">
                        {bill.customer ? bill.customer.name : "Walk-in Customer"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-subtle/60 text-[10px] font-sans text-body">
                        {bill.items.length} {bill.items.length === 1 ? "item" : "items"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-sans text-xs text-body">
                      <Clock className="size-3 text-muted shrink-0" />
                      <span>{bill.heldAt}</span>
                      {bill.note && <span>· Note: {bill.note}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-heading font-semibold text-xs sm:text-sm text-heading">
                      {formatPKR(bill.total)}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecall(bill.id)}
                      className="rounded-full h-8 px-3 text-xs gap-1 border-default hover:bg-subtle/40"
                    >
                      <Play className="size-3" />
                      <span>Recall</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-[14px] border border-dashed border-default/60 bg-subtle/10 flex flex-col items-center justify-center gap-1.5">
              <BookmarkCheck className="size-6 text-muted" />
              <p className="font-sans text-xs text-body">No parked bills right now</p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
