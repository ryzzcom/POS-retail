"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatPKR } from "@/lib/formatters";
import { cashDrawerSchema, CashDrawerSchemaType } from "../schemas";
import { CASH_IN_REASONS, CASH_OUT_REASONS } from "../constants";
import { CashDrawerAdjustmentType } from "../types";

export interface CashDrawerModalProps {
  open: boolean;
  onClose: () => void;
  currentExpectedCashPKR: number;
  onRecordAdjustment: (data: CashDrawerSchemaType) => void;
}

export function CashDrawerModal({
  open,
  onClose,
  currentExpectedCashPKR,
  onRecordAdjustment,
}: CashDrawerModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<CashDrawerSchemaType>({
    resolver: zodResolver(cashDrawerSchema),
    mode: "onChange",
    defaultValues: {
      type: "cash_in",
      amount: undefined,
      reason: CASH_IN_REASONS[0],
      notes: "",
    },
  });

  const selectedType = watch("type") as CashDrawerAdjustmentType;
  const watchedAmount = watch("amount") || 0;

  // Sync reason options when type changes
  useEffect(() => {
    if (selectedType === "cash_in") {
      setValue("reason", CASH_IN_REASONS[0], { shouldValidate: true });
    } else {
      setValue("reason", CASH_OUT_REASONS[0], { shouldValidate: true });
    }
  }, [selectedType, setValue]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset({
        type: "cash_in",
        amount: undefined,
        reason: CASH_IN_REASONS[0],
        notes: "",
      });
    }
  }, [open, reset]);

  const reasonsList = selectedType === "cash_in" ? CASH_IN_REASONS : CASH_OUT_REASONS;
  const reasonOptions = reasonsList.map((r) => ({ label: r, value: r }));

  const projectedCash =
    selectedType === "cash_in"
      ? currentExpectedCashPKR + Number(watchedAmount)
      : Math.max(0, currentExpectedCashPKR - Number(watchedAmount));

  const onSubmit = (data: CashDrawerSchemaType) => {
    onRecordAdjustment(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Cash In / Cash Out"
      subtitle="Record float replenishments, bank drops, or petty expenses"
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
            form="cash-drawer-form"
            variant="primary"
            disabled={!isValid || watchedAmount <= 0}
            className="rounded-full px-6"
          >
            Record {selectedType === "cash_in" ? "Cash In" : "Cash Out"}
          </Button>
        </div>
      }
    >
      <form
        id="cash-drawer-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 select-none"
      >
        {/* Adjustment Type Switcher */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-medium text-body">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 bg-subtle/50 p-1 rounded-[14px] border border-default/40">
            <button
              type="button"
              onClick={() => setValue("type", "cash_in", { shouldValidate: true })}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-[10px] font-sans font-medium text-sm transition-all ${
                selectedType === "cash_in"
                  ? "bg-card text-heading shadow-xs border border-default/40"
                  : "text-body hover:text-heading"
              }`}
            >
              <ArrowDownLeft className="size-4 text-status-success" />
              <span>Cash In</span>
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "cash_out", { shouldValidate: true })}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-[10px] font-sans font-medium text-sm transition-all ${
                selectedType === "cash_out"
                  ? "bg-card text-heading shadow-xs border border-default/40"
                  : "text-body hover:text-heading"
              }`}
            >
              <ArrowUpRight className="size-4 text-status-error" />
              <span>Cash Out</span>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <Input
            label="Amount (PKR)"
            type="number"
            min="1"
            placeholder="e.g. 2,500"
            {...register("amount", { valueAsNumber: true })}
            error={errors.amount?.message}
          />
        </div>

        {/* Reason Dropdown */}
        <div>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Select
                label="Reason"
                options={reasonOptions}
                value={field.value}
                onChange={field.onChange}
                fullWidth
                error={errors.reason?.message}
              />
            )}
          />
        </div>

        {/* Optional Notes */}
        <div>
          <Input
            label="Notes / Reference (Optional)"
            placeholder="e.g. Petty cash from branch manager"
            {...register("notes")}
            error={errors.notes?.message}
          />
        </div>

        {/* Projected Drawer Summary Card */}
        <div className="rounded-[14px] bg-theme border border-default/50 p-3.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-xs text-body">Current Drawer Cash</span>
            <span className="font-heading font-semibold text-sm text-heading">
              {formatPKR(currentExpectedCashPKR)}
            </span>
          </div>
          <div className="text-right flex flex-col">
            <span className="font-sans text-xs text-body">Projected After {selectedType === "cash_in" ? "In" : "Out"}</span>
            <span className="font-heading font-semibold text-sm text-heading">
              {formatPKR(projectedCash)}
            </span>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
