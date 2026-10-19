"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  purchaseOrderSchema,
  PurchaseOrderFormValues,
} from "../schemas/purchases-suppliers.schemas";
import { SupplierItem } from "../types/purchases-suppliers.types";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";
import { Plus, Trash2 } from "lucide-react";

interface AddPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  suppliers: SupplierItem[];
  onSubmitPurchase: (values: PurchaseOrderFormValues) => void;
}

const PAYMENT_STATUS_OPTIONS = [
  { label: "Unpaid / Credit", value: "Unpaid" },
  { label: "Partial Advance Paid", value: "Partial" },
  { label: "Paid in Full", value: "Paid" },
];

const ORDER_STATUS_OPTIONS = [
  { label: "Ordered (Pending Arrival)", value: "Ordered" },
  { label: "Received in Full", value: "Received" },
  { label: "Partial Delivery Received", value: "Partial" },
  { label: "Draft PO", value: "Draft" },
];

export function AddPurchaseModal({
  open,
  onClose,
  suppliers,
  onSubmitPurchase,
}: AddPurchaseModalProps) {
  const supplierOptions = React.useMemo(() => {
    return suppliers.map((s) => ({
      label: `${s.name} (${s.paymentTerms})`,
      value: s.id,
    }));
  }, [suppliers]);

  const today = new Date().toISOString().split("T")[0];
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplierId: suppliers[0]?.id || "",
      poNumber: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
      orderDate: today,
      dueDate: in30Days,
      status: "Ordered",
      paymentStatus: "Unpaid",
      paidAmount: 0,
      shippingCost: 0,
      taxAmount: 0,
      notes: "",
      lineItems: [
        {
          description: "",
          quantity: 10,
          unitPrice: 2500,
          total: 25000,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const watchedLineItems = watch("lineItems");
  const watchedShipping = watch("shippingCost") || 0;
  const watchedTax = watch("taxAmount") || 0;
  const watchedPaymentStatus = watch("paymentStatus");

  // Calculate Subtotal and Grand Total dynamically
  const subtotal = React.useMemo(() => {
    return (watchedLineItems || []).reduce((acc, item) => {
      const q = Number(item?.quantity) || 0;
      const p = Number(item?.unitPrice) || 0;
      return acc + q * p;
    }, 0);
  }, [watchedLineItems]);

  const grandTotal = subtotal + Number(watchedShipping) + Number(watchedTax);

  // Keep line item totals updated
  const handleItemChange = (index: number, qty: number, price: number) => {
    const itemTotal = (qty || 0) * (price || 0);
    setValue(`lineItems.${index}.total`, itemTotal);
  };

  const onFormSubmit = (data: PurchaseOrderFormValues) => {
    onSubmitPurchase(data);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create Purchase Order / Bill"
      subtitle="Record fabric consignments, master stitching orders, and supplier bills."
      maxWidthClass="w-full sm:max-w-4xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6 pt-2 select-none">
        {/* Row 1: Supplier & PO Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs sm:text-sm font-medium text-heading">
              Select Supplier *
            </label>
            <Controller
              name="supplierId"
              control={control}
              render={({ field }) => (
                <Select
                  options={supplierOptions}
                  value={field.value}
                  onChange={field.onChange}
                  fullWidth
                />
              )}
            />
          </div>

          <div>
            <Input
              label="Purchase Order / Bill # *"
              placeholder="e.g. PO-000047"
              error={errors.poNumber?.message}
              {...register("poNumber")}
            />
          </div>
        </div>

        {/* Row 2: Dates & Statuses */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <Input
              label="Order Date *"
              type="date"
              error={errors.orderDate?.message}
              {...register("orderDate")}
            />
          </div>
          <div>
            <Input
              label="Due / Expected Date *"
              type="date"
              error={errors.dueDate?.message}
              {...register("dueDate")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs sm:text-sm font-medium text-heading">
              Delivery Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  options={ORDER_STATUS_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  fullWidth
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs sm:text-sm font-medium text-heading">
              Payment Status
            </label>
            <Controller
              name="paymentStatus"
              control={control}
              render={({ field }) => (
                <Select
                  options={PAYMENT_STATUS_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  fullWidth
                />
              )}
            />
          </div>
        </div>

        {/* Row 3: Line Items Repeater */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm sm:text-base text-heading">
              Purchased Items / Consignments
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  description: "",
                  quantity: 1,
                  unitPrice: 1000,
                  total: 1000,
                })
              }
              className="gap-1.5 text-xs h-8"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {fields.map((field, index) => {
              const currentQty = watchedLineItems?.[index]?.quantity || 0;
              const currentPrice = watchedLineItems?.[index]?.unitPrice || 0;
              const rowTotal = currentQty * currentPrice;

              return (
                <div
                  key={field.id}
                  className="p-3.5 rounded-xl border border-default/50 bg-subtle/20 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-6">
                    <Input
                      placeholder="Item description / fabric name / roll code"
                      error={errors.lineItems?.[index]?.description?.message}
                      {...register(`lineItems.${index}.description`)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      error={errors.lineItems?.[index]?.quantity?.message}
                      {...register(`lineItems.${index}.quantity`, {
                        valueAsNumber: true,
                        onChange: (e) =>
                          handleItemChange(
                            index,
                            Number(e.target.value),
                            currentPrice
                          ),
                      })}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      type="number"
                      placeholder="Unit Price"
                      error={errors.lineItems?.[index]?.unitPrice?.message}
                      {...register(`lineItems.${index}.unitPrice`, {
                        valueAsNumber: true,
                        onChange: (e) =>
                          handleItemChange(
                            index,
                            currentQty,
                            Number(e.target.value)
                          ),
                      })}
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                    <span className="font-sans text-xs sm:text-sm font-semibold text-heading whitespace-nowrap">
                      {formatPKR(rowTotal)}
                    </span>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-body hover:text-status-error p-1 rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 4: Totals & Extra charges */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2 border-t border-default/30 items-end">
          <div className="sm:col-span-6 flex flex-col gap-3">
            <Input
              label="Purchase Notes / Remarks (Optional)"
              placeholder="e.g. Consignment delivered via Daewoo Cargo, Bilty #8812"
              {...register("notes")}
            />
            {watchedPaymentStatus === "Partial" && (
              <Input
                label="Advance Payment Amount (PKR)"
                type="number"
                placeholder="0"
                error={errors.paidAmount?.message}
                {...register("paidAmount", { valueAsNumber: true })}
              />
            )}
          </div>

          <div className="sm:col-span-6 flex flex-col gap-2 p-4 rounded-xl border border-default/50 bg-subtle/30 font-sans text-xs sm:text-sm">
            <div className="flex items-center justify-between text-body">
              <span>Items Subtotal:</span>
              <span className="font-medium text-heading">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-body">
              <span>Shipping & Freight:</span>
              <div className="w-28">
                <Input
                  type="number"
                  placeholder="0"
                  {...register("shippingCost", { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-body">
              <span>Tax / Duties:</span>
              <div className="w-28">
                <Input
                  type="number"
                  placeholder="0"
                  {...register("taxAmount", { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-heading font-semibold text-sm sm:text-base pt-2 border-t border-default/40">
              <span>Grand Total:</span>
              <span className="text-primary font-bold">{formatPKR(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-default/30">
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
            Save Purchase Order
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
