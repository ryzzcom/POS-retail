"use client";

import React from "react";
import { Download, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/PageHeader";

export interface ShiftGreetingHeaderProps {
  cashierName?: string;
  activeProfilesCount?: number;
  promoProfilesCount?: number;
  onExport: () => void;
  onNewCustomer: () => void;
}

export function ShiftGreetingHeader({
  cashierName = "Bilal Ahmed",
  activeProfilesCount = 7,
  promoProfilesCount = 5,
  onExport,
  onNewCustomer,
}: ShiftGreetingHeaderProps) {
  return (
    <PageHeader
      title={`Hello, ${cashierName}`}
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
