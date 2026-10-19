"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffMemberSchema, StaffMemberSchemaType } from "../schemas";
import { StaffMember } from "../types";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus, Shield, KeyRound, Monitor } from "lucide-react";

interface AddStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: StaffMember) => void;
  editingMember?: StaffMember | null;
}

const ROLE_OPTIONS = [
  { label: "POS Cashier — Front Register Operator", value: "cashier" },
  { label: "Store Manager — Overrides & Cash Drawer", value: "manager" },
  { label: "Inventory Clerk — Stock & Purchasing", value: "inventory_clerk" },
  { label: "Store Owner — Master Administrator", value: "owner" },
];

const TERMINAL_OPTIONS = [
  { label: "Counter 1 (Floor Front)", value: "Counter 1 (Floor Front)" },
  { label: "Counter 2 (Bridal Studio)", value: "Counter 2 (Bridal Studio)" },
  { label: "All Counters & Mobile POS", value: "All Counters & Mobile POS" },
  { label: "Backoffice Inventory Hub", value: "Backoffice Inventory Hub" },
];

export function AddStaffDialog({
  open,
  onClose,
  onSave,
  editingMember,
}: AddStaffDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StaffMemberSchemaType>({
    resolver: zodResolver(staffMemberSchema),
    defaultValues: {
      name: editingMember?.name || "",
      phone: editingMember?.phone || "",
      email: editingMember?.email || "",
      role: editingMember?.role || "cashier",
      pin: "1234",
      maxDiscountPercent: editingMember?.maxDiscountPercent || 10,
      assignedTerminal: editingMember?.assignedTerminal || "Counter 1 (Floor Front)",
    },
  });

  React.useEffect(() => {
    if (editingMember) {
      reset({
        name: editingMember.name,
        phone: editingMember.phone,
        email: editingMember.email,
        role: editingMember.role,
        pin: "1234",
        maxDiscountPercent: editingMember.maxDiscountPercent,
        assignedTerminal: editingMember.assignedTerminal,
      });
    } else {
      reset({
        name: "",
        phone: "",
        email: "",
        role: "cashier",
        pin: "",
        maxDiscountPercent: 10,
        assignedTerminal: "Counter 1 (Floor Front)",
      });
    }
  }, [editingMember, reset, open]);

  const onSubmit = async (data: StaffMemberSchemaType) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newMember: StaffMember = {
      id: editingMember ? editingMember.id : `staff-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      assignedTerminal: data.assignedTerminal,
      pinSet: true,
      lastActive: editingMember ? editingMember.lastActive : "Just added",
      status: editingMember ? editingMember.status : "active",
      maxDiscountPercent: data.maxDiscountPercent,
    };
    onSave(newMember);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <UserPlus className="size-5 text-primary" />
          <span>{editingMember ? "Edit Staff Member" : "Add Staff Member / Cashier"}</span>
        </div>
      }
      subtitle="Register boutique staff, assign counter terminals, and configure security PIN."
      maxWidthClass="w-full sm:max-w-[560px]"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            isLoading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {editingMember ? "Save changes" : "Add staff member"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1">
        <Input
          label="Full Name"
          placeholder="e.g. Amina Bilal"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="03XX-XXXXXXX"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="staff@noorpret.pk"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                label="Role & Access Tier"
                options={ROLE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.role?.message}
              />
            )}
          />

          <Controller
            name="assignedTerminal"
            control={control}
            render={({ field }) => (
              <Select
                label="Assigned Terminal"
                options={TERMINAL_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.assignedTerminal?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <Input
            label="4-Digit POS Security PIN"
            type="password"
            maxLength={4}
            placeholder="••••"
            leftIcon={<KeyRound className="size-4" />}
            helperText="PIN to unlock counter and authenticate sales"
            error={errors.pin?.message}
            {...register("pin")}
          />

          <Input
            label="Max Allowed Discount (%)"
            type="number"
            min={0}
            max={100}
            placeholder="10"
            helperText="Requires Manager override if exceeded"
            error={errors.maxDiscountPercent?.message}
            {...register("maxDiscountPercent")}
          />
        </div>
      </form>
    </Dialog>
  );
}
