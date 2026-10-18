"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { expenseSchema, ExpenseFormValues } from "../schemas/finance-expenses.schemas";
import { ExpenseItem, PaymentStatus } from "../types/finance-expenses.types";
import { EXPENSE_CATEGORIES, PAYMENT_SOURCES } from "../constants/finance-mock";
import { cn } from "@/lib/utils";

interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSaveExpense: (expense: ExpenseItem) => void;
}

export function AddExpenseDialog({
  open,
  onClose,
  onSaveExpense,
}: AddExpenseDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      category: "Shop rent",
      amount: 1000,
      expenseDate: new Date().toISOString().split("T")[0],
      vendor: "",
      paymentStatus: "paid",
      paidFrom: "Cash drawer",
      referenceNo: "",
      repeatsMonthly: false,
      notes: "",
    },
  });

  const paymentStatus = watch("paymentStatus");
  const repeatsMonthly = watch("repeatsMonthly");

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      reset({
        title: "",
        category: "Shop rent",
        amount: 1000,
        expenseDate: "11 Oct 2026",
        vendor: "",
        paymentStatus: "paid",
        paidFrom: "Cash drawer",
        referenceNo: "",
        repeatsMonthly: false,
        notes: "",
      });
    }
  }, [open, reset]);

  // If status changed to unpaid, automatically suggest 'Not paid' for paidFrom
  React.useEffect(() => {
    if (paymentStatus === "unpaid") {
      setValue("paidFrom", "Not paid", { shouldValidate: true });
    } else if (watch("paidFrom") === "Not paid") {
      setValue("paidFrom", "Cash drawer", { shouldValidate: true });
    }
  }, [paymentStatus, setValue, watch]);

  const onSubmit = (data: ExpenseFormValues) => {
    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: data.title,
      category: data.category,
      vendor: data.vendor,
      date: data.expenseDate,
      paidFrom: data.paidFrom,
      status: data.paymentStatus,
      amount: data.amount,
      paidAmount: data.paymentStatus === "paid" ? data.amount : 0,
      referenceNo: data.referenceNo,
      repeatsMonthly: data.repeatsMonthly,
      notes: data.notes,
    };

    onSaveExpense(newExpense);
    onClose();
  };

  const categoryOptions = EXPENSE_CATEGORIES.map((c) => ({
    value: c,
    label: c,
  }));

  const sourceOptions = PAYMENT_SOURCES.map((s) => ({
    value: s,
    label: s,
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add expense"
      subtitle="Rent, bills, salaries, petty cash or anything else the store spends."
      maxWidthClass="w-full sm:max-w-[720px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 select-none">
        {/* Row 1: Title */}
        <div className="w-full">
          <Input
            label="Title *"
            placeholder="e.g. LESCO bill — October usage"
            error={errors.title?.message}
            {...register("title")}
          />
        </div>

        {/* Row 2: Category & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                label="Category *"
                value={field.value}
                onChange={field.onChange}
                options={categoryOptions}
                error={errors.category?.message}
              />
            )}
          />

          <Input
            label="Amount (Rs.) *"
            type="number"
            min={1}
            placeholder="e.g. 5000"
            error={errors.amount?.message}
            {...register("amount")}
          />
        </div>

        {/* Row 3: Expense Date & Vendor / Payee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Expense date *"
            placeholder="e.g. 11 Oct 2026"
            error={errors.expenseDate?.message}
            {...register("expenseDate")}
          />

          <Input
            label="Vendor / payee *"
            placeholder="e.g. Shah Packages or LESCO"
            error={errors.vendor?.message}
            {...register("vendor")}
          />
        </div>

        {/* Row 4: Payment Status Pill Switcher */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans font-medium text-xs sm:text-sm text-heading">
            Payment status *
          </label>
          <div className="inline-flex items-center p-1 rounded-xl bg-subtle/50 border border-default/50 self-start">
            {(["paid", "partial", "unpaid"] as const).map((st) => {
              const isActive = paymentStatus === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setValue("paymentStatus", st, { shouldValidate: true })}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-sans capitalize transition-all cursor-pointer",
                    isActive
                      ? "bg-primary text-dark-primary font-medium shadow-xs"
                      : "text-body hover:text-heading"
                  )}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 5: Paid from & Reference / Consumer No. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="paidFrom"
            control={control}
            render={({ field }) => (
              <Select
                label="Paid from *"
                value={field.value}
                onChange={field.onChange}
                options={sourceOptions}
                error={errors.paidFrom?.message}
              />
            )}
          />

          <Input
            label="Reference / consumer no."
            placeholder="e.g. LESCO-091823 or Cheque #104"
            error={errors.referenceNo?.message}
            {...register("referenceNo")}
          />
        </div>

        {/* Row 6: Repeats Monthly Toggle */}
        <div className="pt-1">
          <Switch
            id="repeats-monthly-switch"
            checked={Boolean(repeatsMonthly)}
            onCheckedChange={(checked) => setValue("repeatsMonthly", checked, { shouldDirty: true })}
            label="Repeats monthly"
            description="Create this as a recurring monthly operational commitment"
          />
        </div>

        {/* Footnote matching Figma Node 3454:47903 */}
        <div className="pt-2">
          <p className="font-sans text-xs text-muted leading-relaxed">
            Receipt attachments upload to secure storage once the API is connected.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-default/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 px-6 rounded-full text-xs font-medium"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isSubmitting}
            className="h-10 px-7 rounded-full text-xs font-medium shadow-xs"
          >
            Save Expense
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
