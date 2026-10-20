import React from "react";
import { CASHIER_PERMISSIONS } from "../constants";

export interface ShiftPermissionsCardProps {
  maxDiscountPercent?: number;
}

export function ShiftPermissionsCard({
  maxDiscountPercent = 10,
}: ShiftPermissionsCardProps) {
  return (
    <div className="rounded-[22px] bg-card border border-default/50 px-6 py-4 flex flex-col gap-4 shadow-xs select-none min-h-[340px] flex-1">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-1">
        <h2 className="font-sans font-medium text-sm sm:text-base text-heading">
          What you can do
        </h2>
        <p className="font-sans text-xs text-body">
          Set by the store owner. Discounts up to {maxDiscountPercent}%.
        </p>
      </div>

      {/* Permissions List */}
      <ul className="flex flex-col gap-2.5">
        {CASHIER_PERMISSIONS.map((permission) => (
          <li key={permission} className="flex items-center gap-2.5">
            <span className="size-1 rounded-full bg-body/70 shrink-0" />
            <span className="font-sans text-sm text-body">{permission}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
