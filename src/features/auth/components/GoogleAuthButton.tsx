"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface GoogleAuthButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function GoogleAuthButton({
  label = "Continue with Google",
  onClick,
  disabled = false,
}: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="white"
      fullWidth
      disabled={disabled}
      onClick={onClick}
      leftIcon={
        <Image
          src="/icons/google.svg"
          alt="Google logo"
          width={18}
          height={18}
          className="shrink-0"
        />
      }
      className="h-[44px] sm:h-[48px] rounded-[12px] font-sans font-medium text-sm text-heading border-default bg-theme hover:bg-subtle/40 active:scale-[0.99] gap-2.5"
    >
      {label}
    </Button>
  );
}

export default GoogleAuthButton;
