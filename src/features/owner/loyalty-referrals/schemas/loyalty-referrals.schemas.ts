import { z } from "zod";

export const loyaltyRulesSchema = z.object({
  spendPerPoint: z.coerce
    .number()
    .min(1, "Spend per point must be at least Rs. 1"),
  pointValue: z.coerce
    .number()
    .min(0.01, "Point value must be at least Rs. 0.01"),
  minBillToRedeem: z.coerce
    .number()
    .min(0, "Minimum bill must be 0 or higher"),
  minPointsToRedeem: z.coerce
    .number()
    .min(0, "Minimum points must be 0 or higher"),
  maxPointsPerBill: z.coerce
    .number()
    .min(1, "Max points per bill must be at least 1"),
  maxPercentPayable: z.coerce
    .number()
    .min(1, "Must be at least 1%")
    .max(100, "Cannot exceed 100%"),
  pointsExpiryMonths: z.coerce
    .number()
    .min(1, "Expiry must be at least 1 month"),
  silverThreshold: z.coerce
    .number()
    .min(0, "Silver threshold cannot be negative"),
  goldThreshold: z.coerce
    .number()
    .min(0, "Gold threshold cannot be negative"),
  reverseOnReturn: z.boolean(),
});

export type LoyaltyRulesFormValues = z.infer<typeof loyaltyRulesSchema>;

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code cannot exceed 20 characters")
    .regex(/^[A-Za-z0-9_-]+$/, "Code can only contain letters, numbers, and dashes")
    .transform((v) => v.toUpperCase()),
  type: z.enum(["percentage", "fixed"]),
  title: z.string().min(3, "Offer title must be at least 3 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  discountPercent: z.coerce.number().min(1, "Percentage must be at least 1%").max(100, "Cannot exceed 100%").optional(),
  discountAmount: z.coerce.number().min(1, "Discount amount must be at least Rs. 1").optional(),
  maxDiscount: z.coerce.number().min(0, "Max discount must be 0 or higher"),
  minBill: z.coerce.number().min(0, "Min bill must be 0 or higher"),
  usesPerCustomer: z.coerce.number().min(0, "Uses per customer must be 0 or higher"),
  totalUses: z.coerce.number().min(0, "Total uses must be 0 or higher"),
  starts: z.string().min(1, "Start date is required"),
  ends: z.string().min(1, "End date is required"),
  eligibleCategories: z.array(z.string()),
  firstPurchaseOnly: z.boolean(),
  isActive: z.boolean(),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
