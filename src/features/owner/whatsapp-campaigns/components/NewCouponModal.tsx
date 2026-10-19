"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newCouponSchema,
  NewCouponFormValues,
} from "../schemas/whatsapp-campaigns.schemas";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface NewCouponModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitCoupon: (values: NewCouponFormValues) => void;
}

const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percentage (%) Off", value: "percentage" },
  { label: "Fixed Amount (PKR) Off", value: "fixed" },
];

const CATEGORY_OPTIONS = [
  { label: "All Collections", value: "All Collections" },
  { label: "Unstitched Lawn", value: "Unstitched Lawn" },
  { label: "Pret & Luxury Wear", value: "Pret & Luxury Wear" },
  { label: "Formal & Chiffon", value: "Formal & Chiffon" },
  { label: "Bridal Couture", value: "Bridal Couture" },
  { label: "Shawls & Dupattas", value: "Shawls & Dupattas" },
];

export function NewCouponModal({
  open,
  onClose,
  onSubmitCoupon,
}: NewCouponModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewCouponFormValues>({
    resolver: zodResolver(newCouponSchema),
    defaultValues: {
      couponName: "",
      couponCode: "",
      description: "",
      discountType: "percentage",
      discountValue: 15,
      minPurchase: 0,
      usageLimitPerCustomer: 1,
      category: "All Collections",
      startsDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  });

  const selectedDiscountType = watch("discountType");

  const onFormSubmit = (data: NewCouponFormValues) => {
    onSubmitCoupon(data);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create New POS Coupon Code"
      subtitle="Configure discount rules, spend limits, validity and optional campaign linking"
      maxWidthClass="w-full sm:max-w-3xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5 pt-2 select-none">
        {/* Row 1: Coupon Name & Coupon Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Coupon Name *"
              placeholder="e.g. Mid-Season Clearance 15%"
              error={errors.couponName?.message}
              {...register("couponName")}
            />
          </div>
          <div>
            <Input
              label="Coupon Code *"
              placeholder="e.g. SILK15"
              error={errors.couponCode?.message}
              {...register("couponCode")}
            />
          </div>
        </div>

        {/* Row 2: Description (Optional) */}
        <div>
          <Input
            label="Description (Optional)"
            placeholder="e.g. Valid on all unstitched luxury lawn collections above Rs. 10,000..."
            error={errors.description?.message}
            {...register("description")}
          />
        </div>

        {/* Row 3: Discount Type & Discount Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs sm:text-sm font-medium text-heading">
              Discount Type *
            </label>
            <Controller
              name="discountType"
              control={control}
              render={({ field }) => (
                <Select
                  options={DISCOUNT_TYPE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  fullWidth
                />
              )}
            />
          </div>
          <div>
            <Input
              label={
                selectedDiscountType === "percentage"
                  ? "Discount Value (%) *"
                  : "Discount Value (PKR) *"
              }
              type="number"
              placeholder={selectedDiscountType === "percentage" ? "15" : "1500"}
              error={errors.discountValue?.message}
              rightIcon={
                <span className="text-muted font-sans text-xs pr-2 font-medium">
                  {selectedDiscountType === "percentage" ? "%" : "PKR"}
                </span>
              }
              {...register("discountValue", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Row 4: Minimum Purchase Amount & Max Discount Cap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Minimum Purchase Amount (PKR)"
              type="number"
              placeholder="0 (No Minimum)"
              error={errors.minPurchase?.message}
              {...register("minPurchase", { valueAsNumber: true })}
            />
          </div>
          <div>
            <Input
              label="Max Discount Cap (PKR)"
              type="number"
              placeholder="e.g. 5000 (Optional)"
              error={errors.maxDiscountCap?.message}
              {...register("maxDiscountCap", {
                setValueAs: (v) => (v === "" || isNaN(v) ? undefined : Number(v)),
              })}
            />
          </div>
        </div>

        {/* Row 5: Total Limit (Storewide) & Usage Limit Per Customer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Total Limit (Storewide)"
              type="number"
              placeholder="e.g. 100 (Leave blank for unlimited)"
              error={errors.totalLimit?.message}
              {...register("totalLimit", {
                setValueAs: (v) => (v === "" || isNaN(v) ? undefined : Number(v)),
              })}
            />
          </div>
          <div>
            <Input
              label="Usage Limit Per Customer"
              type="number"
              placeholder="1"
              error={errors.usageLimitPerCustomer?.message}
              {...register("usageLimitPerCustomer", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Row 6: Category */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs sm:text-sm font-medium text-heading">
            Applicable Category / Collection
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                options={CATEGORY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                fullWidth
              />
            )}
          />
        </div>

        {/* Row 7: Starts Date & End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Starts Date"
              type="date"
              error={errors.startsDate?.message}
              {...register("startsDate")}
            />
          </div>
          <div>
            <Input
              label="End Date"
              type="date"
              error={errors.endDate?.message}
              {...register("endDate")}
            />
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-default/30">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onClose}
            className="px-6 rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={isSubmitting}
            className="px-7 rounded-full"
          >
            Create Coupon
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
