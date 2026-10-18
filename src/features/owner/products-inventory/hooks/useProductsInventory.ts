"use client";

import * as React from "react";
import {
  ProductItem,
  ProductCategory,
  ProductStatus,
  ProductSortOption,
  InventoryTab,
  ProductsInventorySummary,
  ProductVariant,
} from "../types/products-inventory.types";
import { PRODUCTS_INVENTORY_MOCK_DATA } from "../constants/products-inventory-mock";
import { ProductFormValues, AdjustStockFormValues } from "../schemas/products-inventory.schemas";

export function useProductsInventory() {
  // Master products list state
  const [products, setProducts] = React.useState<ProductItem[]>(
    PRODUCTS_INVENTORY_MOCK_DATA
  );

  // Tabs
  const [activeTab, setActiveTab] = React.useState<InventoryTab>("catalog");

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [category, setCategory] = React.useState<ProductCategory>("all");
  const [status, setStatus] = React.useState<ProductStatus>("active");
  const [sortBy, setSortBy] = React.useState<ProductSortOption>("name_asc");
  const [lowStockOnly, setLowStockOnly] = React.useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 8;

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = React.useState(false);
  const [productToEdit, setProductToEdit] = React.useState<ProductItem | null>(null);

  const [adjustStockModal, setAdjustStockModal] = React.useState<{
    open: boolean;
    product: ProductItem | null;
    variant: ProductVariant | null;
  }>({
    open: false,
    product: null,
    variant: null,
  });

  const [printLabelModal, setPrintLabelModal] = React.useState<{
    open: boolean;
    product: ProductItem | null;
    variant: ProductVariant | null;
  }>({
    open: false,
    product: null,
    variant: null,
  });

  // Calculate dynamic header summary (8 active products · 199 units on hand · valued at Rs. 406,860 cost)
  const summary: ProductsInventorySummary = React.useMemo(() => {
    const activeProducts = products.filter((p) => p.status === "active");
    const activeProductsCount = activeProducts.length;
    let totalUnitsOnHand = 0;
    let inventoryValuationCost = 0;

    activeProducts.forEach((p) => {
      totalUnitsOnHand += p.onHand;
      inventoryValuationCost += p.costPrice * p.onHand;
    });

    return {
      activeProductsCount,
      totalUnitsOnHand,
      inventoryValuationCost,
    };
  }, [products]);

  // Reset pagination to 1 whenever any filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, status, sortBy, lowStockOnly]);

  // Filtered & sorted products
  const filteredProducts = React.useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(query);
          const matchSku = p.sku.toLowerCase().includes(query);
          const matchCollection = p.collection.toLowerCase().includes(query);
          const matchFabric = p.fabric.toLowerCase().includes(query);
          const matchVariant = p.variants.some(
            (v) =>
              v.sku.toLowerCase().includes(query) ||
              v.barcode.toLowerCase().includes(query) ||
              v.color.toLowerCase().includes(query)
          );
          if (!matchName && !matchSku && !matchCollection && !matchFabric && !matchVariant) {
            return false;
          }
        }

        // Category filter
        if (category !== "all" && p.category !== category) {
          return false;
        }

        // Status filter
        if (status !== "all" && p.status !== status) {
          return false;
        }

        // Low stock filter
        if (lowStockOnly && p.lowStockVariantsCount === 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "stock_asc":
            return a.onHand - b.onHand;
          case "retail_desc":
            return b.retailPrice - a.retailPrice;
          case "name_asc":
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [products, searchQuery, category, status, sortBy, lowStockOnly]);

  // Paginated records
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Handler: Add or update product
  const handleSaveProduct = (values: ProductFormValues) => {
    if (productToEdit) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productToEdit.id) {
            const updatedVariants: ProductVariant[] = values.variants.map((v, i) => ({
              id: v.id || `var-${Date.now()}-${i}`,
              color: v.color,
              size: v.size,
              sku: v.sku,
              barcode: v.barcode || "",
              costPrice: v.costPrice,
              retailPrice: v.retailPrice,
              onHand: v.stock,
              reorderLevel: v.reorderLevel,
            }));

            const totalOnHand = updatedVariants.reduce((sum, v) => sum + v.onHand, 0);
            const lowStockCount = updatedVariants.filter(
              (v) => v.onHand <= v.reorderLevel
            ).length;
            const avgCost =
              updatedVariants.reduce((sum, v) => sum + v.costPrice, 0) /
              (updatedVariants.length || 1);
            const primaryPrice = updatedVariants[0]?.retailPrice || 0;
            const margin =
              primaryPrice > 0
                ? Math.round(((primaryPrice - avgCost) / primaryPrice) * 100)
                : 38;

            return {
              ...p,
              name: values.name,
              sku: values.designCode,
              category: values.category as ProductCategory,
              categoryLabel:
                values.category.charAt(0).toUpperCase() + values.category.slice(1),
              minPrice: values.minPrice || primaryPrice * 0.8,
              costPrice: Math.round(avgCost),
              retailPrice: primaryPrice,
              marginPercent: margin,
              onHand: totalOnHand,
              variantsCount: updatedVariants.length,
              lowStockVariantsCount: lowStockCount,
              variants: updatedVariants,
            };
          }
          return p;
        })
      );
      setProductToEdit(null);
    } else {
      const newVariants: ProductVariant[] = values.variants.map((v, i) => ({
        id: `var-${Date.now()}-${i}`,
        color: v.color,
        size: v.size,
        sku: v.sku,
        barcode: v.barcode || `896400${Math.floor(100000 + Math.random() * 900000)}`,
        costPrice: v.costPrice,
        retailPrice: v.retailPrice,
        onHand: v.stock,
        reorderLevel: v.reorderLevel,
      }));

      const totalOnHand = newVariants.reduce((sum, v) => sum + v.onHand, 0);
      const lowStockCount = newVariants.filter((v) => v.onHand <= v.reorderLevel).length;
      const primaryPrice = newVariants[0]?.retailPrice || 0;
      const avgCost =
        newVariants.reduce((sum, v) => sum + v.costPrice, 0) / (newVariants.length || 1);
      const margin =
        primaryPrice > 0
          ? Math.round(((primaryPrice - avgCost) / primaryPrice) * 100)
          : 38;

      const newProduct: ProductItem = {
        id: `prod-${Date.now()}`,
        name: values.name,
        sku: values.designCode,
        collection: values.collection || "Season 26",
        fabric: values.fabric || "Cotton",
        category: values.category as ProductCategory,
        categoryLabel:
          values.category.charAt(0).toUpperCase() + values.category.slice(1),
        status: "active",
        variantsCount: newVariants.length,
        lowStockVariantsCount: lowStockCount,
        onHand: totalOnHand,
        retailPrice: primaryPrice,
        minPrice: values.minPrice || primaryPrice * 0.8,
        costPrice: Math.round(avgCost),
        marginPercent: margin,
        variants: newVariants,
      };

      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  // Handler: Archive product
  const handleArchiveProduct = (product: ProductItem) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              status: p.status === "archived" ? "active" : "archived",
            }
          : p
      )
    );
  };

  // Handler: Adjust stock
  const handleConfirmStockAdjustment = (values: AdjustStockFormValues) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === values.productId) {
          const updatedVariants = p.variants.map((v) => {
            if (v.id === values.variantId) {
              let newStock = v.onHand;
              if (values.adjustmentType === "add") newStock += values.quantity;
              else if (values.adjustmentType === "subtract")
                newStock = Math.max(0, newStock - values.quantity);
              else if (values.adjustmentType === "set") newStock = values.quantity;

              return { ...v, onHand: newStock };
            }
            return v;
          });

          const totalOnHand = updatedVariants.reduce((sum, v) => sum + v.onHand, 0);
          const lowStockCount = updatedVariants.filter(
            (v) => v.onHand <= v.reorderLevel
          ).length;

          return {
            ...p,
            onHand: totalOnHand,
            lowStockVariantsCount: lowStockCount,
            variants: updatedVariants,
          };
        }
        return p;
      })
    );
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    const csvRows = [
      ["Product Name", "SKU", "Category", "On Hand", "Retail Price", "Cost Price", "Margin %"],
      ...filteredProducts.map((p) => [
        p.name,
        p.sku,
        p.categoryLabel,
        p.onHand,
        p.retailPrice,
        p.costPrice,
        `${p.marginPercent}%`,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.map((x) => `"${x}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `products-inventory-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    // Data
    products: paginatedProducts,
    allProductsCount: products.length,
    filteredTotalCount: filteredProducts.length,
    summary,

    // Active tab
    activeTab,
    setActiveTab,

    // Filters
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    status,
    setStatus,
    sortBy,
    setSortBy,
    lowStockOnly,
    setLowStockOnly,

    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,

    // Modals
    isImportModalOpen,
    setIsImportModalOpen,
    isNewProductModalOpen,
    setIsNewProductModalOpen,
    productToEdit,
    setProductToEdit,
    adjustStockModal,
    setAdjustStockModal,
    printLabelModal,
    setPrintLabelModal,

    // Actions
    handleSaveProduct,
    handleArchiveProduct,
    handleConfirmStockAdjustment,
    handleExportCSV,
  };
}
