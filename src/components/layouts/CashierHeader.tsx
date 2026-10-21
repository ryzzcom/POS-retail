"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import { ScanLine, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CashierHeaderProps {
  className?: string;
  cashierName?: string;
  cashierRole?: string;
}

export function CashierHeader({
  className,
  cashierName = "Bilal Ahmed",
  cashierRole = "Cashier",
}: CashierHeaderProps) {
  const pathname = usePathname();
  const params = useParams();

  const storeSlug = (params?.storeSlug as string) || "noor-pret";
  const counterId = (params?.counterId as string) || "1";

  const basePath = `/${storeSlug}/counter/${counterId}`;

  const navItems = [
    {
      label: "Shift",
      href: `${basePath}/shift`,
      isActive: pathname.includes("/shift"),
    },
    {
      label: "My Sales",
      href: `${basePath}/my-sales`,
      isActive: pathname.includes("/my-sales"),
    },
    {
      label: "Khata Payments",
      href: `${basePath}/khata-payment`,
      isActive: pathname.includes("/khata-payment"),
    },
  ];

  return (
    <header
      className={cn(
        "bg-primary text-dark-primary rounded-full px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between shadow-xs select-none relative shrink-0 w-full",
        className
      )}
    >
      {/* Left: Brand Logo Mark */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href={`${basePath}/shift`}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
          aria-label="POS Retail Terminal Home"
        >
          <Image
            src="/image/sidebar-logo.svg"
            alt="POS Retail"
            width={58}
            height={26}
            priority
            className="w-[52px] sm:w-[58px] h-[24px] sm:h-[26px] object-contain shrink-0"
          />
        </Link>
      </div>

      {/* Center: Underline Navigation Tabs */}
      <nav
        aria-label="Cashier Counter Navigation"
        className="flex items-center gap-1 sm:gap-4 md:gap-6 overflow-x-auto custom-scrollbar px-2"
      >
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "font-heading font-semibold text-sm sm:text-base lg:text-[18px] px-2.5 sm:px-4 py-1.5 transition-colors relative whitespace-nowrap",
              item.isActive
                ? "text-accent border-b-2 border-accent"
                : "text-dark-primary/80 hover:text-dark-primary"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right: Actions, Cashier Info & Switch User */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Open POS CTA */}
        <Button
          variant="accent"
          size="sm"
          asChild
          className="rounded-full px-3.5 sm:px-5 py-2 font-sans font-medium text-xs sm:text-sm text-dark-primary flex items-center gap-1.5 sm:gap-2 shadow-xs hover:opacity-95"
        >
          <Link href="/pos?from=cashier">
            <ScanLine className="size-4 shrink-0" />
            <span className="hidden xs:inline">Open POS</span>
          </Link>
        </Button>

        {/* Cashier Name & Role */}
        <div className="hidden sm:flex flex-col items-end text-right select-none">
          <p className="font-sans font-medium text-sm text-dark-primary leading-tight">
            {cashierName}
          </p>
          <p className="font-sans font-normal text-xs text-dark-secondary leading-tight">
            {cashierRole}
          </p>
        </div>

        {/* Lock Counter / Switch User Button */}
        <Link
          href={`/${storeSlug}/counter/${counterId}/unlock`}
          title="Lock Counter / Switch User"
          className="size-8 sm:size-[30px] rounded-[6px] bg-page border border-default flex items-center justify-center text-heading hover:bg-card transition-colors shrink-0"
        >
          <LogOut className="size-4 shrink-0" />
        </Link>
      </div>
    </header>
  );
}
