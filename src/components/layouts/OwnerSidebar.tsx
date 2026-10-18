"use client";

import * as React from "react";
import Link from "next/link";
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
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface OwnerSidebarProps {
  /**
   * Default collapse state. Defaults to true to match compact 72px rail specification.
   */
  defaultCollapsed?: boolean;
  /**
   * Controlled open state for mobile navigation drawer.
   */
  isMobileOpen?: boolean;
  /**
   * Callback to close mobile navigation drawer.
   */
  onCloseMobile?: () => void;
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
}

const OVERVIEW_NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Sales History",
    href: "/sales-history",
    icon: Receipt,
  },
  {
    name: "Products & Inventory",
    href: "/products-inventory",
    icon: Shirt,
  },
  {
    name: "Purchases & Suppliers",
    href: "/purchases-suppliers",
    icon: Truck,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Loyalty & Referrals",
    href: "/loyalty-referrals",
    icon: Gift,
  },
  {
    name: "Finance & Expenses",
    href: "/finance-expenses",
    icon: Wallet,
  },
  {
    name: "Khata Credit",
    href: "/khata-receivables",
    icon: BookOpen,
  },
  {
    name: "WhatsApp Campaigns",
    href: "/whatsapp-campaigns",
    icon: MessageCircle,
  },
  {
    name: "Reports & Analytics",
    href: "/reports-analytics",
    icon: BarChart3,
  },
];

