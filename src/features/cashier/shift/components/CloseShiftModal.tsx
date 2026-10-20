"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPKR } from "@/lib/formatters";
import { closeShiftSchema, CloseShiftSchemaType } from "../schemas";
import { ShiftSummary } from "../types";

export interface CloseShiftModalProps {
  open: boolean;
  onClose: () => void;
  shift: ShiftSummary;
  onConfirmCloseShift: (data: CloseShiftSchemaType) => void;
}

export function CloseShiftModal({
  open,
  onClose,
  shift,
  onConfirmCloseShift,
}: CloseShiftModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CloseShiftSchemaType>({
    resolver: zodResolver(closeShiftSchema),
    mode: "onChange",
    defaultValues: {
      actualCash: undefined,
      notes: "",
    },
  });

  const watchedActualCash = watch("actualCash");
  const actualCounted = Number(watchedActualCash) || 0;
  const isCashEntered = watchedActualCash !== undefined && !isNaN(Number(watchedActualCash));

  const discrepancy = actualCounted - shift.expectedCashInDrawerPKR;

  useEffect(() => {
    if (open) {
      reset({
        actualCash: undefined,
        notes: "",
      });
    }
  }, [open, reset]);

  const onSubmit = (data: CloseShiftSchemaType) => {
    onConfirmCloseShift(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Close Shift & End Day"
      subtitle="Verify drawer cash count and record shift reconciliation"
      maxWidthClass="w-full sm:max-w-[540px]"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full px-5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="close-shift-form"
            variant="primary"
            disabled={!isValid || !isCashEntered}
            className="rounded-full px-6 flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <span>Confirm & Close Shift</span>
          </Button>
        </div>
      }
    >
      <form
        id="close-shift-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 select-none"
      >
        {/* Shift Financial Reconciliation Breakdown */}
        <div className="rounded-[16px] bg-theme border border-default/50 p-4 flex flex-col gap-2.5">
          <h4 className="font-heading font-semibold text-xs tracking-wider uppercase text-heading mb-1">
            Cash Drawer Reconciliation
          </h4>

          <div className="flex items-center justify-between text-xs font-sans text-body">
            <span>Starting Float</span>
            <span className="font-medium text-heading">
              {formatPKR(shift.startingFloatPKR)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-sans text-body">
            <span>Net Cash Sales ({shift.receiptsCount} receipts)</span>
            <span className="font-medium text-heading">
              +{formatPKR(shift.cashCollectedPKR)}
            </span>
          </div>

          {(shift.cashInTotalPKR > 0 || shift.cashOutTotalPKR > 0) && (
            <div className="flex items-center justify-between text-xs font-sans text-body">
              <span>Cash Adjustments (In / Out)</span>
              <span className="font-medium text-heading">
                {shift.cashInTotalPKR >= shift.cashOutTotalPKR ? "+" : "-"}
                {formatPKR(Math.abs(shift.cashInTotalPKR - shift.cashOutTotalPKR))}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-default/50 flex items-center justify-between font-heading font-semibold text-sm text-heading">
            <span>Expected Cash in Drawer</span>
            <span className="text-base text-primary">
              {formatPKR(shift.expectedCashInDrawerPKR)}
            </span>
          </div>
        </div>

        {/* Counted Cash Input */}
        <div>
          <Input
            label="Actual Cash Counted (PKR)"
            type="number"
            min="0"
            placeholder="Count and enter physical cash in drawer"
            {...register("actualCash", { valueAsNumber: true })}
            error={errors.actualCash?.message}
          />
        </div>

        {/* Live Discrepancy Indicator */}
        {isCashEntered && (
          <div
            className={`rounded-[14px] p-3.5 flex items-center gap-3 border transition-colors ${
              discrepancy === 0
                ? "bg-status-success-bg border-status-success/30 text-status-success"
                : discrepancy < 0
                ? "bg-status-error-bg border-status-error/30 text-status-error"
                : "bg-status-warning-bg border-status-warning/30 text-status-warning"
            }`}
          >
            {discrepancy === 0 ? (
              <CheckCircle2 className="size-5 shrink-0" />
            ) : discrepancy < 0 ? (
              <AlertCircle className="size-5 shrink-0" />
            ) : (
              <AlertTriangle className="size-5 shrink-0" />
            )}

            <div className="flex flex-col">
              <span className="font-sans font-semibold text-xs sm:text-sm">
                {discrepancy === 0
                  ? "Drawer Balanced"
                  : discrepancy < 0
                  ? `Cash Shortage: -${formatPKR(Math.abs(discrepancy))}`
                  : `Cash Surplus: +${formatPKR(discrepancy)}`}
              </span>
              <span className="font-sans text-xs opacity-90">
                {discrepancy === 0
                  ? "Physical cash exactly matches calculated receipts."
                  : discrepancy < 0
                  ? "Drawer has less physical cash than expected. Please verify bills."
                  : "Drawer has extra cash beyond recorded sales."}
              </span>
            </div>
          </div>
        )}

        {/* Closing Notes */}
        <div>
          <Input
            label="Closing Notes / Handover Remarks (Optional)"
            placeholder="e.g. Handed over key to evening shift cashier"
            {...register("notes")}
            error={errors.notes?.message}
          />
        </div>
      </form>
    </Dialog>
  );
}
