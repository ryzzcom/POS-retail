"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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

  return (
    <div className="min-h-screen bg-page text-heading flex flex-col items-center justify-center px-4 py-12 text-center font-sans">
      <div className="max-w-md w-full bg-card rounded-[24px] border border-default/70 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="size-16 rounded-full bg-status-warning-bg border border-status-warning/30 flex items-center justify-center text-status-warning mx-auto">
          <AlertCircle className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading font-bold text-heading text-xl sm:text-2xl">
            Connection Restoring
          </h2>
          <p className="text-xs sm:text-sm text-body font-sans leading-relaxed">
            A temporary connection issue occurred while loading this view. Tap retry below to resume.
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
            Reload Page
          </Button>

          <Link href="/customer" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="w-full text-xs h-10 px-4"
            >
              <Home className="size-3.5 mr-1.5" />
              Customer Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
