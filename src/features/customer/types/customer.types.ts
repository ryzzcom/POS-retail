export interface CustomerUser {
  id: string;
  phoneNumber: string;
  fullName: string | null;
  avatarUrl: string | null;
  preferredSizes: string[];
}

export interface StoreMembership {
  storeId: string;
  storeName: string;
  storeSlug: string;
  storeTagline?: string;
  storePhone?: string;
  storeAddress?: string;
  storeCity?: string;
  loyaltyPoints: number;
  tryOnCredits: number;
  khataBalance: number;
  totalOrdersCount: number;
  lastPurchaseDate?: string;
}

export interface CustomerProfileResponse {
  user: CustomerUser;
  memberships: StoreMembership[];
}

export interface CustomerStore {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  storeCategory: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  headerBusinessName: string | null;
  branchAddressLine?: string | null;
  phoneOnReceipt?: string | null;
  instagramWebsiteHandle?: string | null;
  exchangePolicyFooter?: string | null;
  tryOnSignupCredits: number;
  tryOnFirstPurchaseCredits?: number;
  tryOnRepeatPurchaseCredits?: number;
}

export interface CustomerProductVariant {
  id: string;
  sku: string;
  barcode: string | null;
  color: string;
  size: string;
  price: number;
}

export interface CustomerProduct {
  id: string;
  name: string;
  code: string;
  description: string | null;
  category: string;
  brand: string;
  season: string;
  price: number;
  image: string;
  colorNames: string[];
  colorSwatches: string[];
  availableSizes: string[];
  variants: CustomerProductVariant[];
}

export interface OutfitSet {
  id: string;
  title: string;
  occasion: string;
  tagline?: string;
  mood?: string;
  description?: string;
  items?: CustomerProduct[];
  products?: CustomerProduct[];
  totalPrice: number;
}

export interface VirtualTryOnJob {
  id: string;
  jobId?: string;
  customerUserId?: string;
  storeId?: string;
  storeName?: string;
  productId: string;
  productName: string;
  productImage: string;
  selectedColor: string | null;
  userPhotoUrl: string;
  resultImageUrl: string;
  stylingAdvice: string | null;
  remainingCredits: number;
  expiresAt: string;
  createdAt: string;
}

export interface GiftOrder {
  id: string;
  redemptionCode: string;
  senderName: string;
  recipientName: string;
  recipientPhone: string;
  giftMessage: string;
  deliveryMethod: "STORE_PICKUP" | "HOME_DELIVERY";
  status: "PENDING" | "CLAIMED" | "EXCHANGED";
  productId: string;
  productName: string;
  productImage: string;
  selectedSize: string;
  selectedColor: string;
  storeName: string;
  storeSlug: string;
  storeAddress?: string;
  storePhone?: string;
  claimedAt?: string;
  createdAt: string;
}

export interface DigitalReceiptItem {
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DigitalReceipt {
  orderNumber: string;
  date: string;
  storeName: string;
  storeSlug: string;
  storeAddress: string;
  storePhone: string;
  itemsCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  loyaltyPointsEarned: number;
  tryOnCreditsAwarded: number;
  exchangePolicy: string;
  items: DigitalReceiptItem[];
}
