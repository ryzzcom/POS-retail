"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatPKR } from "@/lib/formatters";
import {
  recordKhataPaymentSchema,
  RecordKhataPaymentFormValues,
} from "../schemas/khata.schemas";
import { KhataAccount } from "../types/khata.types";

interface RecordKhataPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  account: KhataAccount | null;
  accounts: KhataAccount[];
  onConfirmPayment: (values: RecordKhataPaymentFormValues) => void;
}

const PAYMENT_METHOD_OPTIONS = [
  { value: "cash", label: "Cash Drawer" },
  { value: "bank_transfer", label: "Bank Transfer (Meezan Bank)" },
  { value: "jazzcash", label: "JazzCash Business" },
  { value: "nayapay", label: "NayaPay / Raast" },
];

export function RecordKhataPaymentDialog({
  open,
  onClose,
  account,
  accounts,
  onConfirmPayment,
}: RecordKhataPaymentDialogProps) {
  const eligibleAccounts = accounts.filter((a) => a.balance > 0);
  const selectedAccountId = account?.id || eligibleAccounts[0]?.id || "";
  const currentAccount = accounts.find((a) => a.id === selectedAccountId);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RecordKhataPaymentFormValues>({
    resolver: zodResolver(recordKhataPaymentSchema),
    mode: "onChange",
    defaultValues: {
      accountId: selectedAccountId,
      amount: account?.balance || 0,
      paymentDate: "2026-10-11",
      paymentMethod: "cash",
      reference: "",
      notes: "",
    },
  });

  const watchedAccountId = watch("accountId");
  const targetAccount = accounts.find((a) => a.id === watchedAccountId);

  React.useEffect(() => {
    if (open) {
      reset({
        accountId: account?.id || eligibleAccounts[0]?.id || "",
        amount: account?.balance || eligibleAccounts[0]?.balance || 0,
        paymentDate: "2026-10-11",
        paymentMethod: "cash",
        reference: "",
        notes: "",
      });
    }
  }, [open, account]);

  const onSubmit = (values: RecordKhataPaymentFormValues) => {
    onConfirmPayment(values);
    onClose();
  };

  const accountSelectOptions = eligibleAccounts.map((a) => ({
    value: a.id,
    label: `${a.customerName} (${formatPKR(a.balance)} due)`,
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Record Khata Payment"
      subtitle={
        account
          ? `Record repayment received from ${account.customerName}`
          : "Record customer Khata repayment into cash or bank"
      }
      maxWidthClass="w-full sm:max-w-[540px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-5 sm:p-6">
        {/* Account Selector */}
        {!account ? (
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-medium text-heading">
              Select Customer Account <span className="text-status-error">*</span>
            </label>
            <Controller
              name="accountId"
              control={control}
              render={({ field }) => (
                <Select
                  options={accountSelectOptions}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    const acct = accounts.find((a) => a.id === val);
                    if (acct) {
                      setValue("amount", acct.balance, { shouldValidate: true });
                    }
                  }}
                  sizeVariant="md"
                  placeholder="Choose customer"
                />
              )}
            />
            {errors.accountId && (
              <span className="text-xs text-status-error">
                {errors.accountId.message}
              </span>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-subtle/50 border border-default flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-sans font-medium text-xs sm:text-sm text-heading">
                {account.customerName}
              </span>
              <span className="font-sans text-xs text-body">
                {account.customerPhone}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-sans text-[11px] text-body">Total Outstanding</span>
              <span className="font-heading font-semibold text-xs sm:text-sm text-heading">
                {formatPKR(account.balance)}
              </span>
            </div>
          </div>
        )}

        {/* Amount to Pay */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="font-sans text-xs font-medium text-heading">
              Payment Amount (PKR) <span className="text-status-error">*</span>
            </label>
            {targetAccount && (
              <button
                type="button"
                onClick={() =>
                  setValue("amount", targetAccount.balance, {
                    shouldValidate: true,
                  })
                }
                className="text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                Full balance ({formatPKR(targetAccount.balance)})
              </button>
            )}
          </div>
          <Input
            type="number"
            placeholder="0"
            {...register("amount", { valueAsNumber: true })}
            error={errors.amount?.message}
          />
        </div>

        {/* Payment Method & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-medium text-heading">
              Deposit Destination <span className="text-status-error">*</span>
            </label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select
                  options={PAYMENT_METHOD_OPTIONS}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  sizeVariant="md"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-medium text-heading">
              Payment Date <span className="text-status-error">*</span>
            </label>
            <Input type="date" {...register("paymentDate")} />
          </div>
        </div>

        {/* Reference Number */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-medium text-heading">
            Receipt / Reference Voucher <span className="text-muted font-normal">(optional)</span>
          </label>
          <Input
            placeholder="e.g. CR-00945 or Bank Ref ID"
            {...register("reference")}
          />
        </div>

        {/* Action Buttons */}
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
            Confirm & Record Payment
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
