import React, { Suspense } from "react";
import { CashierHeader } from "@/components/layouts";

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-primary p-2 sm:p-3 lg:p-5 flex flex-col antialiased">
      <div className="flex-1 bg-page rounded-[20px] sm:rounded-[26px] lg:rounded-[30px] p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 overflow-x-hidden min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] lg:min-h-[calc(100vh-2.5rem)]">
        <Suspense fallback={null}>
          <CashierHeader />
        </Suspense>
        <main className="w-full flex-1 flex flex-col">
          <Suspense fallback={<div className="p-8 text-center text-muted">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
