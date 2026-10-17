import React, { Suspense } from "react";
import { OwnerSidebar } from "@/components/layouts";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={null}>
        <OwnerSidebar />
      </Suspense>
      <main className="flex-1 p-6">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
