"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SplashScreenProps {
  /**
   * Mode:
   * - "stage-1": Exact Figma node 3369:977 (Logo mark only, centered)
   * - "stage-2": Exact Figma node 3369:998 (Logo mark + "POS SYSTEM" wordmark)
   * - "animated": Smoothly auto-progresses from stage-1 to stage-2
   */
  stage?: "stage-1" | "stage-2" | "animated";
  /**
   * Total duration in milliseconds for the animated sequence before firing onComplete.
   * Default: 2200ms
   */
  duration?: number;
  /**
   * Callback fired when the animation sequence completes.
   */
  onComplete?: () => void;
  /**
   * Whether to display an elegant minimalist progress bar indicator.
   * Default: true
   */
  showProgress?: boolean;
  /**
   * Optional custom class for outer container.
   */
  className?: string;
}

/**
 * Exact geometric Brand Logo vector extracted from Figma node 3371:6748
 * Styled with semantic currentColor / text-primary to strictly honor Zero-Hex policy.
 */
export function BrandLogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 198 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-[140px] h-[64px] sm:w-[170px] sm:h-[78px] md:w-[198px] md:h-[90px] shrink-0 text-primary transition-transform duration-700 ease-out", className)}
      aria-label="POS Retail Logo"
    >
      <g clipPath="url(#pos-logo-clip)">
        <path
          d="M184.501 58.5012H162.001V45.0012C162.001 40.5516 160.68 36.201 158.208 32.5011C155.736 28.8014 152.223 25.916 148.112 24.213C144.001 22.5104 139.475 22.0663 135.111 22.9341C130.747 23.8026 126.736 25.9451 123.59 29.091C120.444 32.2372 118.302 36.2474 117.434 40.6112C116.566 44.9753 117.01 49.5014 118.712 53.6124C120.415 57.7232 123.301 61.2368 127.001 63.7088C130.7 66.1807 135.051 67.501 139.501 67.5012H198.001V90.0015H139.501C130.601 90.001 121.9 87.3606 114.5 82.4165C107.101 77.4719 101.332 70.4433 97.9263 62.2214C95.3539 56.0107 95.533 48.5202 91.8463 43.0019C90.1161 40.4121 87.6553 38.3932 84.7778 37.2011C81.9007 36.0095 78.7334 35.6972 75.679 36.3045C72.6244 36.9125 69.815 38.4112 67.6127 40.6135C65.4107 42.8158 63.9117 45.6249 63.304 48.6795C62.6967 51.7341 63.0086 54.901 64.2004 57.7785C65.3924 60.6558 67.4116 63.1166 70.0013 64.8471C72.5906 66.5769 75.6365 67.501 78.7507 67.5012H90.416C94.5767 76.5777 101.178 84.3389 109.501 89.9002C109.552 89.9342 109.604 89.9675 109.655 90.0015H78.7507C71.1864 90.001 63.7906 87.7569 57.501 83.5545C51.2113 79.3517 46.3073 73.3782 43.4122 66.3895C41.6284 62.0832 41.4657 57.2117 38.9846 53.4981C37.996 52.019 36.5875 50.8656 34.9438 50.1848C33.3 49.5041 31.4901 49.3257 29.7452 49.6727C27.9999 50.0201 26.3959 50.8778 25.1375 52.1357C23.879 53.3942 23.0218 54.9982 22.6744 56.7435C22.3272 58.4886 22.5058 60.2983 23.1863 61.9421C23.8673 63.5862 25.0205 64.9943 26.4998 65.9829C27.9794 66.9716 29.7212 67.499 31.5007 67.4992L34.2122 67.5012C34.4891 68.2844 34.781 69.0647 35.0998 69.8349C38.4449 77.909 43.9601 84.8854 51.0147 90.0015H31.5007C25.2711 90.0012 19.1793 88.1515 13.9995 84.6905C8.8202 81.2294 4.78188 76.3084 2.39796 70.5533C0.0143761 64.7978 -0.610334 58.4632 0.604981 52.3533C1.82058 46.2434 4.82202 40.6306 9.22705 36.2255C13.6321 31.8207 19.2452 28.8188 25.355 27.6033C31.4645 26.3883 37.7998 27.0129 43.5548 29.3963C44.6294 29.8414 45.6759 30.3465 46.6882 30.9036C48.1343 28.6802 49.8107 26.5991 51.7045 24.7051C57.0535 19.3564 63.8699 15.7112 71.2888 14.2352C78.7079 12.7598 86.4002 13.5181 93.3889 16.4127C96.2672 17.605 98.9719 19.1419 101.453 20.972C103.224 18.1663 105.31 15.5507 107.68 13.1805C113.973 6.88775 121.994 2.6035 130.723 0.867046C139.451 -0.868749 148.499 0.0216018 156.721 3.42686C164.943 6.83275 171.971 12.6011 176.916 20.0008C181.86 27.4008 184.501 36.1013 184.501 45.0012V58.5012Z"
          fill="currentColor"
        />
        <path
          d="M198.001 6.75C198.001 10.4779 194.979 13.5 191.251 13.5C187.523 13.5 184.501 10.4779 184.501 6.75C184.501 3.02209 187.523 0 191.251 0C194.979 0 198.001 3.02209 198.001 6.75Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="pos-logo-clip">
          <rect width="198" height="90" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/**
 * SplashScreen Component
 * Faithfully implements Figma Splash 1 (Node 3369:977) & Splash 2 (Node 3369:998)
 * with silky transitions, zero hex tokens, and responsive typography.
 */
