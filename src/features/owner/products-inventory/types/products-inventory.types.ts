export type ProductCategory =
  | "all"
  | "unstitched"
  | "pret"
  | "formal"
  | "kids"
  | "bottoms"
  | "men"
  | "accessories";

export type ProductStatus = "all" | "active" | "archived" | "draft";

export type ProductSortOption =
  | "name_asc"
  | "name_desc"
  | "stock_asc"
  | "retail_desc";

export type InventoryTab = "catalog" | "stocktake" | "ledger";

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  barcode: string;
  onHand: number;
  reorderLevel: number;
  retailPrice: number;
  costPrice: number;
}

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  collection: string;
  fabric: string;
  category: ProductCategory;
  categoryLabel: string;
  status: ProductStatus;
  variantsCount: number;
  lowStockVariantsCount: number;
  onHand: number;
  retailPrice: number;
  minPrice: number;
  costPrice: number;
  marginPercent: number;
  variants: ProductVariant[];
}

export interface ProductsInventorySummary {
  activeProductsCount: number;
  totalUnitsOnHand: number;
  inventoryValuationCost: number;
}

export interface ProductsInventoryFilterState {
  searchQuery: string;
  category: ProductCategory;
  status: ProductStatus;
  sortBy: ProductSortOption;
  lowStockOnly: boolean;
  activeTab: InventoryTab;
}
