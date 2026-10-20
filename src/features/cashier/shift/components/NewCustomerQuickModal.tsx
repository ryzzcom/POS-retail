"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { quickCustomerSchema, QuickCustomerSchemaType } from "../schemas";

export interface NewCustomerQuickModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (data: QuickCustomerSchemaType) => void;
}

export function NewCustomerQuickModal({
  open,
  onClose,
  onCreated,
}: NewCustomerQuickModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<QuickCustomerSchemaType>({
    resolver: zodResolver(quickCustomerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        fullName: "",
        phoneNumber: "",
        email: "",
        notes: "",
      });
    }
  }, [open, reset]);

  const onSubmit = (data: QuickCustomerSchemaType) => {
    onCreated(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="New Customer Profile"
      subtitle="Register customer for loyalty points and digital WhatsApp receipts"
      maxWidthClass="w-full sm:max-w-[540px]"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full px-5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-customer-quick-form"
            variant="primary"
            disabled={!isValid}
            className="rounded-full px-6 flex items-center gap-2"
          >
            <UserPlus className="size-4 shrink-0" />
            <span>Create Customer</span>
          </Button>
        </div>
      }
    >
      <form
        id="new-customer-quick-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 select-none"
      >
        <div>
          <Input
            label="Full Name"
            placeholder="e.g. Ayesha Siddiqui"
            {...register("fullName")}
            error={errors.fullName?.message}
          />
        </div>

        <div>
          <Input
            label="Mobile Number"
            placeholder="e.g. 03001234567"
            {...register("phoneNumber")}
            error={errors.phoneNumber?.message}
          />
        </div>

        <div>
          <Input
            label="Email Address (Optional)"
            placeholder="e.g. ayesha@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

        <div>
          <Input
            label="Notes / Preferences (Optional)"
            placeholder="e.g. Prefers Pret size M, lawn fabrics"
            {...register("notes")}
            error={errors.notes?.message}
          />
        </div>
      </form>
    </Dialog>
  );
}
