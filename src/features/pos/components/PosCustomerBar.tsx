"use client";

import React, { useState } from "react";
import { UserPlus, X, Search } from "lucide-react";
import { PosCustomer } from "../types";
import { MOCK_POS_CUSTOMERS } from "../constants";
import { NewCustomerDialog } from "@/features/owner/customers/components/NewCustomerDialog";
import { CustomerItem } from "@/features/owner/customers/types/customers.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PosCustomerBarProps {
  customer: PosCustomer | null;
  onAttachCustomer: (customer: PosCustomer) => void;
  onDetachCustomer: () => void;
}

/**
 * Customer Selector & Loyalty Banner for POS Cart panel.
 * Matches Figma nodes 3422:36302, 3432:37518, and 3437:39407.
 */
export function PosCustomerBar({
  customer,
  onAttachCustomer,
  onDetachCustomer,
}: PosCustomerBarProps) {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  // Filter customers matching input
  const filteredCustomers = MOCK_POS_CUSTOMERS.filter((c) => {
    const q = search.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const handleSelect = (c: PosCustomer) => {
    onAttachCustomer(c);
    setSearch("");
    setIsSearching(false);
  };

  const handleCreateCustomer = (newCust: CustomerItem) => {
    const mapped: PosCustomer = {
      id: newCust.id,
      name: newCust.name,
      phone: newCust.phone,
      email: newCust.email,
      tier: (newCust.tier as any) || "Regular",
      pointsBalance: newCust.points || 0,
      khataBalance: newCust.khataBalance || 0,
      khataLimit: 50000,
    };
    onAttachCustomer(mapped);
    setIsNewCustomerModalOpen(false);
  };

  if (customer) {
    return (
      <div className="w-full rounded-[14px] p-3 bg-card border border-default/60 shadow-xs flex items-center justify-between gap-3 select-none">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-sans font-medium text-xs sm:text-sm text-heading truncate">
              {customer.name}
            </span>
            <span className="text-body text-xs">·</span>
            <Badge
              variant="accent"
              size="sm"
              className="h-5 px-2 text-[10px] font-medium shrink-0"
            >
              {customer.tier}
            </Badge>
          </div>
          <div className="flex items-center gap-2 font-sans text-xs text-body mt-0.5">
            <span>{customer.phone}</span>
            <span>·</span>
            <span className="font-medium text-heading">
              {customer.pointsBalance} pts
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDetachCustomer}
          className="size-7 rounded-full text-muted hover:text-heading hover:bg-subtle/50 shrink-0"
          title="Detach customer"
          aria-label="Detach customer"
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full select-none">
      <div className="flex items-center gap-2 px-3 py-2 rounded-[14px] bg-card border border-default shadow-xs focus-within:border-focus transition-colors">
        <Search className="size-4 text-muted shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsSearching(true);
          }}
          onFocus={() => setIsSearching(true)}
          placeholder="Receipt no., customer or phone"
          className="w-full bg-transparent font-sans text-xs sm:text-sm text-heading placeholder:text-muted focus:outline-none"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsNewCustomerModalOpen(true)}
          className="h-7 px-2 font-sans text-xs font-medium text-primary hover:text-primary/80 transition-colors shrink-0 gap-1"
        >
          <UserPlus className="size-3.5" />
          <span>New</span>
        </Button>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isSearching && search.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-card rounded-[14px] border border-default shadow-lg overflow-hidden max-h-56 overflow-y-auto custom-scrollbar">
          {filteredCustomers.length > 0 ? (
            <div className="py-1 divide-y divide-default/20">
              {filteredCustomers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-subtle/40 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-sans text-xs sm:text-sm font-medium text-heading">
                      {c.name}
                    </span>
                    <span className="font-sans text-xs text-body">{c.phone}</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-0.5">
                    <Badge variant="accent" size="sm" className="h-4.5 px-1.5 text-[10px]">
                      {c.tier}
                    </Badge>
                    <p className="font-sans text-[11px] text-body">
                      {c.pointsBalance} pts
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center">
              <p className="font-sans text-xs text-body mb-2">
                No matching customer found
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSearching(false);
                  setIsNewCustomerModalOpen(true);
                }}
                className="text-xs font-sans text-primary font-medium hover:underline h-auto p-0"
              >
                + Register as new customer
              </Button>
            </div>
          )}
        </div>
      )}

      {/* New Customer Dialog */}
      <NewCustomerDialog
        open={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onSaveCustomer={handleCreateCustomer}
      />
    </div>
  );
}
