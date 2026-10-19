"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { receiptPrinterSchema, ReceiptPrinterSchemaType } from "../schemas";
import { INITIAL_RECEIPT_PRINTER_SETTINGS } from "../constants";
import { PaperSize } from "../types";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SegmentedFilter, SegmentedFilterOption } from "@/components/ui/segmented-filter";
import { formatPKR } from "@/lib/formatters";
import {
  Printer,
  Sliders,
  CheckCircle2,
  QrCode,
  Sparkles,
  Receipt,
  FileCheck,
} from "lucide-react";

const PAPER_SIZE_OPTIONS: SegmentedFilterOption[] = [
  { label: "80mm Thermal (Standard)", value: "80mm" },
  { label: "58mm Compact POS", value: "58mm" },
  { label: "A4 Formal Invoice", value: "a4" },
];

export function ReceiptPrinterTab() {
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [testPrintSuccess, setTestPrintSuccess] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<ReceiptPrinterSchemaType>({
    resolver: zodResolver(receiptPrinterSchema),
    defaultValues: INITIAL_RECEIPT_PRINTER_SETTINGS,
    mode: "onChange",
  });

  const formValues = watch();

  const onSubmit = async (data: ReceiptPrinterSchemaType) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    reset(data);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleTestPrint = () => {
    setTestPrintSuccess(true);
    setTimeout(() => setTestPrintSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Notifications */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-[16px] bg-status-success-bg border border-status-success/30 text-status-success">
          <CheckCircle2 className="size-5 shrink-0" />
          <p className="font-sans text-xs sm:text-sm font-medium">
            Thermal receipt customization and hardware rules saved successfully.
          </p>
        </div>
      )}

      {testPrintSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-[16px] bg-theme border border-primary/30 text-heading">
          <Printer className="size-5 text-primary shrink-0" />
          <p className="font-sans text-xs sm:text-sm font-medium">
            Test print job dispatched to local thermal spooler (ESC/POS 80mm).
          </p>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Configuration Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hardware & Printer Options Card */}
          <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-default/40 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-[12px] bg-subtle/80 flex items-center justify-center text-primary shrink-0">
                  <Printer className="size-5" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
                    Thermal Printer & Hardware
                  </h3>
                  <p className="text-xs text-body font-sans mt-0.5">
                    Paper width, automated drawer kicks, and ESC/POS spooling.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestPrint}
                className="text-xs border-default/70 hover:bg-subtle/50 gap-1.5"
              >
                <Printer className="size-3.5 text-body" />
                <span>Test Print</span>
              </Button>
            </div>

            {/* Paper Size Filter */}
            <div className="space-y-2">
              <label className="text-xs font-sans font-medium text-heading">
                Printer Paper Format
              </label>
              <Controller
                name="paperSize"
                control={control}
                render={({ field }) => (
                  <SegmentedFilter
                    sizeVariant="sm"
                    options={PAPER_SIZE_OPTIONS}
                    value={field.value}
                    onChange={(val) => field.onChange(val as PaperSize)}
                  />
                )}
              />
            </div>

            {/* Hardware Toggles */}
            <div className="space-y-4 pt-1">
              <div className="p-3.5 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
                <div>
                  <p className="font-heading font-medium text-heading text-sm">
                    Auto-print receipt on sale completion
                  </p>
                  <p className="text-xs text-body font-sans mt-0.5">
                    Immediately send receipt print job when cashier tenders sale.
                  </p>
                </div>
                <Controller
                  name="autoPrintReceipt"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="p-3.5 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
                <div>
                  <p className="font-heading font-medium text-heading text-sm">
                    Open cash drawer on cash transactions
                  </p>
                  <p className="text-xs text-body font-sans mt-0.5">
                    Trigger RJ11 pulse to kick open cash drawer on tender.
                  </p>
                </div>
                <Controller
                  name="openDrawerOnCash"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="p-3.5 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
                <div>
                  <p className="font-heading font-medium text-heading text-sm">
                    Print duplicate merchant audit copy
                  </p>
                  <p className="text-xs text-body font-sans mt-0.5">
                    Produces a signed merchant copy for card or credit sales.
                  </p>
                </div>
                <Controller
                  name="printMerchantCopy"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="p-3.5 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
                <div>
                  <p className="font-heading font-medium text-heading text-sm">
                    Print QR / Barcode at receipt bottom
                  </p>
                  <p className="text-xs text-body font-sans mt-0.5">
                    Enables fast 1-second receipt barcode scanning for returns.
                  </p>
                </div>
                <Controller
                  name="printBarcodeOnBottom"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Receipt Customization Card */}
          <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="pb-3 border-b border-default/40">
              <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
                Header & Receipt Content
              </h3>
              <p className="text-xs text-body font-sans mt-0.5">
                Branding lines, cashier credits, loyalty balances, and return policies.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Header Business Name"
                placeholder="e.g. NOOR PRET & BOUTIQUE"
                error={errors.headerBusinessName?.message}
                {...register("headerBusinessName")}
              />

              <Input
                label="Branch Address Line"
                placeholder="e.g. Shop #14-16, Mall 94, MM Alam Road, Gulberg III, Lahore"
                error={errors.branchAddressLine?.message}
                {...register("branchAddressLine")}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone / WhatsApp"
                  placeholder="+92 300 8472910"
                  error={errors.phoneOnReceipt?.message}
                  {...register("phoneOnReceipt")}
                />

                <Input
                  label="Social / Website Handle"
                  placeholder="Instagram: @noorpret.pk"
                  error={errors.instagramWebsiteHandle?.message}
                  {...register("instagramWebsiteHandle")}
                />
              </div>

              {/* Toggles Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-[12px] bg-theme border border-default/50 flex flex-col justify-between gap-2">
                  <span className="text-xs font-medium text-heading">Show Cashier</span>
                  <Controller
                    name="showCashierName"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        size="sm"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="p-3 rounded-[12px] bg-theme border border-default/50 flex flex-col justify-between gap-2">
                  <span className="text-xs font-medium text-heading">Loyalty Points</span>
                  <Controller
                    name="showCustomerLoyaltyPoints"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        size="sm"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="p-3 rounded-[12px] bg-theme border border-default/50 flex flex-col justify-between gap-2">
                  <span className="text-xs font-medium text-heading">Khata Balance</span>
                  <Controller
                    name="showKhataRemainingBalance"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        size="sm"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Exchange Policy Textarea */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-sans font-medium text-heading">
                  Exchange / Return Policy Footer Notice
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-[14px] bg-theme border border-default/70 p-3 font-sans text-xs text-heading focus:outline-hidden focus:border-focus transition-colors resize-none"
                  placeholder="State your exchange policy terms..."
                  {...register("exchangePolicyFooter")}
                />
                {errors.exchangePolicyFooter && (
                  <p className="text-xs text-status-error">
                    {errors.exchangePolicyFooter.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                disabled={!isDirty || isSubmitting}
              >
                Save receipt settings
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Thermal Paper Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-heading font-semibold text-heading uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="size-3.5 text-primary" />
              <span>Live Thermal Print Preview ({formValues.paperSize})</span>
            </span>
            <span className="text-[11px] text-muted font-sans">ESC/POS 203 DPI</span>
          </div>

          {/* Thermal Paper Canvas Container */}
          <div className="bg-theme rounded-[16px] border-2 border-dashed border-default p-5 sm:p-6 shadow-sm font-mono text-xs text-heading space-y-4 max-w-[340px] mx-auto select-none">
            {/* Header */}
            <div className="text-center space-y-1">
              <p className="font-bold text-sm tracking-wide uppercase">
                {formValues.headerBusinessName || "STORE NAME"}
              </p>
              <p className="text-[10px] leading-tight text-body">
                {formValues.branchAddressLine || "Store Address"}
              </p>
              <p className="text-[10px] text-body">{formValues.phoneOnReceipt}</p>
              <p className="text-[9px] text-muted pt-0.5">NTN: 7384910-4 · POS-01</p>
            </div>

            <div className="border-t border-dashed border-heading/30 my-2" />

            {/* Metadata */}
            <div className="text-[10px] space-y-0.5 leading-tight">
              <div className="flex justify-between">
                <span>Receipt: REC-001042</span>
                <span>11 Oct 2026, 03:45 PM</span>
              </div>
              {formValues.showCashierName && (
                <div className="flex justify-between">
                  <span>Cashier: Amina Bilal</span>
                  <span>Counter 1</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Customer: Fatima Raza</span>
                <span>0300-8472910</span>
              </div>
            </div>

            <div className="border-t border-dashed border-heading/30 my-2" />

            {/* Line Items Table */}
            <div className="space-y-1.5 text-[10.5px]">
              <div className="flex justify-between text-[10px] text-muted font-bold">
                <span>ITEM</span>
                <span>TOTAL</span>
              </div>
              <div>
                <p className="font-medium">Raw Silk Embroidered Frock</p>
                <div className="flex justify-between text-[10px] text-body pl-2">
                  <span>1 x Rs. 4,500 (M / Navy)</span>
                  <span>Rs. 4,500</span>
                </div>
              </div>
              <div>
                <p className="font-medium">Silk Dupatta Floral Emerald</p>
                <div className="flex justify-between text-[10px] text-body pl-2">
                  <span>1 x Rs. 3,500 (Standard)</span>
                  <span>Rs. 3,500</span>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-heading/30 my-2" />

            {/* Financial Summary */}
            <div className="text-[10px] space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. 8,000</span>
              </div>
              <div className="flex justify-between text-body">
                <span>Item Discount (10%):</span>
                <span>-Rs. 500</span>
              </div>
              <div className="flex justify-between text-body">
                <span>FBR Sales Tax (18%):</span>
                <span>Included</span>
              </div>
              <div className="border-t border-heading/40 pt-1 flex justify-between font-bold text-xs">
                <span>TOTAL PAID:</span>
                <span>Rs. 7,500</span>
              </div>
              <div className="flex justify-between text-body text-[9.5px]">
                <span>Tendered via Cash:</span>
                <span>Rs. 8,000</span>
              </div>
              <div className="flex justify-between text-body text-[9.5px]">
                <span>Change Returned:</span>
                <span>Rs. 500</span>
              </div>
            </div>

            {/* Loyalty and Khata Highlights */}
            {(formValues.showCustomerLoyaltyPoints || formValues.showKhataRemainingBalance) && (
              <>
                <div className="border-t border-dashed border-heading/30 my-2" />
                <div className="text-[9.5px] space-y-0.5 text-body">
                  {formValues.showCustomerLoyaltyPoints && (
                    <div className="flex justify-between">
                      <span>Loyalty Points:</span>
                      <span className="font-bold text-heading">640 pts (Gold VIP)</span>
                    </div>
                  )}
                  {formValues.showKhataRemainingBalance && (
                    <div className="flex justify-between">
                      <span>Khata Balance:</span>
                      <span className="font-bold text-heading">Rs. 0 (Clear)</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="border-t border-dashed border-heading/30 my-2" />

            {/* Footer Policy & Barcode */}
            <div className="text-center space-y-2 text-[9px] leading-tight">
              <p className="italic text-body">{formValues.exchangePolicyFooter}</p>

              {formValues.instagramWebsiteHandle && (
                <p className="font-medium text-heading">
                  {formValues.instagramWebsiteHandle}
                </p>
              )}

              {formValues.printBarcodeOnBottom && (
                <div className="pt-1 flex flex-col items-center justify-center space-y-1">
                  <div className="h-9 w-44 bg-heading/90 rounded-sm flex items-center justify-center text-dark-primary font-mono text-[9px] tracking-[4px]">
                    |||||||||||||||||||||||||||||||
                  </div>
                  <span className="text-[8.5px] tracking-widest text-muted">
                    *REC-001042*
                  </span>
                </div>
              )}

              <p className="text-[8px] text-muted pt-1">
                Powered by Retail POS • FBR Pos Invoicing
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
