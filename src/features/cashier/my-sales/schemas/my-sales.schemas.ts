import { z } from "zod";

export const returnExchangeSchema = z.object({
  receiptNumber: z.string().min(1, "Receipt number is required"),
  customerName: z.string().optional(),
  returnQty: z.coerce
    .number({ invalid_type_error: "Return quantity must be a number" })
    .min(1, "Please select at least 1 item to return"),
  condition: z.string().min(1, "Please select item condition"),
  reason: z
    .string()
    .min(3, "Please provide a valid return reason (at least 3 characters)"),
  settlementMethod: z.enum(
    ["cash", "original_payment", "reduce_khata", "exchange"],
    {
      errorMap: () => ({ message: "Please select a settlement method" }),
    }
  ),
  notes: z.string().optional(),
});

export type ReturnExchangeSchemaType = z.infer<typeof returnExchangeSchema>;
