import React, { Suspense } from "react";
import { OwnerSidebar, OwnerHeader } from "@/components/layouts";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen max-h-screen w-full bg-primary overflow-hidden">
      {/* 1. Collapsible Store Owner Navigation Rail (72px compact default) */}
      <Suspense
        fallback={<div className="w-[72px] h-screen bg-primary shrink-0" />}
      >
        <OwnerSidebar />
      </Suspense>

      {/* 2. Inset Rounded Main Content Canvas with Uniform 16px (p-4) Frame Spacing on All 4 Sides */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-4 min-w-0 relative z-10">
        <div className="flex-1 flex flex-col h-full bg-page rounded-[24px] lg:rounded-[28px] overflow-hidden shadow-2xl border border-default/20 min-w-0">
          {/* Global Owner Workspace Top Bar (Figma Node 3385:12955) */}
          <div className="px-5 pt-4 pb-2 sm:px-6 sm:pt-5 lg:px-8 lg:pt-5 shrink-0 bg-page">
            <OwnerHeader />
          </div>

          {/* Scrollable Canvas Content Area with Sleek Custom Scrollbar */}
          <main className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-8 min-w-0">
            <Suspense
              fallback={
                <div className="p-8 text-center text-sm text-body">
                  Loading module...
                </div>
              }
            >
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
