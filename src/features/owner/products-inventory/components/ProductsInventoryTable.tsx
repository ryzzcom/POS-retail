"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/data-display/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPKR } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ProductItem, ProductVariant } from "../types/products-inventory.types";
import { ProductVariantSubtable } from "./ProductVariantSubtable";

interface ProductsInventoryTableProps {
  products: ProductItem[];
  isLoading?: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onEditProduct: (product: ProductItem) => void;
  onArchiveProduct: (product: ProductItem) => void;
  onAdjustStock?: (product: ProductItem, variant: ProductVariant) => void;
  onPrintLabels?: (product: ProductItem, variant: ProductVariant) => void;
  onViewLedger?: (product: ProductItem, variant: ProductVariant) => void;
  className?: string;
}

export function ProductsInventoryTable({
  products,
  isLoading = false,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onEditProduct,
  onArchiveProduct,
  onAdjustStock,
  onPrintLabels,
  onViewLedger,
  className,
}: ProductsInventoryTableProps) {
  // Track expanded product IDs
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

  // Track selected product IDs for bulk actions
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const toggleExpand = (productId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(products.map((p) => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectOne = (productId: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });
  };

  const isAllSelected =
    products.length > 0 && products.every((p) => selectedIds.has(p.id));
  const isIndeterminate = selectedIds.size > 0 && !isAllSelected;

  // Configure Columns matching Figma Node 3386:17827 & Component 5
  const columns: ColumnDef<ProductItem>[] = [
    {
      id: "select_expand",
      width: "60px",
      header: (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={(e) => toggleSelectAll(e.target.checked)}
            id="select-all-products"
            aria-label="Select all products"
          />
        </div>
      ),
      cell: (product) => {
        const isExpanded = expandedIds.has(product.id);
        const isSelected = selectedIds.has(product.id);

        return (
          <div className="flex items-center gap-2.5">
            <Checkbox
              checked={isSelected}
              onChange={(e) => toggleSelectOne(product.id, e.target.checked)}
              id={`select-product-${product.id}`}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(product.id);
              }}
              className="p-1 rounded hover:bg-subtle/50 transition-transform cursor-pointer"
              aria-label={isExpanded ? "Collapse variants" : "Expand variants"}
            >
              <Play
                className={cn(
                  "size-3 fill-heading text-heading transition-transform duration-150",
                  isExpanded ? "rotate-90" : "rotate-0"
                )}
              />
            </button>
          </div>
        );
      },
    },
    {
      id: "product",
      header: "Product",
      cell: (product) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-sans font-medium text-sm text-heading leading-snug">
            {product.name}
          </span>
          <span className="font-sans text-xs text-body leading-tight">
            {product.sku} • {product.collection} • {product.fabric}
          </span>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      cell: (product) => (
        <span className="font-sans text-sm text-heading capitalize">
          {product.categoryLabel || product.category}
        </span>
      ),
    },
    {
      id: "variants",
      header: "Variants",
      align: "center",
      cell: (product) => (
        <div className="flex flex-col items-center gap-1">
          <span className="font-sans text-sm text-heading">
            {product.variantsCount}
          </span>
          {product.lowStockVariantsCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-2 rounded-full border border-status-warning text-status-warning font-sans text-xs font-medium bg-status-warning-bg/40 leading-none">
              {product.lowStockVariantsCount}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "onHand",
      header: "On hand",
      align: "center",
      cell: (product) => (
        <span className="font-sans text-sm text-heading">
          {product.onHand}
        </span>
      ),
    },
    {
      id: "retail",
      header: "Retail",
      cell: (product) => (
        <span className="font-sans text-sm text-heading">
          {formatPKR(product.retailPrice)}
        </span>
      ),
    },
    {
      id: "minPrice",
      header: "Min. price",
      cell: (product) => (
        <span className="font-sans text-sm text-heading">
          {formatPKR(product.minPrice)}
        </span>
      ),
    },
    {
      id: "margin",
      header: "Margin",
      cell: (product) => (
        <span className="font-sans text-sm text-heading">
          {product.marginPercent}%
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      align: "right",
      cell: (product) => (
        <div className="flex items-center justify-end gap-3.5 whitespace-nowrap">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            className="font-sans font-medium text-xs sm:text-sm text-heading hover:underline cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onArchiveProduct(product);
            }}
            className="font-sans font-normal text-xs sm:text-sm text-body hover:text-heading hover:underline cursor-pointer"
          >
            Archive
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <DataTable
      data={products}
      columns={columns}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      skeletonRows={pageSize}
      className={className}
      isRowExpanded={(item) => expandedIds.has(item.id)}
      renderExpandedRow={(item) => (
        <div className="py-2 pl-6 sm:pl-9">
          <ProductVariantSubtable
            product={item}
            onAdjustStock={onAdjustStock}
            onPrintLabels={onPrintLabels}
            onViewLedger={onViewLedger}
          />
        </div>
      )}
      pagination={{
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        onPageChange,
        itemLabel: "products",
      }}
    />
  );
}
