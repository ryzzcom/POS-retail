"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Receipt,
  Shirt,
  Truck,
  Users,
  Gift,
  Wallet,
  BookOpen,
  MessageCircle,
  BarChart3,
  HelpCircle,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobileOwnerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const OVERVIEW_NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Sales History", href: "/sales-history", icon: Receipt },
  { name: "Products & Inventory", href: "/products-inventory", icon: Shirt },
  { name: "Purchases & Suppliers", href: "/purchases-suppliers", icon: Truck },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Loyalty & Referrals", href: "/loyalty-referrals", icon: Gift },
  { name: "Finance & Expenses", href: "/finance-expenses", icon: Wallet },
  { name: "Khata Credit", href: "/khata-receivables", icon: BookOpen },
  { name: "WhatsApp Campaigns", href: "/whatsapp-campaigns", icon: MessageCircle },
  { name: "Reports & Analytics", href: "/reports-analytics", icon: BarChart3 },
];

const SUPPORT_NAV_ITEMS: NavItem[] = [
  { name: "Help & Support", href: "/dashboard#support", icon: HelpCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileOwnerDrawer({ isOpen, onClose }: MobileOwnerDrawerProps) {
  const pathname = usePathname();

  // Auto-close drawer on route change
  React.useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll while drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isRouteActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden select-none" role="dialog" aria-modal="true">
      {/* 1. Dark Backdrop Overlay with Blur */}
      <div
        className="fixed inset-0 bg-heading/60 backdrop-blur-xs transition-opacity duration-300 ease-out"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-over Mobile Navigation Panel */}
      <aside className="relative w-[280px] max-w-[85vw] h-full bg-primary text-dark-primary flex flex-col justify-between p-4 shadow-2xl z-10 transition-transform duration-300 ease-out animate-in slide-in-from-left">
        {/* Header Branding & Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-dark">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5"
            aria-label="POS System Dashboard"
          >
            <Image
              src="/image/sidebar-logo.svg"
              alt="POS Retail"
              width={48}
              height={22}
              priority
              className="w-[48px] h-[22px] object-contain shrink-0"
            />
            <span className="font-heading font-semibold text-sm tracking-tight text-dark-primary">
              POS RETAIL
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-dark-secondary hover:text-dark-primary hover:bg-subtle/10 transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-5">
          {/* Overview Section */}
          <div>
            <p className="px-2 font-sans text-[11px] font-medium uppercase tracking-wider text-dark-secondary/80 mb-2">
              Overview
            </p>
            <nav className="flex flex-col gap-1">
              {OVERVIEW_NAV_ITEMS.map((item) => {
                const active = isRouteActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-medium transition-colors",
                      active
                        ? "bg-accent text-white shadow-xs"
                        : "text-dark-secondary hover:text-dark-primary hover:bg-subtle/10"
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", active ? "text-white" : "text-dark-secondary")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Support Section */}
          <div>
            <p className="px-2 font-sans text-[11px] font-medium uppercase tracking-wider text-dark-secondary/80 mb-2">
              Support & Settings
            </p>
            <nav className="flex flex-col gap-1">
              {SUPPORT_NAV_ITEMS.map((item) => {
                const active = isRouteActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-medium transition-colors",
                      active
                        ? "bg-accent text-white shadow-xs"
                        : "text-dark-secondary hover:text-dark-primary hover:bg-subtle/10"
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", active ? "text-white" : "text-dark-secondary")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer User Info & Logout */}
        <div className="pt-3 border-t border-dark flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans font-medium text-xs text-dark-primary">
              Ayesha Khan
            </span>
            <span className="font-sans text-[11px] text-dark-secondary">
              Store Owner
            </span>
          </div>

          <Link
            href="/login"
            onClick={onClose}
            className="size-8 rounded-lg border border-dark flex items-center justify-center text-dark-secondary hover:text-dark-primary hover:bg-subtle/10 transition-colors"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
