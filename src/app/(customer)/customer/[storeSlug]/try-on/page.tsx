"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { CustomerHeader } from "@/features/customer/components/CustomerHeader";
import { VirtualTryOnStudio } from "@/features/customer/components/VirtualTryOnStudio";
import { customerService } from "@/features/customer/services/customer.service";
import type { CustomerStore, CustomerProduct } from "@/features/customer/types/customer.types";

export default function TryOnPage() {
  const params = useParams();
  const storeSlug = params?.storeSlug as string;

  const [store, setStore] = React.useState<CustomerStore | null>(null);
  const [products, setProducts] = React.useState<CustomerProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!storeSlug) return;
    async function load() {
      try {
        setIsLoading(true);
        const [storeData, catalogData] = await Promise.all([
          customerService.getStoreBySlug(storeSlug),
          customerService.getStoreCatalog(storeSlug),
        ]);
        setStore(storeData);
        setProducts(catalogData);
      } catch (err) {
        console.error("Failed to load store or catalog", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [storeSlug]);

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader currentStore={store} activeSlug={storeSlug} />

      <div className="max-w-5xl mx-auto px-4 py-6 w-full space-y-6">
        {isLoading ? (
          <div className="h-96 rounded-[24px] bg-card border border-default/40 animate-pulse" />
        ) : store ? (
          <VirtualTryOnStudio
            store={store}
            initialProduct={products[0]}
            allProducts={products}
          />
        ) : (
          <div className="text-center py-16 bg-card rounded-[22px] border border-default/50">
            Store not found
          </div>
        )}
      </div>
    </div>
  );
}
