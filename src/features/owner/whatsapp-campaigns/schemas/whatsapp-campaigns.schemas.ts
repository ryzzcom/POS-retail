import { z } from "zod";

export const newCouponSchema = z.object({
  couponName: z.string().min(2, "Coupon name must be at least 2 characters"),
  couponCode: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .regex(/^[A-Za-z0-9_-]+$/, "Coupon code must only contain letters, numbers, and dashes"),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"], {
    errorMap: () => ({ message: "Please select a valid discount type" }),
  }),
  discountValue: z.number({ invalid_type_error: "Must be a valid number" }).min(1, "Discount value must be at least 1"),
  minPurchase: z.number({ invalid_type_error: "Must be a valid number" }).min(0, "Cannot be negative"),
  maxDiscountCap: z.number({ invalid_type_error: "Must be a valid number" }).optional(),
  totalLimit: z.number({ invalid_type_error: "Must be a valid number" }).optional(),
  usageLimitPerCustomer: z.number({ invalid_type_error: "Must be a valid number" }).min(1, "Limit must be at least 1"),
  category: z.string().min(1, "Please select an applicable category"),
  startsDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export type NewCouponFormValues = z.infer<typeof newCouponSchema>;

export const newCampaignSchema = z.object({
  title: z.string().min(3, "Campaign title must be at least 3 characters"),
  purpose: z.string().min(3, "Campaign purpose is required"),
  audienceSegment: z.string().min(1, "Please select an audience target segment"),
  couponCode: z.string().optional(),
  templateId: z.string().min(1, "Please select a WhatsApp template"),
  scheduleType: z.enum(["now", "scheduled"]),
  scheduledDate: z.string().optional(),
  customNote: z.string().optional(),
});

export type NewCampaignFormValues = z.infer<typeof newCampaignSchema>;

export const connectionSettingsSchema = z.object({
  phoneNumberId: z.string().min(5, "Phone Number ID from Meta is required"),
  businessDisplayName: z.string().min(2, "Business display name is required"),
  googleReviewLink: z.string().optional(),
  isApiEnabled: z.boolean(),
  requireExplicitOptIn: z.boolean(),
  enforceQuietHours: z.boolean(),
  autoUnsubscribeKeyword: z.boolean(),
});

export type ConnectionSettingsFormValues = z.infer<typeof connectionSettingsSchema>;
