import { z } from "zod";

export const expenseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  category: z.string().min(1, "Please select an expense category"),
  amount: z.coerce
    .number()
    .min(1, "Expense amount must be at least Rs. 1"),
  expenseDate: z.string().min(1, "Expense date is required"),
  vendor: z
    .string()
    .min(2, "Vendor or payee name must be at least 2 characters"),
  paymentStatus: z.enum(["paid", "partial", "unpaid"]),
  paidFrom: z.string().min(1, "Please select payment account"),
  referenceNo: z.string().optional(),
  repeatsMonthly: z.boolean(),
  notes: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export const recordPaymentSchema = z.object({
  paidFrom: z.string().min(1, "Please select paying account"),
  amount: z.coerce.number().min(1, "Payment amount must be at least Rs. 1"),
  paymentDate: z.string().min(1, "Payment date is required"),
  referenceNo: z.string().optional(),
});

export type RecordPaymentFormValues = z.infer<typeof recordPaymentSchema>;
