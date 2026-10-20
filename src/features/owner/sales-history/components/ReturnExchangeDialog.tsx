"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatPKR } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  returnExchangeSchema,
  ReturnExchangeSchemaType,
} from "../schemas/sales-history.schemas";

export type SettlementMethod =
  | "cash"
  | "original_payment"
  | "reduce_khata"
  | "exchange";

export interface ReturnExchangeDialogProps {
  open: boolean;
  onClose: () => void;
  receiptNumber?: string;
  customerName?: string;
  unitPricePKR?: number;
  maxReturnableQty?: number;
  onConfirmReturn?: (data: ReturnExchangeSchemaType) => void;
  onComplete?: () => void;
}

/**
 * Return / Exchange Dialog Modal matching Figma design for `Return / exchange · NP-010419`.
 * Fully integrated with React Hook Form + Zod schema validation, real-time refund total calculation,
 * and Zero-Hex design system tokens.
 */
export function ReturnExchangeDialog({
  open,
  onClose,
  receiptNumber = "NP-010419",
  customerName = "Fatima Raza",
  unitPricePKR = 4650,
  maxReturnableQty = 1,
  onConfirmReturn,
  onComplete,
}: ReturnExchangeDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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
      condition: "Good / restockable",
      reason: "",
      settlementMethod: "cash",
      notes: "",
    },
  });

  const watchedQty = Number(watch("returnQty")) || 0;
  const watchedCondition = watch("condition") || "Good / restockable";
  const watchedSettlement = watch("settlementMethod") || "cash";
  const refundAmount = watchedQty * unitPricePKR;

  // Reset form state when dialog opens
  React.useEffect(() => {
    if (open) {
      reset({
        receiptNumber,
        customerName,
        returnQty: 1,
        condition: "Good / restockable",
        reason: "",
        settlementMethod: "cash",
        notes: "",
      });
      setIsCompleted(false);
      setIsSubmitting(false);
    }
  }, [open, receiptNumber, customerName, reset]);

  const handleQtyChange = (val: number) => {
    const clamped = Math.max(0, Math.min(maxReturnableQty, val));
    setValue("returnQty", clamped, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = (data: ReturnExchangeSchemaType) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      onConfirmReturn?.(data);
      setTimeout(() => {
        onComplete?.();
        onClose();
      }, 1000);
    }, 600);
  };

  const settlementOptions = [
    {
      id: "cash",
      label: "Cash refund",
      desc: "Immediate cash payout from drawer",
    },
    {
      id: "original_payment",
      label: `Original card / transfer (${formatPKR(unitPricePKR)})`,
      desc: "Reverse to original electronic tender",
    },
    {
      id: "reduce_khata",
      label: "Reduce Khata balance",
      desc: "Credit customer ledger balance",
    },
    {
      id: "exchange",
      label: "Exchange for other items",
      desc: "Credit against new cart items in POS",
    },
  ] as const;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Return / exchange · ${receiptNumber}`}
      subtitle="Sold 0 days ago · policy 7 days. Refunds are worked out from what the customer actually paid per item."
      maxWidthClass="sm:max-w-[680px]"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-[10px] px-5 text-xs h-9"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={watchedQty === 0 || !isValid || isSubmitting || isCompleted}
            isLoading={isSubmitting}
            className="rounded-[10px] px-6 text-xs h-9"
          >
            {isCompleted ? (
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5" /> Return Recorded
              </span>
            ) : (
              "Complete return"
            )}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 select-none">
        {/* 1. Returnable Items Table */}
        <div className="w-full rounded-[14px] border border-default/60 overflow-hidden bg-theme">
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[500px] border-collapse text-left">
              <thead>
                <tr className="bg-subtle/30 border-b border-default/40 font-sans text-xs font-medium text-heading">
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-3 py-3 text-right">Paid / pc</th>
                  <th className="px-3 py-3 text-center">Returnable</th>
                  <th className="px-3 py-3 text-center">Return</th>
                  <th className="px-4 py-3 text-left">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default/30">
                <tr className="bg-card">
                  {/* Item Details */}
                  <td className="px-4 py-3.5 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans font-medium text-sm text-heading">
                        Khaddar 2-Piece
                      </span>
                      <span className="font-sans text-xs text-body">
                        Olive · Standard
                      </span>
                    </div>
                  </td>

                  {/* Paid per piece */}
                  <td className="px-3 py-3.5 text-right align-middle">
                    <span className="font-sans text-sm text-heading font-medium whitespace-nowrap">
                      {formatPKR(unitPricePKR)}
                    </span>
                  </td>

                  {/* Returnable Max */}
                  <td className="px-3 py-3.5 text-center align-middle">
                    <span className="font-sans text-sm text-heading">
                      {maxReturnableQty}
                    </span>
                  </td>

                  {/* Return Quantity Input */}
                  <td className="px-3 py-3.5 text-center align-middle">
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        min={0}
                        max={maxReturnableQty}
                        value={watchedQty}
                        onChange={(e) =>
                          handleQtyChange(parseInt(e.target.value) || 0)
                        }
                        className="w-12 h-8 text-center rounded-[8px] border border-default bg-card font-sans font-medium text-sm text-heading focus:border-focus focus:outline-none"
                      />
                    </div>
                  </td>

                  {/* Condition Selector */}
                  <td className="px-4 py-3.5 align-middle">
                    <Select
                      options={[
                        { label: "Good / restockable", value: "Good / restockable" },
                        { label: "Minor defect", value: "Minor defect / discounted" },
                        { label: "Damaged / unsellable", value: "Damaged / unsellable" },
                      ]}
                      value={watchedCondition}
                      onChange={(val) =>
                        setValue("condition", val, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      sizeVariant="sm"
                      fullWidth
                      aria-label="Item condition"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {errors.returnQty && (
          <p className="text-status-error text-xs font-sans">
            {errors.returnQty.message}
          </p>
        )}

        {/* 2. Reason & Settle As 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Left Column: Reason */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="return-reason"
              className="font-sans text-xs font-medium text-heading"
            >
              Reason <span className="text-status-error">*</span>
            </label>
            <textarea
              id="return-reason"
              rows={4}
              {...register("reason")}
              placeholder="e.g. Customer changed mind, wrong fit, defect found..."
              className={cn(
                "w-full rounded-[10px] border p-3 font-sans text-xs text-heading placeholder:text-muted focus:border-focus focus:outline-none resize-none leading-relaxed bg-card",
                errors.reason ? "border-status-error" : "border-default"
              )}
            />
            {errors.reason && (
              <p className="text-status-error text-xs font-sans">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Right Column: Settle As Group */}
          <div className="flex flex-col gap-1.5">
            <span className="font-sans text-xs font-medium text-heading">
              Settle as
            </span>
            <div className="flex flex-col gap-2">
              {settlementOptions.map((opt) => {
                const isSelected = watchedSettlement === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setValue("settlementMethod", opt.id as any, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className={cn(
                      "w-full rounded-[10px] border px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 text-heading shadow-xs"
                        : "border-default bg-card text-heading hover:bg-subtle/20"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "size-4 rounded-full border flex items-center justify-center shrink-0",
                          isSelected
                            ? "border-primary bg-primary text-dark-primary"
                            : "border-default bg-card"
                        )}
                      >
                        {isSelected && (
                          <div className="size-1.5 rounded-full bg-dark-primary" />
                        )}
                      </div>
                      <span className="font-sans text-xs font-medium">
                        {opt.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.settlementMethod && (
              <p className="text-status-error text-xs font-sans">
                {errors.settlementMethod.message}
              </p>
            )}
          </div>
        </div>

        {/* 3. Summary Total Card */}
        <div className="bg-page rounded-[12px] p-4 border border-default/60 flex flex-col gap-2">
          <div className="flex items-center justify-between font-sans text-xs text-body">
            <span>Value of items returned</span>
            <span>{formatPKR(refundAmount)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-default/50 font-sans">
            <span className="text-sm font-medium text-heading">Refund</span>
            <span className="font-heading font-semibold text-base text-heading">
              {formatPKR(refundAmount)}
            </span>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
