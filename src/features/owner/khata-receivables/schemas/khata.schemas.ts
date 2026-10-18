import { z } from "zod";

export const recordKhataPaymentSchema = z.object({
  accountId: z.string().min(1, "Customer account is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a valid number" })
    .positive("Payment amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.enum(["cash", "bank_transfer", "jazzcash", "nayapay"], {
    errorMap: () => ({ message: "Select a valid payment destination" }),
  }),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type RecordKhataPaymentFormValues = z.infer<typeof recordKhataPaymentSchema>;

export const adjustCreditLimitSchema = z.object({
  accountId: z.string().min(1, "Customer account is required"),
  creditLimit: z
    .number({ invalid_type_error: "Credit limit must be a valid number" })
    .min(0, "Credit limit cannot be negative"),
  reason: z.string().optional(),
});

export type AdjustCreditLimitFormValues = z.infer<typeof adjustCreditLimitSchema>;

export const whatsAppReminderSchema = z.object({
  accountId: z.string().min(1, "Customer account is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  message: z.string().min(5, "Reminder message cannot be empty"),
});

export type WhatsAppReminderFormValues = z.infer<typeof whatsAppReminderSchema>;