const SUPPORT_NAV_ITEMS: NavItem[] = [
  {
    name: "Help & Support",
    href: "/dashboard#support",
    icon: HelpCircle,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function OwnerSidebar({
  defaultCollapsed = true,
  isMobileOpen = false,
  onCloseMobile,
  className,
}: OwnerSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Auto-close mobile drawer on route change
  React.useEffect(() => {
    if (isMobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  }, [pathname]);

  // 2. Auto-close mobile drawer on Escape key and lock body scroll while open
  React.useEffect(() => {
    if (!isMobileOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseMobile?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen, onCloseMobile]);

  const isRouteActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <aside
      aria-label="Store Owner Sidebar"
      className={cn(
        "hidden lg:flex relative h-screen bg-primary flex-col justify-between shrink-0 transition-all duration-300 z-30 select-none overflow-visible",
        isCollapsed ? "w-[72px]" : "w-[240px]",
        className
      )}
    >
      {/* 1. Header Branding & Collapse Toggle */}
      <div className="flex flex-col shrink-0">
        <div
          className={cn(
            "h-[60px] px-2.5 flex items-center border-b border-dark",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-md"
            aria-label="POS System Dashboard"
          >
            {/* Brand Logo Mark */}
            <Image
              src="/image/sidebar-logo.svg"
              alt="POS Retail"
              width={52}
              height={24}
              priority
              className="w-[52px] h-[24px] object-contain shrink-0"
            />
            {!isCollapsed && (
              <span className="font-heading font-semibold text-sm tracking-tight text-dark-primary whitespace-nowrap">
                POS RETAIL
              </span>
            )}
          </Link>

          {/* Expand / Collapse Rail Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex size-7 rounded-lg items-center justify-center text-dark-secondary hover:text-dark-primary hover:bg-subtle/10 transition-colors cursor-pointer"
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Items (Compact 72px rail width, fits in 100vh) */}
      <div className="flex-1 overflow-visible py-2 px-1.5 flex flex-col justify-between">
        {/* Section: Overview */}
        <div>
          <div
            className={cn(
              "font-sans text-[10px] text-dark-secondary tracking-[0.1px] uppercase mb-1.5 font-medium",
              isCollapsed ? "text-center" : "px-2"
            )}
          >
            Overview
          </div>

          <nav
            aria-label="Overview Navigation"
            className={cn(
              "flex flex-col gap-1.5 overflow-visible",
              isCollapsed ? "items-center" : "items-stretch"
            )}
          >
            {OVERVIEW_NAV_ITEMS.map((item) => {
              const active = isRouteActive(item.href);
              const Icon = item.icon;

              return (
                <div key={item.href} className="relative group overflow-visible">
                  <Link
                    href={item.disabled ? "#" : item.href}
                    aria-current={active ? "page" : undefined}
                    aria-disabled={item.disabled}
                    className={cn(
                      "flex items-center transition-all duration-150 relative",
                      isCollapsed
                        ? "h-[38px] w-[40px] justify-center rounded-[10px]"
                        : "h-[38px] w-full px-3 gap-2.5 rounded-[10px]",
                      active
                        ? "bg-accent text-dark-primary shadow-xs font-medium"
                        : "text-dark-secondary hover:text-dark-primary hover:bg-subtle/10",
                      item.disabled &&
                      "opacity-40 cursor-not-allowed pointer-events-none"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 shrink-0 transition-colors",
                        active
                          ? "text-dark-primary"
                          : "text-dark-secondary group-hover:text-dark-primary"
                      )}
                    />

                    {!isCollapsed && (
                      <span className="font-sans text-xs tracking-tight truncate flex-1">
                        {item.name}
                      </span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent/20 text-accent">
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Floating Tooltip for Collapsed Rail Mode (Never clipped, z-[100], ml-2.5) */}
                  {isCollapsed && (
                    <div
                      role="tooltip"
                      className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 bg-theme border border-default text-heading shadow-xl px-2.5 py-1 rounded-[8px] font-sans text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-[100] scale-95 group-hover:scale-100 origin-left"
                    >
                      {item.name}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-theme mr-[-1px]" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* 3. Section: Support */}
        <div className="shrink-0 pt-2 pb-1 border-t border-dark overflow-visible">
          <div
            className={cn(
              "font-sans text-[10px] text-dark-secondary tracking-[0.1px] uppercase mb-1.5 font-medium",
              isCollapsed ? "text-center" : "px-2"
            )}
          >
            Support
          </div>

          <nav
            aria-label="Support Navigation"
            className={cn(
              "flex flex-col gap-1.5 overflow-visible",
              isCollapsed ? "items-center" : "items-stretch"
            )}
          >
            {SUPPORT_NAV_ITEMS.map((item) => {
              const active = isRouteActive(item.href);
              const Icon = item.icon;

              return (
                <div key={item.href} className="relative group overflow-visible">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center transition-all duration-150 relative",
                      isCollapsed
                        ? "h-[38px] w-[40px] justify-center rounded-[8px]"
                        : "h-[38px] w-full px-3 gap-2.5 rounded-[8px]",
                      active
                        ? "bg-accent text-dark-primary shadow-xs font-medium"
                        : "text-dark-secondary hover:text-dark-primary hover:bg-subtle/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 shrink-0 transition-colors",
                        active
                          ? "text-dark-primary"
                          : "text-dark-secondary group-hover:text-dark-primary"
                      )}
                    />

                    {!isCollapsed && (
                      <span className="font-sans text-xs tracking-tight truncate flex-1">
                        {item.name}
                      </span>
                    )}
                  </Link>

                  {/* Floating Tooltip for Collapsed Rail Mode (Never clipped, z-[100], ml-2.5) */}
                  {isCollapsed && (
                    <div
                      role="tooltip"
                      className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 bg-theme border border-default text-heading shadow-xl px-2.5 py-1 rounded-[8px] font-sans text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-[100] scale-95 group-hover:scale-100 origin-left"
                    >
                      {item.name}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-theme mr-[-1px]" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
      </aside>

      {/* 2. Mobile Full-Viewport Navigation Drawer Overlay (portalled to body to prevent clipping) */}
      {mounted &&
        isMobileOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] lg:hidden flex select-none"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            {/* 1. Dark Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-heading/50 backdrop-blur-[1px] transition-opacity duration-200"
              onClick={onCloseMobile}
              aria-hidden="true"
            />

            {/* 2. Left Slide-In Sidebar Panel */}
            <div className="relative z-10 w-[260px] max-w-[80vw] h-full bg-primary text-dark-primary flex flex-col justify-between p-4 shadow-xl overflow-y-auto animate-in slide-in-from-left duration-200">
              {/* Header Branding & Close Button */}
              <div className="flex flex-col shrink-0">
                <div className="h-[52px] flex items-center justify-between border-b border-dark pb-2 mb-3">
                  <Link
                    href="/dashboard"
                    onClick={onCloseMobile}
                    className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-md"
                    aria-label="POS System Dashboard"
                  >
                    <Image
                      src="/image/sidebar-logo.svg"
                      alt="POS Retail"
                      width={52}
                      height={24}
                      priority
                      className="w-[52px] h-[24px] object-contain shrink-0"
                    />
                    <span className="font-heading font-semibold text-sm tracking-tight text-dark-primary whitespace-nowrap">
                      POS RETAIL
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={onCloseMobile}
                    className="size-8 rounded-lg flex items-center justify-center text-dark-primary hover:text-dark-secondary hover:bg-subtle/10 transition-colors cursor-pointer"
                    aria-label="Close mobile navigation menu"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Section: Overview */}
                <div className="font-sans text-[10px] text-dark-secondary tracking-[0.1px] uppercase mb-2 font-medium px-2">
                  Overview
                </div>
                <nav aria-label="Mobile Overview Navigation" className="flex flex-col gap-1">
                  {OVERVIEW_NAV_ITEMS.map((item) => {
                    const active = isRouteActive(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.disabled ? "#" : item.href}
                        onClick={onCloseMobile}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "h-[40px] w-full px-3 gap-3 rounded-[10px] flex items-center transition-all duration-150",
                          active
                            ? "bg-accent text-dark-primary shadow-xs font-medium"
                            : "text-dark-secondary hover:text-dark-primary hover:bg-subtle/10",
                          item.disabled &&
                            "opacity-40 cursor-not-allowed pointer-events-none"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-5 shrink-0 transition-colors",
                            active ? "text-dark-primary" : "text-dark-secondary"
                          )}
                        />
                        <span className="font-sans text-xs tracking-tight truncate flex-1">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent/20 text-accent">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Section: Support */}
              <div className="shrink-0 pt-3 mt-4 border-t border-dark">
                <div className="font-sans text-[10px] text-dark-secondary tracking-[0.1px] uppercase mb-2 font-medium px-2">
                  Support
                </div>
                <nav aria-label="Mobile Support Navigation" className="flex flex-col gap-1">
                  {SUPPORT_NAV_ITEMS.map((item) => {
                    const active = isRouteActive(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onCloseMobile}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "h-[38px] w-full px-3 gap-3 rounded-[8px] flex items-center transition-all duration-150",
                          active
                            ? "bg-accent text-dark-primary shadow-xs font-medium"
                            : "text-dark-secondary hover:text-dark-primary hover:bg-subtle/10"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-5 shrink-0 transition-colors",
                            active ? "text-dark-primary" : "text-dark-secondary"
                          )}
                        />
                        <span className="font-sans text-xs tracking-tight truncate flex-1">
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default OwnerSidebar;
