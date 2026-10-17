"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AuthSplitLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  bannerSrc?: string;
  bannerAlt?: string;
  compactHeader?: boolean;
}

export function AuthSplitLayout({
  title,
  subtitle,
  children,
  bannerSrc = "/login-banner.png",
  bannerAlt = "Retail POS Experience",
  compactHeader = false,
}: AuthSplitLayoutProps) {
  return (
    <div className="relative h-screen max-h-screen w-full bg-page flex flex-col justify-between overflow-hidden">
      {/* Top Bar Branding */}
      <header
        className={cn(
          "relative z-10 w-full px-6 sm:px-8 lg:px-12 flex items-center shrink-0",
          compactHeader
            ? "pt-2.5 pb-1 sm:pt-4 sm:pb-2"
            : "pt-3 pb-2 sm:pt-5 sm:pb-3"
        )}
      >
        <Link
          href="/"
          className="inline-block transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-md"
          aria-label="POS System Home"
        >
          <Image
            src="/image/logo-login.svg"
            alt="POS System"
            width={252}
            height={35}
            priority
            className={cn(
              "w-auto",
              compactHeader ? "h-[30px] sm:h-[34px]" : "h-[32px] sm:h-[35px]"
            )}
          />
        </Link>
      </header>

      {/* Main Split-Screen Grid: Single 100vh viewport without scrolling */}
      <main
        className={cn(
          "flex-1 w-full max-w-[1512px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-8 lg:px-12 gap-6 lg:gap-8 min-h-0 overflow-hidden",
          compactHeader ? "pb-2.5 sm:pb-4" : "pb-3 sm:pb-5"
        )}
      >
        {/* Left Column: Form Section (max-w-[446px]) */}
        <section className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-start w-full max-w-[446px] mx-auto lg:mx-0 lg:ml-auto">
          {/* Header Texts */}
          <div
            className={cn(
              "flex flex-col w-full",
              compactHeader
                ? "gap-0.5 mb-2.5 sm:mb-3.5"
                : "gap-1 mb-5 sm:mb-7"
            )}
          >
            <h1 className="font-heading font-semibold text-2xl sm:text-[28px] text-heading tracking-[-0.4px]">
              {title}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-body">
              {subtitle}
            </p>
          </div>

          {/* Form Slot */}
          {children}
        </section>

        {/* Right Column: Boutique Fashion / Retail POS Showcase */}
        <section
          aria-label="POS Showcase"
          className="hidden lg:flex col-span-1 lg:col-span-6 xl:col-span-7 justify-center items-center h-full max-h-[calc(100vh-80px)] py-1"
        >
          <div className="relative w-full h-full max-h-[580px] xl:max-h-[660px] rounded-[16px] overflow-hidden shadow-sm border border-default/40">
            <Image
              src={bannerSrc}
              alt={bannerAlt}
              fill
              priority
              sizes="(min-width: 1280px) 620px, 45vw"
              className="object-cover object-center rounded-[16px]"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default AuthSplitLayout;
