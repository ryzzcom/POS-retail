"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { PosCategory, PosProduct, ProductVariant } from "../types";
import { POS_CATEGORY_OPTIONS } from "../constants";
import { PosProductCard } from "./PosProductCard";
import { PosVariantModal } from "./PosVariantModal";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedFilter } from "@/components/ui/segmented-filter";

export interface PosProductCatalogProps {
  products: PosProduct[];
  onAddToCart: (product: PosProduct, variant?: ProductVariant) => void;
}

/**
 * Left Panel Product Catalog & Barcode Scanner for POS Terminal.
 * Matches Figma nodes 3422:36302 & 3432:37518.
 */
export function PosProductCatalog({
  products,
  onAddToCart,
}: PosProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<PosCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [variantModalProduct, setVariantModalProduct] = useState<PosProduct | null>(null);

  // 1. Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category Match
      const matchesCategory =
        selectedCategory === "all" || prod.category === selectedCategory;

      // Search Match
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.code.toLowerCase().includes(q) ||
        prod.fabric.toLowerCase().includes(q) ||
        prod.variants.some((v) => v.sku.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // 2. Barcode scanner onEnter quick add
  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      // Look for exact SKU match in variants
      for (const prod of products) {
        const matchedVariant = prod.variants.find(
          (v) => v.sku.toLowerCase() === q
        );
        if (matchedVariant) {
          onAddToCart(prod, matchedVariant);
          setSearchQuery("");
          return;
        }
      }

      // If single product matches exactly by code or name
      if (filteredProducts.length === 1) {
        const prod = filteredProducts[0];
        if (prod.variants.length > 1) {
          setVariantModalProduct(prod);
        } else {
          onAddToCart(prod, prod.variants[0]);
        }
        setSearchQuery("");
      }
    }
  };

  const handleCardClick = (product: PosProduct) => {
    if (product.variants.length > 1) {
      setVariantModalProduct(product);
    } else {
      onAddToCart(product, product.variants[0]);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-3 sm:gap-3.5 min-w-0 h-full overflow-hidden select-none">
      {/* 1. Barcode Scanner & Search Bar */}
      <div className="w-full">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyDown={handleBarcodeKeyDown}
          placeholder="Scan barcode, or type name / design code / SKU and press Enter"
          className="h-11 sm:h-12 text-xs sm:text-sm pl-11 shadow-xs"
          containerClassName="w-full"
          aria-label="Scan barcode or search products"
        />
      </div>

      {/* 2. Category Filter Strip via SegmentedFilter */}
      <div className="w-full shrink-0 overflow-x-auto no-scrollbar">
        <SegmentedFilter
          options={POS_CATEGORY_OPTIONS}
          value={selectedCategory}
          onChange={(val) => setSelectedCategory(val as PosCategory)}
          sizeVariant="default"
          className="w-max min-w-full bg-card border-default/60 p-1"
          aria-label="Product categories"
        />
      </div>

      {/* 3. Product Catalog Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <PosProductCard
                key={product.id}
                product={product}
                onSelectProduct={handleCardClick}
                onAddToCart={handleCardClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center gap-2 p-6 rounded-[20px] bg-card/60 border border-dashed border-default">
            <Search className="size-8 text-muted" />
            <p className="font-heading font-medium text-sm text-heading">
              No products found
            </p>
            <p className="font-sans text-xs text-body">
              Try adjusting your barcode scanner, search term, or category filter.
            </p>
          </div>
        )}
      </div>

      {/* 4. Variant Selection Modal */}
      <PosVariantModal
        product={variantModalProduct}
        open={Boolean(variantModalProduct)}
        onClose={() => setVariantModalProduct(null)}
        onSelectVariant={(prod, variant) => onAddToCart(prod, variant)}
      />
    </div>
  );
}
