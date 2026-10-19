"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  supplierSchema,
  SupplierFormValues,
} from "../schemas/purchases-suppliers.schemas";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AddSupplierDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitSupplier: (values: SupplierFormValues) => void;
}

const CATEGORY_OPTIONS = [
  { label: "Fabric Mill & Textiles", value: "Fabric Mill" },
  { label: "Embroidery & Embellishments", value: "Embroidery" },
  { label: "Stitching & Master Tailor", value: "Stitching" },
  { label: "Packaging & Hangtags", value: "Packaging" },
  { label: "Accessories & Laces", value: "Accessories" },
];

const PAYMENT_TERMS_OPTIONS = [
  { label: "Immediate / Cash on Delivery (COD)", value: "Immediate / COD" },
  { label: "15 Days Credit", value: "15-day terms" },
  { label: "30 Days Net", value: "30-day terms" },
  { label: "45 Days Net", value: "45-day terms" },
  { label: "60 Days Net", value: "60-day terms" },
];

export function AddSupplierDialog({
  open,
  onClose,
  onSubmitSupplier,
}: AddSupplierDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      ntn: "",
      city: "Lahore",
      address: "",
      category: "Fabric Mill",
      paymentTerms: "30-day terms",
      openingBalance: 0,
    },
  });

  const onFormSubmit = (data: SupplierFormValues) => {
    onSubmitSupplier(data);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add New Supplier & Vendor"
      subtitle="Register textile mills, dye houses, embroidery masters, and packaging suppliers."
      maxWidthClass="w-full sm:max-w-2xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5 pt-2 select-none">
        {/* Row 1: Supplier Name & Contact Person */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Supplier / Business Name *"
              placeholder="e.g. Al-Karam Textiles (Wholesale)"
              error={errors.name?.message}
              {...register("name")}
            />
          </div>
          <div>
            <Input
              label="Contact Person Name *"
              placeholder="e.g. Rizwan Sheikh"
              error={errors.contactPerson?.message}
              {...register("contactPerson")}
            />
          </div>
        </div>

        {/* Row 2: Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Phone Number *"
              placeholder="e.g. 0300-8123456"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
          <div>
            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="e.g. supplier@domain.pk"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
        </div>

        {/* Row 3: Category & Payment Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs sm:text-sm font-medium text-heading">
              Supplier Category *
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

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs sm:text-sm font-medium text-heading">
              Credit & Payment Terms *
            </label>
            <Controller
              name="paymentTerms"
              control={control}
              render={({ field }) => (
                <Select
                  options={PAYMENT_TERMS_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  fullWidth
                />
              )}
            />
          </div>
        </div>

        {/* Row 4: City, NTN & Opening Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Input
              label="City *"
              placeholder="e.g. Lahore / Faisalabad"
              error={errors.city?.message}
              {...register("city")}
            />
          </div>
          <div>
            <Input
              label="NTN / STRN (Optional)"
              placeholder="e.g. 4192019-2"
              error={errors.ntn?.message}
              {...register("ntn")}
            />
          </div>
          <div>
            <Input
              label="Opening Balance (PKR)"
              type="number"
              placeholder="0"
              error={errors.openingBalance?.message}
              {...register("openingBalance", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Row 5: Address */}
        <div>
          <Input
            label="Street Address / Market Location"
            placeholder="e.g. Shop 14, Cloth Market, Bunder Road"
            error={errors.address?.message}
            {...register("address")}
          />
        </div>

        {/* Action Buttons */}
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
            disabled={isSubmitting || !isValid}
            className="px-7 rounded-full"
          >
            Create Supplier
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
