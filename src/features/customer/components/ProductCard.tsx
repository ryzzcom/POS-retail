"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Gift, Heart, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/formatters";
import type { CustomerProduct } from "../types/customer.types";

interface ProductCardProps {
  product: CustomerProduct;
  storeSlug: string;
  onTryOn: (product: CustomerProduct) => void;
  onSendGift: (product: CustomerProduct) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export function ProductCard({
  product,
  storeSlug,
  onTryOn,
  onSendGift,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const [selectedColor, setSelectedColor] = React.useState<string>(
    product.colorNames[0] || "Standard"
  );

  return (
    <div className="bg-card rounded-[20px] border border-default/60 overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Product Image Stage */}
        <div className="relative aspect-[3/4] w-full bg-subtle overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted font-heading text-lg">
              {product.name.charAt(0)}
            </div>
          )}

          {/* Badges on Image */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            <Badge variant="neutral" className="bg-card/90 backdrop-blur-xs text-[10px] font-sans">
              {product.season || "SS26"}
            </Badge>
            <Badge variant="accent" className="text-[10px] font-sans">
              {product.category}
            </Badge>
          </div>

          {/* Wishlist Button */}
          {onToggleWishlist && (
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              className="absolute top-2.5 right-2.5 size-8 rounded-full bg-card/90 backdrop-blur-xs border border-default/50 flex items-center justify-center text-heading hover:text-status-error transition-colors z-10"
              title="Add to Wishlist"
            >
              <Heart
                className={`size-4 ${
                  isWishlisted ? "fill-status-error text-status-error" : ""
                }`}
              />
            </button>
          )}

          {/* Quick AI Try-On Hover Overlay Button */}
          <div className="absolute inset-x-3 bottom-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onTryOn(product)}
              className="w-full h-9 shadow-md text-xs font-medium backdrop-blur-xs"
            >
              <Sparkles className="size-3.5 mr-1 text-accent animate-pulse" />
              Try It On (AI)
            </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          <div>
            <span className="text-[11px] text-body font-sans uppercase tracking-wider">
              {product.brand}
            </span>
            <h4 className="font-heading font-medium text-heading text-sm line-clamp-1 mt-0.5 group-hover:text-primary transition-colors">
              {product.name}
            </h4>
            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="font-heading font-semibold text-heading text-base">
                {formatPKR(product.price)}
              </span>
              <span className="text-[11px] text-muted font-mono">{product.code}</span>
            </div>
          </div>

          {/* Color Chips */}
          {product.colorNames.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.colorNames.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`text-[10px] px-2 py-0.5 rounded-[6px] border transition-colors ${
                      isSelected
                        ? "bg-primary text-theme border-primary font-medium"
                        : "bg-theme text-body border-default/60 hover:border-default"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          )}

          {/* Available Sizes */}
          {product.availableSizes.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-body">
              <span className="text-muted">Sizes:</span>
              <span className="font-medium text-heading">
                {product.availableSizes.join(" · ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-4 pb-4 pt-1 flex items-center gap-2 border-t border-default/40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSendGift(product)}
          className="flex-1 text-xs h-8"
        >
          <Gift className="size-3.5 mr-1 text-status-warning" />
          Send Gift
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onTryOn(product)}
          className="flex-1 text-xs h-8"
        >
          <Sparkles className="size-3.5 mr-1 text-accent" />
          Try On
        </Button>
      </div>
    </div>
  );
}
