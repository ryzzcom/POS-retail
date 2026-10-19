import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(2, "Supplier name must be at least 2 characters"),
  contactPerson: z.string().min(2, "Contact person is required"),
  phone: z
    .string()
    .min(10, "Valid contact phone number is required")
    .regex(/^[0-9+\s-]{10,16}$/, "Invalid phone format (e.g. 0300-8123456)"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  ntn: z.string().optional(),
  city: z.string().min(2, "City is required (e.g. Lahore, Faisalabad, Karachi)"),
  address: z.string().optional(),
  category: z.string().min(1, "Please select a supplier category"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  openingBalance: z.number({ invalid_type_error: "Must be a valid number" }).min(0, "Cannot be negative"),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

export const purchaseLineItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Item name / SKU is required"),
  quantity: z
    .number({ invalid_type_error: "Qty must be a number" })
    .positive("Quantity must be at least 1"),
  unitPrice: z
    .number({ invalid_type_error: "Unit price must be a number" })
    .positive("Price must be greater than 0"),
  total: z.number(),
});

export type PurchaseLineItemFormValues = z.infer<typeof purchaseLineItemSchema>;

export const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Please select a supplier"),
  poNumber: z.string().min(3, "PO / Bill reference is required"),
  orderDate: z.string().min(1, "Order date is required"),
  dueDate: z.string().min(1, "Expected arrival / due date is required"),
  status: z.enum(["Draft", "Ordered", "Partial", "Received", "Cancelled"]),
  paymentStatus: z.enum(["Unpaid", "Partial", "Paid"]),
  paidAmount: z.number({ invalid_type_error: "Must be a number" }).min(0),
  shippingCost: z.number({ invalid_type_error: "Must be a number" }).min(0),
  taxAmount: z.number({ invalid_type_error: "Must be a number" }).min(0),
  notes: z.string().optional(),
  lineItems: z
    .array(purchaseLineItemSchema)
    .min(1, "At least one purchase line item is required"),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

export const recordSupplierPaymentSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Payment amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.enum(["bank_transfer", "cash", "cheque", "jazzcash"], {
    errorMap: () => ({ message: "Select a payment method" }),
  }),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type RecordSupplierPaymentFormValues = z.infer<typeof recordSupplierPaymentSchema>;
