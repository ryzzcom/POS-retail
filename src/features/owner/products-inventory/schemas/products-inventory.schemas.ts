import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  costPrice: z.coerce.number().min(0, "Cost price cannot be negative"),
  retailPrice: z.coerce.number().min(1, "Retail price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  reorderLevel: z.coerce.number().min(0, "Reorder level cannot be negative"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  designCode: z.string().min(1, "Design / style code is required"),
  category: z.string().min(1, "Please select a category"),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  season: z.string().optional(),
  supplier: z.string().optional(),
  collection: z.string().optional(),
  fabric: z.string().optional(),
  minPrice: z.coerce.number().min(0, "Minimum price cannot be negative").optional(),
  gstRate: z.coerce.number().min(0).max(100).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
});

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;

export const adjustStockSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  adjustmentType: z.enum(["add", "subtract", "set"]),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  reason: z.enum(["damaged", "shrinkage", "discrepancy", "sample", "return_to_vendor", "other"]),
  notes: z.string().optional(),
});

export type AdjustStockFormValues = z.infer<typeof adjustStockSchema>;
