"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Sparkles,
  Users,
  Compass,
  Search,
  Gift,
  Shirt,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { CustomerHeader } from "@/features/customer/components/CustomerHeader";
import { ProductCard } from "@/features/customer/components/ProductCard";
import { VirtualTryOnStudio } from "@/features/customer/components/VirtualTryOnStudio";
import { SendGiftModal } from "@/features/customer/components/SendGiftModal";
import { OutfitCuratorModal } from "@/features/customer/components/OutfitCuratorModal";
import { BestieInviteModal } from "@/features/customer/components/BestieInviteModal";
import { customerService } from "@/features/customer/services/customer.service";
import { useCustomerAuth } from "@/features/customer/hooks/useCustomerAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  CustomerStore,
  CustomerProduct,
  OutfitSet,
} from "@/features/customer/types/customer.types";

export default function StorefrontPage() {
  const params = useParams();
  const storeSlug = params?.storeSlug as string;

  const { memberships } = useCustomerAuth();

  const [store, setStore] = React.useState<CustomerStore | null>(null);
  const [products, setProducts] = React.useState<CustomerProduct[]>([]);
  const [outfits, setOutfits] = React.useState<OutfitSet[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Active Modals State
  const [tryOnProduct, setTryOnProduct] = React.useState<CustomerProduct | null>(null);
  const [isTryOnOpen, setIsTryOnOpen] = React.useState<boolean>(false);
  const [giftProduct, setGiftProduct] = React.useState<CustomerProduct | null>(null);
  const [isGiftOpen, setIsGiftOpen] = React.useState<boolean>(false);
  const [isOutfitCuratorOpen, setIsOutfitCuratorOpen] = React.useState<boolean>(false);
  const [isBestieOpen, setIsBestieOpen] = React.useState<boolean>(false);
  const [wishlistIds, setWishlistIds] = React.useState<Set<string>>(new Set());

  // Load Store, Catalog & Outfits
  React.useEffect(() => {
    if (!storeSlug) return;

    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        const [storeData, catalogData, outfitsData] = await Promise.all([
          customerService.getStoreBySlug(storeSlug),
          customerService.getStoreCatalog(storeSlug),
          customerService.getStoreOutfits(storeSlug).catch(() => []),
        ]);

        if (isMounted) {
          setStore(storeData);
          setProducts(catalogData);
          setOutfits(outfitsData);
        }
      } catch (err) {
        console.error("Failed to load store data", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [storeSlug]);

  // Categories list
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        selectedCategory === "all" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const handleToggleWishlist = async (productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
    try {
      await customerService.toggleWishlist(storeSlug, productId, true);
    } catch {}
  };

  const handleOpenTryOn = (product?: CustomerProduct) => {
    setTryOnProduct(product || products[0] || null);
    setIsTryOnOpen(true);
  };

  const handleOpenGift = (product: CustomerProduct) => {
    setGiftProduct(product);
    setIsGiftOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader currentStore={store} activeSlug={storeSlug} />

      <div className="max-w-5xl mx-auto px-4 py-6 w-full space-y-6">
        {/* Boutique Lookbook Hero Banner */}
        <div className="relative rounded-[24px] bg-gradient-to-r from-primary via-[#233527] to-[#121c15] text-dark-primary p-6 sm:p-8 overflow-hidden shadow-md border border-border-dark">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="accent" className="text-[11px] font-sans">
                {store?.storeCategory || "Luxury Fashion Pret"}
              </Badge>
              <span className="text-dark-secondary text-xs flex items-center gap-1">
                <MapPin className="size-3 text-accent" />
                {store?.city || "Karachi, Pakistan"}
              </span>
            </div>

            <h1 className="font-heading font-bold text-2xl sm:text-4xl text-dark-primary tracking-tight">
              {store?.name || "Exclusive Menswear & Pret"}
            </h1>

            <p className="text-xs sm:text-sm text-dark-secondary font-sans leading-relaxed">
              {store?.tagline ||
                "Explore heavyweight fleece hoodies, tailored jackets, and pure cotton shirts. Try any item virtually before stepping into our counter."}
            </p>

            {/* Interactive Feature Shortcuts Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Button
                variant="accent"
                size="sm"
                onClick={() => handleOpenTryOn()}
                className="text-xs font-semibold h-9 shadow-sm"
              >
                <Sparkles className="size-3.5 mr-1.5 animate-pulse" />
                Virtual Try-On AI Studio
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOutfitCuratorOpen(true)}
                className="text-xs h-9 bg-theme/10 hover:bg-theme/20 text-dark-primary border-theme/20"
              >
                <Compass className="size-3.5 mr-1.5 text-accent" />
                Choose My Outfit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBestieOpen(true)}
                className="text-xs h-9 bg-theme/10 hover:bg-theme/20 text-dark-primary border-theme/20"
              >
                <Users className="size-3.5 mr-1.5 text-status-warning" />
                Bring Your Bestie 👯
              </Button>
            </div>
          </div>
        </div>

        {/* Modal: Virtual Try-On Studio (when opened from banner or card) */}
        {isTryOnOpen && store && (
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
                initialProduct={tryOnProduct}
                allProducts={products}
                onClose={() => setIsTryOnOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-[12px] whitespace-nowrap transition-colors border ${
                    selectedCategory === cat
                      ? "bg-primary text-theme border-primary font-medium shadow-xs"
                      : "bg-card text-body border-default/60 hover:text-heading"
                  }`}
                >
                  {cat === "all" ? "All Garments" : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="size-4 text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search styles, fabrics, SKUs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-[12px] bg-card border border-default/70 text-xs text-heading focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-body font-sans px-1">
            <span>
              Showing <strong>{filteredProducts.length}</strong> items in collection
            </span>
            <span className="text-[11px] text-muted hidden sm:inline">
              Earn +10 AI Credits on each completed purchase
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-[20px] bg-card border border-default/40 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-[22px] border border-default/50 space-y-2">
            <Shirt className="size-10 text-muted mx-auto" />
            <h3 className="font-heading font-semibold text-heading text-base">
              No garments found
            </h3>
            <p className="text-xs text-body">
              Try selecting a different category or clearing your search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                storeSlug={storeSlug}
                onTryOn={(p) => handleOpenTryOn(p)}
                onSendGift={(p) => handleOpenGift(p)}
                onToggleWishlist={(id) => handleToggleWishlist(id)}
                isWishlisted={wishlistIds.has(prod.id)}
              />
            ))}
          </div>
        )}

        {/* Boutique Contact & Policy Footer */}
        {store && (
          <div className="p-5 rounded-[20px] bg-theme border border-default/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-body">
            <div className="flex items-start gap-2.5">
              <MapPin className="size-4 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-heading">Boutique Address</p>
                <p className="text-[11px] mt-0.5">{store.address || store.city}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="size-4 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-heading">Official Support</p>
                <p className="text-[11px] mt-0.5">{store.phone || "+92 300 1234567"}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="size-4 text-status-success shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-heading">Exchange Policy</p>
                <p className="text-[11px] mt-0.5">
                  {store.exchangePolicyFooter ||
                    "Exchange within 7 days with original receipt. No cash refunds."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {store && (
        <>
          <SendGiftModal
            isOpen={isGiftOpen}
            onClose={() => setIsGiftOpen(false)}
            product={giftProduct}
            store={store}
          />

          <OutfitCuratorModal
            isOpen={isOutfitCuratorOpen}
            onClose={() => setIsOutfitCuratorOpen(false)}
            outfits={outfits}
            store={store}
            onSelectProductForTryOn={(p) => handleOpenTryOn(p)}
          />

          <BestieInviteModal
            isOpen={isBestieOpen}
            onClose={() => setIsBestieOpen(false)}
            store={store}
          />
        </>
      )}
    </div>
  );
}
