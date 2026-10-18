"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import {
  adjustStockSchema,
  AdjustStockFormValues,
} from "../schemas/products-inventory.schemas";
import { ProductItem, ProductVariant } from "../types/products-inventory.types";

interface AdjustStockDialogProps {
  open: boolean;
  onClose: () => void;
  product: ProductItem | null;
  variant: ProductVariant | null;
  onConfirm?: (values: AdjustStockFormValues) => void;
}

export function AdjustStockDialog({
  open,
  onClose,
  product,
  variant,
  onConfirm,
}: AdjustStockDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdjustStockFormValues>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      productId: product?.id || "",
      variantId: variant?.id || "",
      adjustmentType: "add",
      quantity: 1,
      reason: "discrepancy",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (open && product && variant) {
      reset({
        productId: product.id,
        variantId: variant.id,
        adjustmentType: "add",
        quantity: 1,
        reason: "discrepancy",
        notes: "",
      });
    }
  }, [open, product, variant, reset]);

  const onSubmit = (values: AdjustStockFormValues) => {
    onConfirm?.(values);
    onClose();
  };

  if (!product || !variant) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Adjust Variant Stock"
      subtitle={`${product.name} — ${variant.color} • ${variant.size} (Current: ${variant.onHand} units)`}
      maxWidthClass="sm:max-w-[480px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 select-none">
        <input type="hidden" {...register("productId")} />
        <input type="hidden" {...register("variantId")} />

        <div className="flex flex-col gap-1.5">
          <label className="font-heading font-medium text-xs sm:text-sm text-heading">
            Adjustment Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "+ Add", value: "add" },
              { label: "- Subtract", value: "subtract" },
              { label: "= Set exact", value: "set" },
            ].map((t) => (
              <label
                key={t.value}
                className="flex items-center justify-center p-2 rounded-xl border border-default bg-card font-sans text-xs text-heading cursor-pointer hover:border-primary transition-colors has-[:checked]:bg-primary has-[:checked]:text-dark-primary has-[:checked]:border-primary"
              >
                <input
                  type="radio"
                  value={t.value}
                  {...register("adjustmentType")}
                  className="sr-only"
                />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-heading font-medium text-xs sm:text-sm text-heading">
            Quantity
          </label>
          <input
            type="number"
            {...register("quantity")}
            min="1"
            className="w-full h-11 px-4 rounded-xl bg-card border border-default font-sans text-xs sm:text-sm text-heading focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          {errors.quantity && (
            <span className="text-xs text-status-error">{errors.quantity.message}</span>
          )}
        </div>

        <Select
          label="Reason"
          options={[
            { label: "Recount / Discrepancy", value: "discrepancy" },
            { label: "Damaged Goods", value: "damaged" },
            { label: "Inventory Shrinkage", value: "shrinkage" },
            { label: "Display / Sample", value: "sample" },
            { label: "Returned to Vendor", value: "return_to_vendor" },
            { label: "Other Adjustment", value: "other" },
          ]}
          value={watch("reason")}
          onChange={(val) =>
            setValue("reason", val as AdjustStockFormValues["reason"], {
              shouldValidate: true,
            })
          }
          fullWidth
          sizeVariant="md"
          error={errors.reason?.message}
        />

        <div className="flex flex-col gap-1.5">
          <label className="font-heading font-medium text-xs sm:text-sm text-heading">
            Notes / Reference
          </label>
          <input
            type="text"
            {...register("notes")}
            placeholder="e.g. Audit note or damage slip no."
            className="w-full h-11 px-4 rounded-xl bg-card border border-default font-sans text-xs sm:text-sm text-heading focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-default/50">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-full border border-default bg-card font-sans font-medium text-xs sm:text-sm text-heading hover:bg-subtle/30 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-10 px-6 rounded-full bg-primary font-sans font-medium text-xs sm:text-sm text-dark-primary hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            Save Adjustment
          </button>
        </div>
      </form>
    </Dialog>
  );
}