export function SplashScreen({
  stage = "animated",
  duration = 2200,
  onComplete,
  showProgress = true,
  className,
}: SplashScreenProps) {
  // Current active visual phase: 1 (logo only) or 2 (logo + wordmark)
  const [currentStage, setCurrentStage] = React.useState<1 | 2>(
    stage === "stage-2" ? 2 : 1
  );
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [progress, setProgress] = React.useState(15);

  React.useEffect(() => {
    // Initial entrance fade-in
    const revealTimer = setTimeout(() => {
      setIsRevealed(true);
    }, 50);

    if (stage === "stage-1") {
      setCurrentStage(1);
      return () => clearTimeout(revealTimer);
    }

    if (stage === "stage-2") {
      setCurrentStage(2);
      return () => clearTimeout(revealTimer);
    }

    // "animated" mode sequence
    const stage2Timer = setTimeout(() => {
      setCurrentStage(2);
      setProgress(75);
    }, 800);

    const finishTimer = setTimeout(() => {
      setProgress(100);
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(stage2Timer);
      clearTimeout(finishTimer);
    };
  }, [stage, duration, onComplete]);

  const showWordmark = currentStage === 2;

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-page select-none",
        className
      )}
      data-testid="splash-screen"
    >
      {/* Decorative Subtle Ambient Background Glow */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-subtle/50 blur-3xl opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-subtle/40 blur-3xl opacity-60"
        aria-hidden="true"
      />

      {/* Main Centered Branding Stage (Figma Frame 1618872683) */}
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-700 ease-out",
          showWordmark
            ? "gap-4 sm:gap-6 md:gap-[30.857px]"
            : "gap-0",
          isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        {/* Brand Mark Icon */}
        <div className="relative shrink-0 flex items-center justify-center">
          <BrandLogoMark
            className={cn(
              "transition-all duration-700 ease-out",
              showWordmark ? "scale-100" : "scale-105"
            )}
          />
        </div>

        {/* Wordmark: "POS SYSTEM" (Figma Node 3371:6757) */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-700 ease-out flex items-center",
            showWordmark
              ? "max-w-[500px] opacity-100 translate-x-0"
              : "max-w-0 opacity-0 -translate-x-6"
          )}
        >
          <h1 className="font-heading font-semibold text-heading uppercase tracking-[-1.0286px] whitespace-nowrap text-3xl sm:text-5xl md:text-6xl lg:text-[72px] leading-none">
            POS SYSTEM
          </h1>
        </div>
      </div>

      {/* Modern Minimal Progress Indicator */}
      {showProgress && (
        <div className="absolute bottom-12 flex flex-col items-center gap-3">
          <div className="h-1 w-36 sm:w-48 overflow-hidden rounded-full bg-subtle">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-sans text-xs tracking-wider uppercase text-body opacity-60 animate-pulse">
            Loading System
          </span>
        </div>
      )}
    </div>
  );
}

export default SplashScreen;
