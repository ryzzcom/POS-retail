export type PosCategory =
  | "all"
  | "unstitched"
  | "pret"
  | "formal"
  | "men"
  | "kids"
  | "bottoms"
  | "accessories";

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  price: number;
}

export interface PosProduct {
  id: string;
  name: string;
  code: string;
  category: PosCategory;
  fabric: string;
  price: number;
  image: string;
  colorNames: string[];
  colorSwatches: string[];
  availableSizes: string[];
  variants: ProductVariant[];
  totalStock: number;
}

export interface PosCartItem {
  id: string;
  productId: string;
  productName: string;
  code: string;
  image: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  lineTotal: number;
}

export type CustomerLoyaltyTier = "Regular" | "Silver" | "Gold" | "VIP";

export interface PosCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: CustomerLoyaltyTier;
  pointsBalance: number;
  khataBalance: number;
  khataLimit: number;
}

export type PosPaymentMethod =
  | "cash"
  | "card"
  | "bank_transfer"
  | "jazzcash_easypaisa"
  | "khata";

export interface PosTender {
  id: string;
  method: PosPaymentMethod;
  amount: number;
  cashTendered?: number;
  changeDue?: number;
  reference?: string;
  cardLast4?: string;
}

export interface PosHeldBill {
  id: string;
  heldAt: string;
  customer: PosCustomer | null;
  items: PosCartItem[];
  subtotal: number;
  total: number;
  note?: string;
}

export interface PosSaleResult {
  receiptNumber: string;
  completedAt: string;
  customer: PosCustomer | null;
  items: PosCartItem[];
  subtotal: number;
  pointsRedeemed: number;
  pointsDiscountPKR: number;
  billDiscountPKR: number;
  grandTotalPKR: number;
  tenders: PosTender[];
  changeDuePKR: number;
  pointsEarned: number;
  newPointsBalance: number;
  cashierName: string;
  counterId: string;
}
