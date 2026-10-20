"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatPKR } from "@/lib/formatters";
import { returnExchangeSchema, ReturnExchangeSchemaType } from "../schemas";
import { ITEM_CONDITIONS, SETTLEMENT_METHODS } from "../constants";

export interface CashierReturnDialogProps {
  open: boolean;
  onClose: () => void;
  receiptNumber: string;
  customerName?: string;
  unitPricePKR?: number;
  maxReturnableQty?: number;
  onConfirmReturn: (data: ReturnExchangeSchemaType) => void;
}

export function CashierReturnDialog({
  open,
  onClose,
  receiptNumber,
  customerName = "Customer",
  unitPricePKR = 4650,
  maxReturnableQty = 1,
  onConfirmReturn,
}: CashierReturnDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ReturnExchangeSchemaType>({
    resolver: zodResolver(returnExchangeSchema),
    mode: "onChange",
    defaultValues: {
      receiptNumber,
      customerName,
      returnQty: 1,
      condition: ITEM_CONDITIONS[0].value,
      reason: "",
      settlementMethod: "cash",
      notes: "",
    },
  });

  const watchedQty = Number(watch("returnQty")) || 0;
  const calculatedRefund = watchedQty * unitPricePKR;

  useEffect(() => {
    if (open) {
      reset({
        receiptNumber,
        customerName,
        returnQty: 1,
        condition: ITEM_CONDITIONS[0].value,
        reason: "",
        settlementMethod: "cash",
        notes: "",
      });
    }
  }, [open, receiptNumber, customerName, reset]);

  const onSubmit = (data: ReturnExchangeSchemaType) => {
    onConfirmReturn(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Return / exchange · ${receiptNumber}`}
      subtitle={`Customer: ${customerName} · Max returnable: ${maxReturnableQty} ${
        maxReturnableQty === 1 ? "unit" : "units"
      }`}
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
            form="cashier-return-form"
            variant="danger"
            disabled={!isValid || watchedQty <= 0 || watchedQty > maxReturnableQty}
            className="rounded-full px-6 flex items-center gap-2"
          >
            <RotateCcw className="size-4 shrink-0" />
            <span>Process Return</span>
          </Button>
        </div>
      }
    >
      <form
        id="cashier-return-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 select-none"
      >
        {/* Quantity to Return */}
        <div>
          <Input
            label={`Return Quantity (Max: ${maxReturnableQty})`}
            type="number"
            min="1"
            max={maxReturnableQty}
            placeholder="1"
            {...register("returnQty", { valueAsNumber: true })}
            error={errors.returnQty?.message}
          />
        </div>

        {/* Condition Dropdown */}
        <div>
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Select
                label="Item Condition"
                options={ITEM_CONDITIONS}
                value={field.value}
                onChange={field.onChange}
                fullWidth
                error={errors.condition?.message}
              />
            )}
          />
        </div>

        {/* Return Reason */}
        <div>
          <Input
            label="Return Reason"
            placeholder="e.g. Size fitting issue, fabric defect, changed mind"
            {...register("reason")}
            error={errors.reason?.message}
          />
        </div>

        {/* Settlement Method */}
        <div>
          <Controller
            name="settlementMethod"
            control={control}
            render={({ field }) => (
              <Select
                label="Settlement Method"
                options={SETTLEMENT_METHODS}
                value={field.value}
                onChange={field.onChange}
                fullWidth
                error={errors.settlementMethod?.message}
              />
            )}
          />
        </div>

        {/* Optional Notes */}
        <div>
          <Input
            label="Remarks / Supervisor Approval Note (Optional)"
            placeholder="e.g. Approved by Store Owner on call"
            {...register("notes")}
            error={errors.notes?.message}
          />
        </div>

        {/* Dynamic Refund Calculation Strip */}
        <div className="rounded-[14px] bg-theme border border-default/50 p-3.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-xs text-body">Unit Price</span>
            <span className="font-heading font-semibold text-sm text-heading">
              {formatPKR(unitPricePKR)}
            </span>
          </div>
          <div className="text-right flex flex-col">
            <span className="font-sans text-xs text-body">Total Refund / Credit</span>
            <span className="font-heading font-semibold text-base text-status-error">
              {formatPKR(calculatedRefund)}
            </span>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
