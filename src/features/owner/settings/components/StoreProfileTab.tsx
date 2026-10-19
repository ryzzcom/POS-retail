"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeProfileSchema, StoreProfileSchemaType } from "../schemas";
import { INITIAL_STORE_PROFILE } from "../constants";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Store,
  MapPin,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";

const CITY_OPTIONS = [
  { label: "Lahore", value: "Lahore" },
  { label: "Karachi", value: "Karachi" },
  { label: "Islamabad", value: "Islamabad" },
  { label: "Rawalpindi", value: "Rawalpindi" },
  { label: "Faisalabad", value: "Faisalabad" },
  { label: "Multan", value: "Multan" },
  { label: "Peshawar", value: "Peshawar" },
  { label: "Sialkot", value: "Sialkot" },
  { label: "Gujranwala", value: "Gujranwala" },
];

const GST_RATE_OPTIONS = [
  { label: "18% — Standard Retail GST", value: "18%" },
  { label: "15% — Reduced Tier Sales Tax", value: "15%" },
  { label: "5% — Unstitched Fabrics Concession", value: "5%" },
  { label: "0% — Tax Exempted", value: "0%" },
];

export function StoreProfileTab() {
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
    reset,
  } = useForm<StoreProfileSchemaType>({
    resolver: zodResolver(storeProfileSchema),
    defaultValues: INITIAL_STORE_PROFILE,
    mode: "onChange",
  });

  const onSubmit = async (data: StoreProfileSchemaType) => {
    // Simulated clean save
    await new Promise((resolve) => setTimeout(resolve, 600));
    reset(data);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-[16px] bg-status-success-bg border border-status-success/30 text-status-success">
          <CheckCircle2 className="size-5 shrink-0" />
          <p className="font-sans text-xs sm:text-sm font-medium">
            Store profile and localization preferences updated successfully.
          </p>
        </div>
      )}

      {/* Card 1: Store Identity & Branding */}
      <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-default/40">
          <div className="size-10 rounded-[12px] bg-subtle/80 flex items-center justify-center text-primary shrink-0">
            <Store className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
              Store Identity & Branding
            </h3>
            <p className="text-xs text-body font-sans mt-0.5">
              General boutique information, contact channels, and outlet identifiers.
            </p>
          </div>
        </div>

        {/* Logo and Avatar Preview */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 p-4 rounded-[14px] bg-theme border border-default/50">
          <div className="size-16 rounded-full bg-primary text-dark-primary flex items-center justify-center font-heading text-xl font-bold shadow-xs select-none">
            NP
          </div>
          <div className="space-y-1">
            <p className="font-heading font-medium text-heading text-sm sm:text-base">
              Boutique Emblem / Brand Logo
            </p>
            <p className="text-xs text-body font-sans">
              Recommended: 400x400 PNG or SVG. Used on invoices and client receipts.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5 border-default/70"
              >
                <Upload className="size-3 text-body" />
                <span>Upload Logo</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <Input
            label="Store / Brand Name"
            placeholder="e.g. Noor Pret & Boutique"
            error={errors.storeName?.message}
            {...register("storeName")}
          />

          <Input
            label="Outlet / Branch Code"
            placeholder="e.g. LHR-GLB-01"
            error={errors.branchCode?.message}
            {...register("branchCode")}
          />

          <Input
            label="Store Category"
            placeholder="e.g. Women's Luxury Pret & Formals"
            error={errors.storeCategory?.message}
            {...register("storeCategory")}
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <Input
              label="Brand Tagline"
              placeholder="e.g. Curated Pakistani Pret, Unstitched Silks & Luxury Formals"
              error={errors.tagline?.message}
              {...register("tagline")}
            />
          </div>

          <Input
            label="Primary Phone Number"
            placeholder="03XX-XXXXXXX"
            leftIcon={<Phone className="size-4" />}
            error={errors.primaryPhone?.message}
            {...register("primaryPhone")}
          />

          <Input
            label="WhatsApp Support Number"
            placeholder="+92 3XX XXXXXXX"
            leftIcon={<Phone className="size-4" />}
            error={errors.whatsappNumber?.message}
            {...register("whatsappNumber")}
          />

          <Input
            label="Official Contact Email"
            type="email"
            placeholder="info@yourboutique.pk"
            leftIcon={<Mail className="size-4" />}
            error={errors.officialEmail?.message}
            {...register("officialEmail")}
          />
        </div>
      </div>

      {/* Card 2: Address & Localization */}
      <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-default/40">
          <div className="size-10 rounded-[12px] bg-subtle/80 flex items-center justify-center text-primary shrink-0">
            <MapPin className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
              Address & Localization
            </h3>
            <p className="text-xs text-body font-sans mt-0.5">
              Physical retail store premises, currency, and operating hours.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="sm:col-span-2">
            <Input
              label="Street Address / Building"
              placeholder="e.g. Shop #14-16, Ground Floor, Mall 94"
              error={errors.streetAddress?.message}
              {...register("streetAddress")}
            />
          </div>

          <Input
            label="Area / Market"
            placeholder="e.g. MM Alam Road, Gulberg III"
            error={errors.areaMarket?.message}
            {...register("areaMarket")}
          />

          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select
                label="City"
                options={CITY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.city?.message}
              />
            )}
          />

          <Input
            label="Base Currency"
            disabled
            value="PKR — Pakistani Rupee (Rs.)"
            helperText="Default currency for this tenant instance"
          />

          <Input
            label="Operating Hours"
            placeholder="e.g. 11:00 AM – 10:30 PM (Mon – Sun)"
            leftIcon={<Clock className="size-4" />}
            error={errors.operatingHours?.message}
            {...register("operatingHours")}
          />
        </div>
      </div>

      {/* Card 3: Tax & FBR POS Integration */}
      <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-default/40 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-[12px] bg-subtle/80 flex items-center justify-center text-primary shrink-0">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-heading text-base sm:text-lg flex items-center gap-2">
                <span>Taxation & FBR POS Integration</span>
                <span className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-medium flex items-center gap-1">
                  <ShieldCheck className="size-3" /> Certified
                </span>
              </h3>
              <p className="text-xs text-body font-sans mt-0.5">
                National Tax Number, provincial sales tax, and automated fiscal invoices.
              </p>
            </div>
          </div>

          <Controller
            name="fbrIntegrationEnabled"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                label="FBR Real-Time Invoicing"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <Input
            label="NTN Number (7 digits + check digit)"
            placeholder="e.g. 7384910-4"
            error={errors.ntnNumber?.message}
            {...register("ntnNumber")}
          />

          <Input
            label="STRN / Sales Tax Registration"
            placeholder="e.g. 32-77-8761-002-19"
            error={errors.strnNumber?.message}
            {...register("strnNumber")}
          />

          <Input
            label="FBR POS Registration ID"
            placeholder="e.g. POS-LHR-88412"
            error={errors.posRegistrationId?.message}
            {...register("posRegistrationId")}
          />

          <Controller
            name="defaultGstRate"
            control={control}
            render={({ field }) => (
              <Select
                label="Default GST Tax Rate"
                options={GST_RATE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.defaultGstRate?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Sticky / Fixed Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-3">
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={() => reset(INITIAL_STORE_PROFILE)}
          disabled={!isDirty || isSubmitting}
        >
          Discard changes
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="default"
          isLoading={isSubmitting}
          disabled={!isDirty || !isValid || isSubmitting}
        >
          Save changes
        </Button>
      </div>
    </form>
  );
}
