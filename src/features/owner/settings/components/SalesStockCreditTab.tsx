"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salesStockCreditSchema, SalesStockCreditSchemaType } from "../schemas";
import { INITIAL_SALES_STOCK_CREDIT_SETTINGS } from "../constants";
import { settingsService } from "../services/settings.service";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Package,
  BookOpen,
  CheckCircle2,
  Percent,
  Calendar,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const PAYMENT_METHOD_OPTIONS = [
  { label: "Cash (Primary Drawer)", value: "Cash" },
  { label: "Card POS Machine", value: "Card" },
  { label: "JazzCash / Easypaisa QR", value: "JazzCash/Easypaisa" },
  { label: "Direct Bank Transfer / IBFT", value: "Bank Transfer" },
];

export function SalesStockCreditTab() {
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<SalesStockCreditSchemaType>({
    resolver: zodResolver(salesStockCreditSchema),
    defaultValues: INITIAL_SALES_STOCK_CREDIT_SETTINGS,
    mode: "onChange",
  });

  // Load live sales, stock, and credit rules from backend
  React.useEffect(() => {
    let isMounted = true;
    async function loadSalesSettings() {
      try {
        const res = await settingsService.getAllSettings();
        if (isMounted && res.salesStockCredit) {
          reset(res.salesStockCredit);
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadSalesSettings();
    return () => {
      isMounted = false;
    };
  }, [reset]);

  const onSubmit = async (data: SalesStockCreditSchemaType) => {
    try {
      setErrorMessage(null);
      await settingsService.updateSalesStockCreditRules(data);
      reset(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update sales & credit rules";
      setErrorMessage(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-[16px] bg-status-success-bg border border-status-success/30 text-status-success">
          <CheckCircle2 className="size-5 shrink-0" />
          <p className="font-sans text-xs sm:text-sm font-medium">
            POS checkout, inventory thresholds, and Khata credit rules saved successfully.
          </p>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="flex items-center gap-3 p-4 rounded-[16px] bg-status-error-bg border border-status-error/30 text-status-error text-xs font-medium"
        >
          {errorMessage}
        </div>
      )}

      {/* Card 1: POS Checkout & Pricing Rules */}
      <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-default/40">
          <div className="size-10 rounded-[12px] bg-subtle/80 flex items-center justify-center text-primary shrink-0">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
              POS Checkout & Pricing Rules
            </h3>
            <p className="text-xs text-body font-sans mt-0.5">
              Control tender behavior, cashier line discounts, and exchange return windows.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                Allow negative inventory / overselling
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                Permit sales even if in-stock quantity is zero or untracked.
              </p>
            </div>
            <Controller
              name="allowNegativeInventory"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                Require customer mobile phone on sale
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                Ensures loyalty points and WhatsApp receipts can be delivered.
              </p>
            </div>
            <Controller
              name="requireCustomerPhoneOnSale"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                Auto-round bill to nearest Rupee
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                Eliminate paisas/cents on cash tender totals for fast counter speed.
              </p>
            </div>
            <Controller
              name="autoRoundToNearestRupee"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex flex-col justify-between gap-2">
            <Controller
              name="defaultPaymentMethod"
              control={control}
              render={({ field }) => (
                <Select
                  label="Default Selected Payment Method"
                  options={PAYMENT_METHOD_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
          <Input
            label="Max Discount without Manager PIN (%)"
            type="number"
            min={0}
            max={100}
            placeholder="10"
            error={errors.maxDiscountWithoutManagerPin?.message}
            {...register("maxDiscountWithoutManagerPin")}
          />

          <Input
            label="Item Exchange / Return Window (Days)"
            type="number"
            min={0}
            max={365}
            placeholder="7"
            helperText="Receipt validation window for returns"
            error={errors.returnExchangeWindowDays?.message}
            {...register("returnExchangeWindowDays")}
          />
        </div>
      </div>

      {/* Card 2: Inventory & Barcode Rules */}
      <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-default/40">
          <div className="size-10 rounded-[12px] bg-subtle/80 flex items-center justify-center text-primary shrink-0">
            <Package className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
              Inventory & Barcode Rules
            </h3>
            <p className="text-xs text-body font-sans mt-0.5">
              Stock thresholds, SKU automated prefixing, and dead-stock alerts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <Input
            label="Low-Stock Alert Threshold (Units)"
            type="number"
            min={1}
            placeholder="3"
            helperText="Triggers warning badge on inventory & POS cart"
            error={errors.lowStockThresholdUnits?.message}
            {...register("lowStockThresholdUnits")}
          />

          <Input
            label="Default SKU Barcode Prefix"
            placeholder="NP-"
            helperText="Prepended when auto-generating new variants"
            error={errors.autoGenerateSkuPrefix?.message}
            {...register("autoGenerateSkuPrefix")}
          />

          <Input
            label="Warn Dead / Slow Stock After (Days)"
            type="number"
            min={1}
            placeholder="60"
            helperText="Flags variants with zero sales in period"
            error={errors.warnDeadStockDays?.message}
            {...register("warnDeadStockDays")}
          />
        </div>

        <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
          <div>
            <p className="font-heading font-medium text-heading text-sm">
              Enable size/color variant matrix for apparel
            </p>
            <p className="text-xs text-body font-sans mt-0.5">
              Automatically creates SKU matrices for Pret (XS, S, M, L, XL) and Unstitched colors.
            </p>
          </div>
          <Controller
            name="enableVariantMatrix"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
      </div>

      {/* Card 3: Khata / Customer Credit Rules */}
      <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-default/40 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-[12px] bg-subtle/80 flex items-center justify-center text-primary shrink-0">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
                Khata & Store Credit Rules
              </h3>
              <p className="text-xs text-body font-sans mt-0.5">
                Default receivable limits, due day schedules, and automated collection reminders.
              </p>
            </div>
          </div>

          <Controller
            name="enableKhataCreditAtPos"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} label="Enable Khata at POS" />
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Input
            label="Default Customer Credit Limit (Rs.)"
            type="number"
            min={0}
            placeholder="25000"
            helperText="Default balance ceiling assigned to new retail profiles"
            error={errors.defaultCreditLimit?.message}
            {...register("defaultCreditLimit")}
          />

          <Input
            label="Default Payment Due Cycle (Days)"
            type="number"
            min={1}
            placeholder="15"
            helperText="Grace period before credit transitions to overdue"
            error={errors.defaultPaymentDueDays?.message}
            {...register("defaultPaymentDueDays")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                Block new credit sales when overdue
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                Prevents cashiers from adding Khata debt if earlier bill is unpaid.
              </p>
            </div>
            <Controller
              name="blockNewCreditWhenOverdue"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading font-medium text-heading text-sm">
                Auto-send WhatsApp reminder before due date
              </p>
              <p className="text-xs text-body font-sans mt-0.5">
                Sends automated friendly balance message 2 days before due date.
              </p>
            </div>
            <Controller
              name="autoSendWhatsAppReminder"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </div>
      </div>

      {/* Card 4: Customer Rewards & AI Try-On Credits */}
      <div className="bg-card rounded-[18px] border border-default/50 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-default/40">
          <div className="size-10 rounded-[12px] bg-accent/15 border border-accent/25 flex items-center justify-center text-primary">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-heading text-base sm:text-lg">
              Customer Rewards & AI Try-On Credits
            </h3>
            <p className="text-xs sm:text-sm text-body font-sans">
              Configure automated try-on credits awarded when shoppers register or complete checkout at POS counters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <Input
            label="First Purchase Bonus Credits"
            type="number"
            min={0}
            placeholder="20"
            helperText="Awarded on customer's 1st POS purchase (+20 default)"
            error={errors.tryOnFirstPurchaseCredits?.message}
            {...register("tryOnFirstPurchaseCredits")}
          />

          <Input
            label="Repeat Purchase Credits"
            type="number"
            min={0}
            placeholder="10"
            helperText="Awarded on subsequent completed checkouts (+10 default)"
            error={errors.tryOnRepeatPurchaseCredits?.message}
            {...register("tryOnRepeatPurchaseCredits")}
          />

          <Input
            label="New Signup Welcome Credits"
            type="number"
            min={0}
            placeholder="5"
            helperText="Granted immediately when customer links phone"
            error={errors.tryOnSignupCredits?.message}
            {...register("tryOnSignupCredits")}
          />

          <Input
            label="Daily Free Tries"
            type="number"
            min={0}
            placeholder="1"
            helperText="Free try-on trials refreshed every 24 hours"
            error={errors.tryOnDailyFreeTries?.message}
            {...register("tryOnDailyFreeTries")}
          />
        </div>

        <div className="p-4 rounded-[14px] bg-theme border border-default/50 flex items-start gap-3">
          <Sparkles className="size-5 text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-body font-sans leading-relaxed">
            <span className="font-medium text-heading">Multi-Store Privacy Guarantee:</span> Try-On credits and loyalty points earned at your boutique are strictly isolated to your store. Customers cannot spend your credits at other retailers, and other stores cannot access your shoppers&apos; history.
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-3">
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={() => reset(INITIAL_SALES_STOCK_CREDIT_SETTINGS)}
          disabled={!isDirty || isSubmitting}
        >
          Discard changes
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="default"
          isLoading={isSubmitting}
          disabled={!isDirty || isSubmitting}
        >
          Save operational rules
        </Button>
      </div>
    </form>
  );
}
