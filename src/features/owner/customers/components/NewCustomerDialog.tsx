"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  customerSchema,
  CustomerFormValues,
} from "../schemas/customers.schemas";
import { CustomerItem } from "../types/customers.types";

interface NewCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSaveCustomer: (customer: CustomerItem) => void;
}

export function NewCustomerDialog({
  open,
  onClose,
  onSaveCustomer,
}: NewCustomerDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      tier: "Regular",
      tag: "",
      openingKhataBalance: 0,
      creditLimit: 50000,
      city: "Lahore",
      address: "",
      notes: "",
      acceptsMarketing: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: "",
        phone: "",
        email: "",
        tier: "Regular",
        tag: "",
        openingKhataBalance: 0,
        creditLimit: 50000,
        city: "Lahore",
        address: "",
        notes: "",
        acceptsMarketing: true,
      });
    }
  }, [open, reset]);

  const onSubmit = (data: CustomerFormValues) => {
    const newCustomer: CustomerItem = {
      id: `cust-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      tag: data.tag || undefined,
      tier: data.tier,
      lifetimeSpend: 0,
      points: data.tier === "Gold" ? 200 : data.tier === "Silver" ? 100 : 0,
      khataBalance: data.openingKhataBalance,
      lastVisit: "Today",
      messaging: data.acceptsMarketing ? "All messages" : "Opted out",
      acceptsMarketing: data.acceptsMarketing,
      totalOrders: 0,
      city: data.city,
      address: data.address,
      notes: data.notes,
      createdAt: "Today",
    };

    onSaveCustomer(newCustomer);
    onClose();
  };

  const selectedTier = watch("tier");
  const acceptsMarketing = watch("acceptsMarketing");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="New Customer"
      subtitle="Register customer profile for POS lookup, loyalty rewards, and Khata credit."
      maxWidthClass="w-full sm:max-w-[580px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 select-none">
        {/* Name & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Full Name *"
            placeholder="e.g. Fatima Raza"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Phone Number *"
            placeholder="0300-1234567"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        {/* Email & Tag Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Style Tag / Preference"
            placeholder="e.g. Formal wear, Bridal"
            error={errors.tag?.message}
            {...register("tag")}
          />
        </div>

        {/* Tier & Credit Limit Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Select
            label="Loyalty Tier *"
            options={[
              { label: "Regular", value: "Regular" },
              { label: "Silver", value: "Silver" },
              { label: "Gold", value: "Gold" },
              { label: "VIP", value: "VIP" },
            ]}
            value={selectedTier}
            onChange={(val) =>
              setValue("tier", val as CustomerFormValues["tier"], {
                shouldValidate: true,
              })
            }
            fullWidth
            sizeVariant="md"
          />

          <Input
            label="Credit Limit (PKR)"
            type="number"
            min={0}
            placeholder="50000"
            error={errors.creditLimit?.message}
            {...register("creditLimit")}
          />
        </div>

        {/* Opening Khata Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Opening Khata Balance (PKR)"
            type="number"
            min={0}
            placeholder="0"
            error={errors.openingKhataBalance?.message}
            {...register("openingKhataBalance")}
          />

          <Input
            label="City"
            placeholder="e.g. Lahore, Karachi"
            error={errors.city?.message}
            {...register("city")}
          />
        </div>

        {/* Address */}
        <Input
          label="Street Address"
          placeholder="e.g. House 42, Block Y, DHA Phase 3"
          error={errors.address?.message}
          {...register("address")}
        />

        {/* Customer Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans font-medium text-xs sm:text-sm text-heading">
            Style & Fitting Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Prefers pure raw silk, custom size M alterations"
            className="w-full px-4 py-2.5 rounded-xl bg-card border border-default font-sans text-xs sm:text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none leading-relaxed"
            {...register("notes")}
          />
        </div>

        {/* Marketing Consent Checkbox */}
        <div className="pt-1">
          <Checkbox
            id="marketing-consent-checkbox"
            checked={acceptsMarketing}
            onChange={(e) =>
              setValue("acceptsMarketing", e.target.checked, {
                shouldValidate: true,
              })
            }
            label="Accepts promotional WhatsApp broadcasts and seasonal sale SMS"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-default/50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full px-5 text-xs sm:text-sm h-10"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
            className="rounded-full px-6 text-xs sm:text-sm h-10"
          >
            Save Customer
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
