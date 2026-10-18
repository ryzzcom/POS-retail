"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPKR } from "@/lib/formatters";
import {
  adjustCreditLimitSchema,
  AdjustCreditLimitFormValues,
} from "../schemas/khata.schemas";
import { KhataAccount } from "../types/khata.types";

interface AdjustCreditLimitDialogProps {
  open: boolean;
  onClose: () => void;
  account: KhataAccount | null;
  onConfirmAdjust: (accountId: string, newLimit: number) => void;
}

export function AdjustCreditLimitDialog({
  open,
  onClose,
  account,
  onConfirmAdjust,
}: AdjustCreditLimitDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AdjustCreditLimitFormValues>({
    resolver: zodResolver(adjustCreditLimitSchema),
    mode: "onChange",
    defaultValues: {
      accountId: account?.id || "",
      creditLimit: account?.creditLimit || 0,
      reason: "",
    },
  });

  React.useEffect(() => {
    if (open && account) {
      reset({
        accountId: account.id,
        creditLimit: account.creditLimit,
        reason: "",
      });
    }
  }, [open, account]);

  if (!account) return null;

  const onSubmit = (values: AdjustCreditLimitFormValues) => {
    onConfirmAdjust(values.accountId, values.creditLimit);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Adjust Khata Credit Limit"
      subtitle={`Modify maximum allowed credit limit for ${account.customerName}`}
      maxWidthClass="w-full sm:max-w-[460px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="p-3.5 rounded-xl bg-subtle/50 border border-default flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans font-medium text-xs sm:text-sm text-heading">
              Current Balance
            </span>
            <span className="font-heading font-semibold text-xs sm:text-sm text-heading mt-0.5">
              {formatPKR(account.balance)}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-sans font-medium text-xs sm:text-sm text-heading">
              Current Limit
            </span>
            <span className="font-heading font-semibold text-xs sm:text-sm text-primary mt-0.5">
              {formatPKR(account.creditLimit)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-medium text-heading">
            New Credit Limit (PKR) <span className="text-status-error">*</span>
          </label>
          <Input
            type="number"
            placeholder="0"
            {...register("creditLimit", { valueAsNumber: true })}
            error={errors.creditLimit?.message}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-medium text-heading">
            Reason / Adjustment Note <span className="text-muted font-normal">(optional)</span>
          </label>
          <Input
            placeholder="e.g. VIP boutique customer increase"
            {...register("reason")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-default/50 mt-2">
          <Button type="button" variant="white" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
          >
            Save Limit
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
