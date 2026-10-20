import { z } from "zod";

export const cashDrawerSchema = z.object({
  type: z.enum(["cash_in", "cash_out"], {
    errorMap: () => ({ message: "Please select Cash In or Cash Out" }),
  }),
  amount: z.coerce
    .number({ invalid_type_error: "Please enter a valid amount" })
    .positive("Amount must be greater than 0"),
  reason: z
    .string()
    .min(1, "Please select or enter a reason for this cash adjustment"),
  notes: z.string().optional(),
});

export type CashDrawerSchemaType = z.infer<typeof cashDrawerSchema>;

export const closeShiftSchema = z.object({
  actualCash: z.coerce
    .number({ invalid_type_error: "Please enter the counted cash amount" })
    .min(0, "Counted cash cannot be negative"),
  notes: z.string().optional(),
});

export type CloseShiftSchemaType = z.infer<typeof closeShiftSchema>;

export const quickCustomerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(80, "Name is too long"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^(\+92|0)?3[0-9]{9}$/,
      "Please enter a valid Pakistani mobile number (e.g. 03001234567)"
    ),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
});

export type QuickCustomerSchemaType = z.infer<typeof quickCustomerSchema>;
