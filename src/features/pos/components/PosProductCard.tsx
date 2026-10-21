"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/formatters";
import { PosProduct } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PosProductCardProps {
  product: PosProduct;
  onSelectProduct: (product: PosProduct) => void;
  onAddToCart: (product: PosProduct) => void;
}

/**
 * Product Card for POS catalog grid matching Figma node 3422:36302.
 */
export function PosProductCard({
  product,
  onSelectProduct,
  onAddToCart,
}: PosProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="bg-card rounded-[20px] p-3 border border-default/50 shadow-xs flex flex-col gap-2.5 transition-all hover:border-primary/40 hover:shadow-sm cursor-pointer select-none group"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-hidden bg-subtle/40">
        {!imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-subtle/50 text-body gap-1.5 p-3">
            <Sparkles className="size-6 text-accent shrink-0" />
            <span className="font-heading font-medium text-xs text-heading text-center line-clamp-1">
              {product.name}
            </span>
            <span className="text-[10px] text-body uppercase tracking-wider">
              {product.fabric}
            </span>
          </div>
        )}

        {product.totalStock <= 3 && (
          <Badge
            variant="error"
            size="sm"
            className="absolute top-2 right-2 text-[10px] h-5 px-2 font-medium"
          >
            Only {product.totalStock} left
          </Badge>
        )}
      </div>

      {/* Title & Price Row */}
      <div className="flex items-start justify-between gap-1.5 min-w-0">
        <span className="font-sans font-medium text-xs sm:text-sm text-heading truncate">
          {product.name}
        </span>
        <span className="font-heading font-semibold text-xs sm:text-sm text-heading shrink-0">
          {formatPKR(product.price)}
        </span>
      </div>

      {/* Color Swatches & Available Sizes */}
      <div className="flex items-center justify-between gap-1 text-body">
        {/* Swatches */}
        <div className="flex items-center gap-1 shrink-0">
          {product.colorSwatches.map((colorClass, idx) => (
            <span
              key={idx}
              className={`size-2.5 sm:size-3 rounded-full border border-card shadow-xs ${colorClass}`}
              title={product.colorNames[idx] || "Color"}
            />
          ))}
        </div>

        {/* Sizes */}
        <span className="font-sans text-[11px] sm:text-xs text-body truncate">
          {product.availableSizes.join(" · ")}
        </span>
      </div>

      {/* Add To Cart CTA */}
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        className="w-full rounded-full h-8 sm:h-9 text-xs font-sans font-medium mt-0.5"
      >
        Add To Cart
      </Button>
    </div>
  );
}
