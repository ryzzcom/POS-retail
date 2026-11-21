import { apiClient } from "@/lib/api-client";
import type {
  ProductItem,
  ProductsInventorySummary,
  ProductCategory,
} from "../types/products-inventory.types";

interface BackendProductVariant {
  id: string;
  colorSizeLabel: string;
  color: string;
  size: string;
  sku: string;
  barcode: string;
  costPrice: number;
  retailPrice: number;
  reorderLevel: number;
  stockOnHand: number;
  isLowStock: boolean;
}

interface BackendProduct {
  id: string;
  name: string;
  styleCode: string | null;
  subCategory: string | null;
  brand: string | null;
  season: string | null;
  subtitle: string;
  category: {
    id: string;
    name: string;
  } | null;
  variantsCount: number;
  lowStockCount: number;
  totalOnHand: number;
  retailPrice: number;
  minSellingPrice: number;
  marginPct: number;
  isArchived: boolean;
  imageUrl: string | null;
  variants: BackendProductVariant[];
}

interface BackendCatalogResponse {
  summary: {
    activeProductsCount: number;
    totalUnitsOnHand: number;
    totalValuationCost: number;
    lowStockVariantsCount: number;
  };
  items: BackendProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function mapCategory(name?: string): ProductCategory {
  if (!name) return "pret";
  const lower = name.toLowerCase();
  if (lower.includes("unstitched")) return "unstitched";
  if (lower.includes("formal")) return "formal";
  if (lower.includes("kids")) return "kids";
  if (lower.includes("bottom")) return "bottoms";
  if (lower.includes("men")) return "men";
  if (lower.includes("access")) return "accessories";
  return "pret";
}

function mapProduct(p: BackendProduct): ProductItem {
  const firstVariant = p.variants?.[0];
  const derivedCostPrice = firstVariant?.costPrice || 0;

  return {
    id: p.id,
    name: p.name,
    sku: p.styleCode || firstVariant?.sku || "SKU-PROD",
    collection: p.season || "Current Season",
    fabric: p.brand || p.subCategory || "Boutique Fabric",
    category: mapCategory(p.category?.name),
    categoryLabel: p.category?.name || "Apparel",
    status: p.isArchived ? "archived" : "active",
    variantsCount: p.variantsCount || p.variants?.length || 0,
    lowStockVariantsCount: p.lowStockCount || 0,
    onHand: p.totalOnHand ?? 0,
    retailPrice: p.retailPrice,
    minPrice: p.minSellingPrice || p.retailPrice,
    costPrice: derivedCostPrice,
    marginPercent: p.marginPct || 0,
    variants: (p.variants || []).map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size || "Free Size",
      color: v.color || "Standard",
      barcode: v.barcode,
      onHand: v.stockOnHand,
      reorderLevel: v.reorderLevel,
      retailPrice: v.retailPrice,
      costPrice: v.costPrice,
    })),
  };
}

export const productsInventoryService = {
  /**
   * 1. GET /api/v1/catalog/products
   */
  getProducts: async (params?: {
    search?: string;
    categoryId?: string;
    isArchived?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ summary: ProductsInventorySummary; items: ProductItem[] }> => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.categoryId) query.set("categoryId", params.categoryId);
    if (params?.isArchived !== undefined) query.set("isArchived", String(params.isArchived));
    if (params?.page) query.set("page", String(params.page));
    query.set("limit", String(params?.limit || 50));

    const res = await apiClient.get<BackendCatalogResponse>(
      `/catalog/products?${query.toString()}`
    );

    return {
      summary: {
        activeProductsCount: res.summary.activeProductsCount,
        totalUnitsOnHand: res.summary.totalUnitsOnHand,
        inventoryValuationCost: res.summary.totalValuationCost,
      },
      items: (res.items || []).map(mapProduct),
    };
  },

  /**
   * 2. GET /api/v1/catalog/products/:id
   */
  getProductById: async (id: string): Promise<ProductItem | null> => {
    try {
      const res = await apiClient.get<BackendProduct>(`/catalog/products/${id}`);
      return mapProduct(res);
    } catch {
      return null;
    }
  },

  /**
   * 3. POST /api/v1/catalog/products
   */
  createProduct: async (data: Record<string, unknown>): Promise<ProductItem> => {
    const res = await apiClient.post<BackendProduct>("/catalog/products", data);
    return mapProduct(res);
  },

  /**
   * 4. PATCH /api/v1/catalog/products/:id
   */
  updateProduct: async (id: string, data: Record<string, unknown>): Promise<ProductItem> => {
    const res = await apiClient.patch<BackendProduct>(`/catalog/products/${id}`, data);
    return mapProduct(res);
  },

  /**
   * 5. PATCH /api/v1/catalog/products/:id/archive
   */
  archiveProduct: async (id: string, archive: boolean = true): Promise<void> => {
    await apiClient.patch(`/catalog/products/${id}/archive`, { archive });
  },

  /**
   * 6. POST /api/v1/inventory/adjust
   */
  adjustStock: async (data: {
    variantId: string;
    newQuantity?: number;
    delta?: number;
    reason: string;
  }): Promise<void> => {
    await apiClient.post("/inventory/adjust", data);
  },

  /**
   * 7. GET /api/v1/catalog/categories
   */
  getCategories: async (): Promise<Array<{ id: string; name: string }>> => {
    return apiClient.get<Array<{ id: string; name: string }>>("/catalog/categories");
  },
};
