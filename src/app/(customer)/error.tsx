"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    reset();
    setTimeout(() => {
      setIsRetrying(false);
    }, 1500);
  };

  const isDatabaseWakeup =
    error?.message?.includes("P1001") ||
    error?.message?.includes("Database") ||
    error?.message?.includes("waking up");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md w-full bg-card rounded-[24px] border border-default/70 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="size-16 rounded-full bg-status-warning-bg border border-status-warning/30 flex items-center justify-center text-status-warning mx-auto">
          <AlertCircle className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading font-bold text-heading text-xl sm:text-2xl">
            {isDatabaseWakeup ? "Boutique Catalog Initializing" : "Unable to Load Store"}
          </h2>
          <p className="text-xs sm:text-sm text-body font-sans leading-relaxed">
            {isDatabaseWakeup
              ? "The high-fashion catalog server was asleep and is finishing its wake-up. Tap retry below to load all garments."
              : "We encountered a temporary connection issue while loading the boutique collection. Please try refreshing."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleRetry}
            isLoading={isRetrying}
            className="w-full sm:w-auto text-xs h-10 px-6 font-semibold shadow-sm"
          >
            <RefreshCw className="size-3.5 mr-2" />
            Retry Loading Boutique
          </Button>

          <Link href="/customer" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="w-full text-xs h-10 px-4"
            >
              <ShoppingBag className="size-3.5 mr-1.5" />
              All Stores
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
