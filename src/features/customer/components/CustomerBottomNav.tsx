"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Sparkles, Gift, Receipt, Shirt } from "lucide-react";

interface CustomerBottomNavProps {
  activeSlug?: string;
}

export function CustomerBottomNav({ activeSlug }: CustomerBottomNavProps) {
  const pathname = usePathname();

  const storeBase = activeSlug ? `/customer/${activeSlug}` : "/customer";

  const navItems = [
    {
      label: "Shops",
      href: "/customer",
      icon: Store,
      isActive: pathname === "/customer",
    },
    {
      label: "Catalog",
      href: storeBase,
      icon: Shirt,
      isActive: Boolean(activeSlug && (pathname === storeBase || pathname.includes("/product/"))),
    },
    {
      label: "AI Try-On",
      href: `${storeBase}/try-on`,
      icon: Sparkles,
      isActive: pathname.includes("/try-on"),
      highlight: true,
    },
    {
      label: "Gifts",
      href: `${storeBase}/gift`,
      icon: Gift,
      isActive: pathname.includes("/gift"),
    },
    {
      label: "Receipts",
      href: "/customer/receipts",
      icon: Receipt,
      isActive: pathname === "/customer/receipts",
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-default/50 sm:hidden">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                active ? "text-primary font-medium" : "text-body hover:text-heading"
              }`}
            >
              <div
                className={`relative p-1 rounded-full transition-transform ${
                  item.highlight && active
                    ? "bg-accent/20 text-primary scale-110"
                    : active
                    ? "scale-105"
                    : ""
                }`}
              >
                <Icon className={`size-5 ${item.highlight ? "text-accent" : ""}`} />
                {item.highlight && (
                  <span className="absolute -top-0.5 -right-0.5 size-2 bg-accent rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-none">{item.label}</span>
              {active && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
