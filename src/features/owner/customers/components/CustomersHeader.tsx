"use client";

import * as React from "react";
import { Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";

interface CustomersHeaderProps {
  totalProfiles: number;
  acceptsPromotions: number;
  onExport: () => void;
  onNewCustomer: () => void;
  className?: string;
}

export function CustomersHeader({
  totalProfiles,
  acceptsPromotions,
  onExport,
  onNewCustomer,
  className,
}: CustomersHeaderProps) {
  return (
    <PageHeader
      title="Customers"
      description={`${totalProfiles} active profiles · ${acceptsPromotions} accept promotions`}
      className={className}
      actions={
        <>
          <Button
            type="button"
            variant="white"
            onClick={onExport}
            leftIcon={<Download className="size-4 text-heading shrink-0" />}
            aria-label="Export customer directory to CSV"
          >
            Export
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={onNewCustomer}
            leftIcon={<Plus className="size-4 shrink-0 text-dark-primary" />}
            aria-label="Create new customer profile"
          >
            New Customers
          </Button>
        </>
      }
    />
  );
}

