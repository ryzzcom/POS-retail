"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Compass } from "lucide-react";
import { formatPKR } from "@/lib/formatters";
import type { CustomerProduct, CustomerStore, OutfitSet } from "../types/customer.types";

interface OutfitCuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: OutfitSet[];
  store?: CustomerStore | null;
  onSelectProductForTryOn: (product: CustomerProduct) => void;
}

const OCCASIONS = [
  { id: "all", label: "All Looks" },
  { id: "casual", label: "Casual Streetwear" },
  { id: "formal", label: "Evening Formal" },
  { id: "resort", label: "Resort & Summer" },
];

export function OutfitCuratorModal({
  isOpen,
  onClose,
  outfits = [],
  store,
  onSelectProductForTryOn,
}: OutfitCuratorModalProps) {
  const [selectedOccasion, setSelectedOccasion] = React.useState<string>("all");

  const filteredOutfits = React.useMemo(() => {
    if (!outfits || !Array.isArray(outfits)) return [];
    if (selectedOccasion === "all") return outfits;
    return outfits.filter(
      (o) => o.occasion?.toLowerCase()?.includes(selectedOccasion.toLowerCase())
    );
  }, [outfits, selectedOccasion]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Choose My Outfit"
      subtitle={`Curated styling sets handcrafted from ${store?.name || "Boutique"}'s live inventory for every mood and occasion.`}
      maxWidthClass="w-full sm:max-w-[650px]"
    >
      <div className="space-y-4">
        {/* Occasion Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {OCCASIONS.map((occ) => (
            <button
              key={occ.id}
              type="button"
              onClick={() => setSelectedOccasion(occ.id)}
              className={`text-xs px-3 py-1.5 rounded-[10px] whitespace-nowrap transition-colors border ${
                selectedOccasion === occ.id
                  ? "bg-primary text-theme border-primary font-medium"
                  : "bg-theme text-body border-default/60 hover:text-heading"
              }`}
            >
              {occ.label}
            </button>
          ))}
        </div>

        {/* Outfits List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {filteredOutfits.length === 0 ? (
            <div className="text-center py-8 text-xs text-body">
              No curated sets found for this occasion. Browse the full catalog!
            </div>
          ) : (
            filteredOutfits.map((outfit) => {
              const setProducts = outfit.products || outfit.items || [];
              return (
                <div
                  key={outfit.id}
                  className="p-4 rounded-[18px] bg-theme border border-default/60 space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <Badge variant="accent" className="text-[10px] uppercase tracking-wider mb-1">
                        {outfit.occasion}
                      </Badge>
                      <h4 className="font-heading font-semibold text-heading text-base">
                        {outfit.title}
                      </h4>
                      <p className="text-xs text-body font-sans mt-0.5">
                        {outfit.description || outfit.tagline || ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-muted block">Complete Set</span>
                      <span className="font-heading font-semibold text-heading text-base">
                        {formatPKR(outfit.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Items in Set */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {setProducts.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-[14px] bg-card border border-default/50 flex flex-col justify-between gap-2"
                      >
                        <div className="aspect-square rounded-[10px] overflow-hidden bg-subtle">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold">
                              {item.name?.charAt(0) || "P"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-heading font-medium text-heading text-xs line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-body mt-0.5">{formatPKR(item.price)}</p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            onClose();
                            onSelectProductForTryOn(item);
                          }}
                          className="text-[10px] h-7 w-full"
                        >
                          <Sparkles className="size-3 mr-1 text-accent" />
                          Try Item
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Dialog>
  );
}
