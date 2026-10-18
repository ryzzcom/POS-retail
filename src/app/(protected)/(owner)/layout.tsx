"use client";

import * as React from "react";
import { OwnerSidebar, OwnerHeader } from "@/components/layouts";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen max-h-screen w-full bg-primary overflow-hidden">
      {/* 1. Desktop Compact Navigation Rail & Portalled Mobile Drawer */}
      <OwnerSidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Inset Rounded Main Content Canvas with Responsive Outer Padding */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-2 sm:p-3 lg:p-4 min-w-0 relative z-10">
        <div className="flex-1 flex flex-col h-full bg-page rounded-[18px] sm:rounded-[24px] lg:rounded-[28px] overflow-hidden shadow-2xl border border-default/20 min-w-0">
          {/* Global Owner Workspace Top Bar (Figma Node 3385:12955) with Hamburger Trigger on Mobile */}
          <div className="px-3.5 pt-3 pb-2 sm:px-6 sm:pt-4 lg:px-8 lg:pt-5 shrink-0 bg-page">
            <OwnerHeader
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
            />
          </div>

          {/* Scrollable Canvas Content Area with Sleek Custom Scrollbar */}
          <main className="flex-1 overflow-y-auto custom-scrollbar px-3.5 pb-5 sm:px-6 sm:pb-8 lg:px-8 lg:pb-8 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
