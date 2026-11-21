"use client";

import React from "react";
import { Download, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/PageHeader";
import { useAuth } from "@/features/auth";

export interface ShiftGreetingHeaderProps {
  cashierName?: string;
  activeProfilesCount?: number;
  promoProfilesCount?: number;
  onExport: () => void;
  onNewCustomer: () => void;
}

export function ShiftGreetingHeader({
  cashierName: propCashierName,
  activeProfilesCount = 7,
  promoProfilesCount = 5,
  onExport,
  onNewCustomer,
}: ShiftGreetingHeaderProps) {
  const { user, activeProfile } = useAuth();

  const effectiveCashierName = React.useMemo(() => {
    if (propCashierName) return propCashierName;
    if (activeProfile?.displayName) return activeProfile.displayName;
    if (user?.fullName) return user.fullName;
    if (typeof window !== "undefined") {
      try {
        const storedProfile = localStorage.getItem("active_profile");
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          if (parsed.displayName) return parsed.displayName;
        }
        const session = localStorage.getItem("cashier_session");
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed.cashierName) return parsed.cashierName;
        }
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const parsed = JSON.parse(userStr);
          if (parsed.fullName) return parsed.fullName;
        }
      } catch {}
    }
    return "Staff";
  }, [propCashierName, activeProfile, user]);

  return (
    <PageHeader
      title={`Hello, ${effectiveCashierName}`}
      description={`${activeProfilesCount} active profiles · ${promoProfilesCount} accept promotions`}
      actions={
        <>
          <Button
            type="button"
            variant="white"
            onClick={onExport}
            className="rounded-full px-5 py-2.5 font-sans font-medium text-sm flex items-center gap-2 shadow-xs border-default hover:bg-subtle/40"
          >
            <Download className="size-4 shrink-0" />
            <span>Export</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={onNewCustomer}
            className="rounded-full px-5 py-2.5 font-sans font-medium text-sm flex items-center gap-2 shadow-xs"
          >
            <PlusCircle className="size-4 shrink-0" />
            <span>New Customers</span>
          </Button>
        </>
      }
    />
  );
}
