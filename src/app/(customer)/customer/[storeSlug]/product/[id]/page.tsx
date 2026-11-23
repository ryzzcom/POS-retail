"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Gift,
  Heart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { CustomerHeader } from "@/features/customer/components/CustomerHeader";
import { VirtualTryOnStudio } from "@/features/customer/components/VirtualTryOnStudio";
import { SendGiftModal } from "@/features/customer/components/SendGiftModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/formatters";
import { customerService } from "@/features/customer/services/customer.service";
import type { CustomerStore, CustomerProduct } from "@/features/customer/types/customer.types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params?.storeSlug as string;
  const productId = params?.id as string;

  const [store, setStore] = React.useState<CustomerStore | null>(null);
  const [product, setProduct] = React.useState<CustomerProduct | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string>("");
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isTryOnOpen, setIsTryOnOpen] = React.useState(false);
  const [isGiftOpen, setIsGiftOpen] = React.useState(false);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  React.useEffect(() => {
    if (!storeSlug || !productId) return;

    async function load() {
      try {
        setIsLoading(true);
        const [storeData, catalog] = await Promise.all([
          customerService.getStoreBySlug(storeSlug),
          customerService.getStoreCatalog(storeSlug),
        ]);
        setStore(storeData);
        const found = catalog.find((p) => p.id === productId);
        if (found) {
          setProduct(found);
          setSelectedColor((found.colorNames || [])[0] || "Standard");
          setSelectedSize((found.availableSizes || [])[0] || "M");
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [storeSlug, productId]);

  const handleToggleWishlist = async () => {
    if (!product) return;
    setIsWishlisted(!isWishlisted);
    try {
      await customerService.toggleWishlist(storeSlug, product.id, true);
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader currentStore={store} activeSlug={storeSlug} />

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 w-full space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-body">
          <Link
            href={`/customer/${storeSlug}`}
            className="inline-flex items-center gap-1 hover:text-heading transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to {store?.name || "Catalog"}</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[3/4] rounded-[24px] bg-card border border-default/40 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-card rounded-md animate-pulse" />
              <div className="h-6 w-1/3 bg-card rounded-md animate-pulse" />
              <div className="h-24 bg-card rounded-md animate-pulse" />
            </div>
          </div>
        ) : !product ? (
          <div className="text-center py-16 p-6 rounded-[22px] bg-card border border-default/50 space-y-2">
            <p className="font-heading font-medium text-heading">Product Not Found</p>
            <Link href={`/customer/${storeSlug}`}>
              <Button variant="outline" size="sm" className="text-xs">
                Back to Boutique
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Product Image Viewer */}
            <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden bg-subtle border border-default/60 shadow-xs">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-heading text-4xl text-muted font-bold">
                  {product.name.charAt(0)}
                </div>
              )}

              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <Badge variant="accent" className="text-xs font-sans">
                  {product.category}
                </Badge>
                <Badge variant="neutral" className="text-xs font-sans bg-card/90">
                  {product.season || "SS26"}
                </Badge>
              </div>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 size-10 rounded-full bg-card/90 backdrop-blur-xs border border-default/50 flex items-center justify-center text-heading hover:text-status-error transition-colors"
                title="Save to Wishlist"
              >
                <Heart
                  className={`size-5 ${
                    isWishlisted ? "fill-status-error text-status-error" : ""
                  }`}
                />
              </button>
            </div>

            {/* Product Meta & Actions */}
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-body font-sans font-medium">
                  {product.brand}
                </span>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-heading mt-1">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-heading font-bold text-2xl text-heading">
                    {formatPKR(product.price)}
                  </span>
                  <span className="text-xs font-mono text-muted bg-theme px-2 py-0.5 rounded-[6px] border border-default/50">
                    {product.code}
                  </span>
                </div>
              </div>

              {product.description && (
                <p className="text-xs sm:text-sm text-body font-sans leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Color Swatches */}
              {(product.colorNames || []).length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-heading font-medium text-heading block">
                    Available Colors: <span className="font-bold">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(product.colorNames || []).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`text-xs px-3 py-1.5 rounded-[10px] border transition-all ${
                          selectedColor === color
                            ? "bg-primary text-theme border-primary font-medium shadow-xs"
                            : "bg-card text-body border-default/60 hover:border-default"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {(product.availableSizes || []).length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-heading font-medium text-heading block">
                    Available Sizes: <span className="font-bold">{selectedSize}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(product.availableSizes || []).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`size-10 rounded-[10px] border flex items-center justify-center text-xs font-heading transition-all ${
                          selectedSize === size
                            ? "bg-primary text-theme border-primary font-bold shadow-xs"
                            : "bg-card text-body border-default/60 hover:border-default"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs: Try-On AI & Send Gift */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsTryOnOpen(true)}
                  className="w-full h-12 text-sm shadow-md"
                >
                  <Sparkles className="size-4 mr-2 text-accent animate-pulse" />
                  Try It On Virtually with AI (1 Credit)
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsGiftOpen(true)}
                  className="w-full h-11 text-xs"
                >
                  <Gift className="size-4 mr-2 text-status-warning" />
                  Send as a Surprise Gift (Secret Pricing)
                </Button>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-default/40 text-xs text-body">
                <div className="flex items-center gap-2">
                  <RotateCcw className="size-4 text-accent shrink-0" />
                  <span>7-Day In-Store Exchange</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-status-success shrink-0" />
                  <span>100% Genuine Apparel</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Virtual Try-On Studio */}
      {isTryOnOpen && store && product && (
        <div className="fixed inset-0 z-50 bg-heading/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTryOnOpen(false)}
                className="bg-card text-heading text-xs"
              >
                Close Studio ✕
              </Button>
            </div>
            <VirtualTryOnStudio
              store={store}
              initialProduct={product}
              onClose={() => setIsTryOnOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Modal: Send Gift */}
      {store && product && (
        <SendGiftModal
          isOpen={isGiftOpen}
          onClose={() => setIsGiftOpen(false)}
          product={product}
          store={store}
        />
      )}
    </div>
  );
}
