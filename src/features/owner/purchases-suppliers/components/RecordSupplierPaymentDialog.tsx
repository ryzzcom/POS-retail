"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  recordSupplierPaymentSchema,
  RecordSupplierPaymentFormValues,
} from "../schemas/purchases-suppliers.schemas";
import { SupplierItem } from "../types/purchases-suppliers.types";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";

interface RecordSupplierPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  supplier: SupplierItem | null;
  suppliers: SupplierItem[];
  onConfirmPayment: (values: RecordSupplierPaymentFormValues) => void;
}

const PAYMENT_METHODS = [
  { label: "Bank Transfer (Meezan / Habib Metro)", value: "bank_transfer" },
  { label: "Cash from Drawer", value: "cash" },
  { label: "Cheque / Pay Order", value: "cheque" },
  { label: "JazzCash / EasyPaisa Business", value: "jazzcash" },
];

export function RecordSupplierPaymentDialog({
  open,
  onClose,
  supplier,
  suppliers,
  onConfirmPayment,
}: RecordSupplierPaymentDialogProps) {
  const selectedSupplierId = supplier?.id || suppliers[0]?.id || "";
  const activeSupplier = suppliers.find((s) => s.id === selectedSupplierId) || supplier;

  const supplierOptions = React.useMemo(() => {
    return suppliers.map((s) => ({
      label: `${s.name} (Balance: ${formatPKR(s.outstandingBalance)})`,
      value: s.id,
    }));
  }, [suppliers]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecordSupplierPaymentFormValues>({
    resolver: zodResolver(recordSupplierPaymentSchema),
    defaultValues: {
      supplierId: selectedSupplierId,
      amount: activeSupplier?.outstandingBalance || 10000,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "bank_transfer",
      reference: `PV-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: "",
    },
  });

  React.useEffect(() => {
    if (supplier) {
      setValue("supplierId", supplier.id);
      setValue("amount", supplier.outstandingBalance);
    }
  }, [supplier, setValue]);

  const onFormSubmit = (data: RecordSupplierPaymentFormValues) => {
    onConfirmPayment(data);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Record Payment to Supplier"
      subtitle="Issue a payment voucher against outstanding bills and update supplier ledger balance."
      maxWidthClass="w-full sm:max-w-lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5 pt-2 select-none">
        {/* Supplier Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs sm:text-sm font-medium text-heading">
            Supplier *
          </label>
          <Controller
            name="supplierId"
            control={control}
            render={({ field }) => (
              <Select
                options={supplierOptions}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  const matched = suppliers.find((s) => s.id === val);
                  if (matched) {
                    setValue("amount", matched.outstandingBalance);
                  }
                }}
                fullWidth
              />
            )}
          />
        </div>

        {/* Current Balance Notice */}
        {activeSupplier && (
          <div className="p-3.5 rounded-xl border border-default/50 bg-subtle/30 flex items-center justify-between text-xs sm:text-sm font-sans">
            <span className="text-body">Current Payable Balance:</span>
            <span className="font-bold text-status-error">
              {formatPKR(activeSupplier.outstandingBalance)}
            </span>
          </div>
        )}

        {/* Payment Amount & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Payment Amount (PKR) *"
              type="number"
              placeholder="0"
              error={errors.amount?.message}
              {...register("amount", { valueAsNumber: true })}
            />
          </div>
          <div>
            <Input
              label="Payment Date *"
              type="date"
              error={errors.paymentDate?.message}
              {...register("paymentDate")}
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs sm:text-sm font-medium text-heading">
            Payment Source / Destination *
          </label>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <Select
                options={PAYMENT_METHODS}
                value={field.value}
                onChange={field.onChange}
                fullWidth
              />
            )}
          />
        </div>

        {/* Reference & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Payment Voucher # / Cheque #"
              placeholder="e.g. PV-8816"
              error={errors.reference?.message}
              {...register("reference")}
            />
          </div>
          <div>
            <Input
              label="Notes / Remarks"
              placeholder="e.g. Part payment for lawn rolls"
              error={errors.notes?.message}
              {...register("notes")}
            />
          </div>
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
            disabled={isSubmitting}
            className="px-7 rounded-full"
          >
            Confirm Payment
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
