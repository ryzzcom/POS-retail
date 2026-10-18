"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { couponSchema, CouponFormValues } from "../schemas/loyalty-referrals.schemas";
import { CouponItem } from "../types/loyalty-referrals.types";
import { COUPON_CATEGORIES } from "../constants/loyalty-mock";
import { cn } from "@/lib/utils";

interface CouponDialogProps {
  open: boolean;
  onClose: () => void;
  couponToEdit?: CouponItem | null;
  onSaveCoupon: (coupon: CouponItem) => void;
}

export function CouponDialog({
  open,
  onClose,
  couponToEdit,
  onSaveCoupon,
}: CouponDialogProps) {
  const isEditing = Boolean(couponToEdit);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
      type: "percentage",
      title: "",
      description: "",
      discountPercent: 10,
      discountAmount: 500,
      maxDiscount: 1000,
      minBill: 1000,
      usesPerCustomer: 1,
      totalUses: 1000,
      starts: new Date().toISOString().split("T")[0],
      ends: "2026-12-31",
      eligibleCategories: [],
      firstPurchaseOnly: false,
      isActive: true,
    },
  });

  const watchedType = watch("type");
  const selectedCategories = watch("eligibleCategories") || [];
  const firstPurchaseOnly = watch("firstPurchaseOnly");
  const isActive = watch("isActive");

  // Reset or populate form when dialog opens
  React.useEffect(() => {
    if (open) {
      if (couponToEdit) {
        reset({
          code: couponToEdit.code,
          type: couponToEdit.type,
          title: couponToEdit.title,
          description: couponToEdit.description,
          discountPercent: couponToEdit.discountPercent || 10,
          discountAmount: couponToEdit.discountAmount || 500,
          maxDiscount: couponToEdit.maxDiscount,
          minBill: couponToEdit.minBill,
          usesPerCustomer: couponToEdit.usesPerCustomer,
          totalUses: couponToEdit.totalUses,
          starts: couponToEdit.starts,
          ends: couponToEdit.ends,
          eligibleCategories: couponToEdit.eligibleCategories || [],
          firstPurchaseOnly: couponToEdit.firstPurchaseOnly,
          isActive: couponToEdit.isActive,
        });
      } else {
        reset({
          code: "",
          type: "percentage",
          title: "",
          description: "",
          discountPercent: 10,
          discountAmount: 500,
          maxDiscount: 1000,
          minBill: 1000,
          usesPerCustomer: 1,
          totalUses: 1000,
          starts: "2026-10-01",
          ends: "2026-12-31",
          eligibleCategories: [],
          firstPurchaseOnly: false,
          isActive: true,
        });
      }
    }
  }, [open, couponToEdit, reset]);

  const toggleCategory = (category: string) => {
    const current = selectedCategories || [];
    const exists = current.includes(category);
    const updated = exists
      ? current.filter((c) => c !== category)
      : [...current, category];
    setValue("eligibleCategories", updated, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = (data: CouponFormValues) => {
    const savedItem: CouponItem = {
      id: couponToEdit ? couponToEdit.id : `coup-${Date.now()}`,
      code: data.code.toUpperCase(),
      type: data.type,
      title: data.title || `${data.code} Promotional Offer`,
      description: data.description,
      discountPercent: data.type === "percentage" ? data.discountPercent : undefined,
      discountAmount: data.type === "fixed" ? data.discountAmount : undefined,
      maxDiscount: data.maxDiscount,
      minBill: data.minBill,
      usesPerCustomer: data.usesPerCustomer,
      totalUses: data.totalUses,
      starts: data.starts,
      ends: data.ends,
      status: data.isActive ? "live" : "expired",
      usedCount: couponToEdit ? couponToEdit.usedCount : 0,
      discountGiven: couponToEdit ? couponToEdit.discountGiven : 0,
      eligibleCategories: data.eligibleCategories,
      firstPurchaseOnly: data.firstPurchaseOnly,
      isActive: data.isActive,
    };

    onSaveCoupon(savedItem);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit coupon" : "New coupon"}
      subtitle="The POS recalculates the discount on the server — the counter can't change the amount."
      maxWidthClass="w-full sm:max-w-[700px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 select-none">
        {/* Row 1: Code and Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Code *"
            placeholder="e.g. WINTER10"
            error={errors.code?.message}
            {...register("code")}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Type *"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "percentage", label: "Percentage off" },
                  { value: "fixed", label: "Fixed amount off" },
                ]}
              />
            )}
          />
        </div>

        {/* Row 2: Offer Title & Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Offer title *"
            placeholder="e.g. 10% off Winter 26 launch"
            error={errors.title?.message}
            {...register("title")}
          />

          <Input
            label="Description *"
            placeholder="e.g. Min Rs. 4,000 · cap Rs. 1,500"
            error={errors.description?.message}
            {...register("description")}
          />
        </div>

        {/* Row 3: Discount amount/% & Max discount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {watchedType === "percentage" ? (
            <Input
              label="Discount % *"
              type="number"
              min={1}
              max={100}
              placeholder="e.g. 10"
              error={errors.discountPercent?.message}
              {...register("discountPercent")}
            />
          ) : (
            <Input
              label="Discount amount (Rs.) *"
              type="number"
              min={1}
              placeholder="e.g. 500"
              error={errors.discountAmount?.message}
              {...register("discountAmount")}
            />
          )}

          <Input
            label="Max discount (Rs.) *"
            type="number"
            min={0}
            helperText="0 = no cap"
            error={errors.maxDiscount?.message}
            {...register("maxDiscount")}
          />
        </div>

        {/* Row 4: Minimum bill & Uses per customer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Minimum bill (Rs.) *"
            type="number"
            min={0}
            placeholder="e.g. 1000"
            error={errors.minBill?.message}
            {...register("minBill")}
          />

          <Input
            label="Uses per customer *"
            type="number"
            min={0}
            helperText="0 = unlimited"
            error={errors.usesPerCustomer?.message}
            {...register("usesPerCustomer")}
          />
        </div>

        {/* Row 5: Total uses */}
        <div className="w-full">
          <Input
            label="Total uses *"
            type="number"
            min={0}
            helperText="0 = unlimited"
            error={errors.totalUses?.message}
            {...register("totalUses")}
          />
        </div>

        {/* Row 6: Starts & Ends Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Starts *"
            placeholder="e.g. 1 Oct 2026"
            error={errors.starts?.message}
            {...register("starts")}
          />

          <Input
            label="Ends *"
            placeholder="e.g. 31 Dec 2026"
            helperText="0 = unlimited"
            error={errors.ends?.message}
            {...register("ends")}
          />
        </div>

        {/* Row 7: Eligible Categories Pill Chips */}
        <div className="flex flex-col gap-2">
          <label className="font-sans font-medium text-xs sm:text-sm text-heading">
            Eligible categories (none selected = whole bill)
          </label>
          <div className="flex flex-wrap gap-2">
            {COUPON_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer border",
                    isSelected
                      ? "bg-primary text-dark-primary border-primary shadow-xs"
                      : "bg-subtle/50 text-body border-default hover:border-body/40"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 8: Toggle Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-default/40">
          <Switch
            id="first-purchase-switch"
            checked={Boolean(firstPurchaseOnly)}
            onCheckedChange={(checked) => setValue("firstPurchaseOnly", checked, { shouldDirty: true })}
            label="First purchase only"
          />

          <Switch
            id="active-status-switch"
            checked={Boolean(isActive)}
            onCheckedChange={(checked) => setValue("isActive", checked, { shouldDirty: true })}
            label="Active"
          />
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
            {isEditing ? "Update Coupon" : "Save Coupon"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
