import React, { Suspense } from "react";
import { CashierHeader } from "@/components/layouts";

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={null}>
        <CashierHeader />
      </Suspense>
      <main className="flex-1 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
