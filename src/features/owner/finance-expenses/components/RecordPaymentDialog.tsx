"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { recordPaymentSchema, RecordPaymentFormValues } from "../schemas/finance-expenses.schemas";
import { ExpenseItem, BillItem } from "../types/finance-expenses.types";
import { formatPKR } from "@/lib/formatters";

interface RecordPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  targetItem: ExpenseItem | BillItem | null;
  onConfirmPayment: (
    item: ExpenseItem | BillItem,
    paidFrom: string,
    amount: number,
    referenceNo?: string
  ) => void;
}

export function RecordPaymentDialog({
  open,
  onClose,
  targetItem,
  onConfirmPayment,
}: RecordPaymentDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RecordPaymentFormValues>({
    resolver: zodResolver(recordPaymentSchema),
    mode: "onChange",
    defaultValues: {
      paidFrom: "Bank",
      amount: targetItem?.amount || 0,
      paymentDate: "11 Oct 2026",
      referenceNo: "",
    },
  });

  React.useEffect(() => {
    if (open && targetItem) {
      reset({
        paidFrom: "Bank",
        amount: targetItem.amount,
        paymentDate: "11 Oct 2026",
        referenceNo: "",
      });
    }
  }, [open, targetItem, reset]);

  if (!targetItem) return null;

  const titleText = "title" in targetItem ? targetItem.title : targetItem.vendor;
  const vendorText = targetItem.vendor;

  const onSubmit = (data: RecordPaymentFormValues) => {
    onConfirmPayment(targetItem, data.paidFrom, data.amount, data.referenceNo);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Record payment"
      subtitle={`Settle payable for ${vendorText}`}
      maxWidthClass="w-full sm:max-w-[520px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 select-none">
        {/* Summary Card */}
        <div className="bg-theme rounded-xl p-4 border border-default/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-heading font-medium text-xs sm:text-sm text-heading">
              {titleText}
            </span>
            <span className="font-sans text-[11px] text-body mt-0.5">
              Payee: {vendorText}
            </span>
          </div>

          <span className="font-heading font-semibold text-base sm:text-lg text-heading">
            {formatPKR(targetItem.amount)}
          </span>
        </div>

        {/* Paid from Account */}
        <Controller
          name="paidFrom"
          control={control}
          render={({ field }) => (
            <Select
              label="Paid from account *"
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: "Bank", label: "Bank Account" },
                { value: "Cash drawer", label: "POS Cash Drawer" },
                { value: "Petty cash", label: "Petty Cash Box" },
              ]}
              error={errors.paidFrom?.message}
            />
          )}
        />

        {/* Amount to Pay */}
        <Input
          label="Amount to pay (Rs.) *"
          type="number"
          min={1}
          max={targetItem.amount}
          error={errors.amount?.message}
          {...register("amount")}
        />

        {/* Payment Date & Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Payment date *"
            error={errors.paymentDate?.message}
            {...register("paymentDate")}
          />

          <Input
            label="Reference # (e.g. Tx ID)"
            placeholder="Online Tx or Cheque #"
            error={errors.referenceNo?.message}
            {...register("referenceNo")}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-default/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 px-5 rounded-full text-xs font-medium"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isSubmitting}
            className="h-10 px-6 rounded-full text-xs font-medium shadow-xs"
          >
            Confirm Payment
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
