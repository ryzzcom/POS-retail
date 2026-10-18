import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Customer name must be at least 2 characters." })
    .max(80, { message: "Name cannot exceed 80 characters." }),
  phone: z
    .string()
    .min(10, { message: "Enter a valid phone number (e.g. 0300-1234567)." })
    .max(20, { message: "Phone number is too long." }),
  email: z
    .string()
    .email({ message: "Enter a valid email address." })
    .or(z.literal(""))
    .optional(),
  tier: z.enum(["Gold", "Silver", "Regular", "VIP"], {
    message: "Select a valid loyalty tier.",
  }),
  tag: z.string().max(50).optional(),
  openingKhataBalance: z.coerce
    .number()
    .min(0, { message: "Khata balance cannot be negative." }),
  creditLimit: z.coerce
    .number()
    .min(0, { message: "Credit limit cannot be negative." }),
  city: z.string().max(50).optional(),
  address: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
  acceptsMarketing: z.boolean(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
