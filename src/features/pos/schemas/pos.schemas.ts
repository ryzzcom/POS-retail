import { z } from "zod";

export const checkoutTenderSchema = z.object({
  method: z.enum(
    ["cash", "card", "bank_transfer", "jazzcash_easypaisa", "khata"],
    {
      errorMap: () => ({ message: "Please select a valid payment method" }),
    }
  ),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .min(1, "Amount must be at least Rs. 1"),
  cashTendered: z.coerce.number().optional(),
  reference: z.string().optional(),
  cardLast4: z
    .string()
    .length(4, "Card last 4 digits must be exactly 4 digits")
    .optional()
    .or(z.literal("")),
});

export type CheckoutTenderSchemaType = z.infer<typeof checkoutTenderSchema>;

export const billDiscountSchema = z.object({
  discountValue: z.coerce
    .number({ invalid_type_error: "Discount must be a valid number" })
    .min(0, "Discount cannot be negative"),
  discountType: z.enum(["fixed", "percentage"]).default("fixed"),
  reason: z.string().optional(),
});

export type BillDiscountSchemaType = z.infer<typeof billDiscountSchema>;

export const holdBillSchema = z.object({
  note: z.string().max(100, "Note cannot exceed 100 characters").optional(),
});

export type HoldBillSchemaType = z.infer<typeof holdBillSchema>;
